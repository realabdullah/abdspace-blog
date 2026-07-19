---
title: Testing a Nuxt Monorepo Without Losing Your Mind
description: Centralised configs, isolated component tests, and reliable E2E with Vitest & Playwright, without the mocking headache.
brief: Testing a standard, single-package app is pretty straightforward. But a Nuxt monorepo? That can get messy very fast. When you're dealing with multiple shared packages...
createdAt: 2026-07-15T12:12:54.476Z
readTime: "10"
slug: testing-a-nuxt-monorepo-without-losing-your-mind
---

Testing a standard, single-package app is pretty straightforward. But a Nuxt monorepo? That can get messy very fast.

When you're dealing with multiple shared packages, utilities, auto-imports, and all that framework-specific magic, it’s easy to end up with test suites that are either completely shallow or just annoyingly brittle. I recently had to set up the tests for a monorepo I maintain, and to be honest, I just wanted a setup that made sense. I needed something easy to run, easy to understand, and solid enough to give me actual confidence as the codebase grows.

My plan was simple, just nail the foundation first. Unit tests for the logic, component tests for the UI, and Playwright for the end-to-end stuff.

Here’s a walkthrough of the setup I ended up building with Vitest and Playwright.

**The Lay of the Land**

Before I start throwing configs around, let's talk about the shape of the codebase I'm working with.

I'm running a pnpm workspace. The codebase is split pretty traditionally, looking something like this:

```plaintext
├── apps/                 # Where the actual Nuxt applications live
├── packages/
│   └── ui-layer/         # Shared UI components consumed by the apps
├── package.json
├── pnpm-workspace.yaml
├── playwright.config.mts
└── vitest.config.ts
```

The most important guys here are the `vitest.config.ts` and `playwright.config.mts`. And do you notice where they are at? Right at the root of the repo.

I didn't want an approach where I had to scatter separate test configurations inside every single app and package folders. I wanted it to be from the top-down. A centralised config makes it way easier to run everything at once, keeps the tooling dependencies clean and ensures no part of the codebase is doing weird things in its own isolated test environment. It basically just guarantees consistent behaviour across the board.

**The Gear**

Let's not bore ourselves with a step-by-step installation guide like you see in most posts. You know how to use your package manger. But for this setup to work, here is the tooling l installed at the root of my workspace:

- `vitest` The core runner.
- `@nuxt/test-utils` Nuxt's official testing utility (crucial for the component side of things).
- `@vue/test-utils` & `happy-dom` For mounting and interacting with the UI in Vitest.
- `@testing-library/vue`
- `@vitejs/plugin-vue` Needed so Vitest knows what to do with ⁠.vue⁠ files when running outside of the Nuxt environment.
- `@playwright/test` For the end-to-end stuff.
- `@vitest/coverage-v8` For when you want to see those coverage metrics.

Just make sure these are installed as `devDependencies⁠` at your monorepo root, not in the individual apps.

**Phase 1: The Root Vitest Config (One Config to Rule Them All)**

Here is where the magic happens, as mentioned earlier, I'm setting up in the root, so I wrote one single dynamic config to rule all the apps and packages.

The idea here is strict separation of concerns. I split the test runner into three distinct project types for every single workspace based on filename suffix:

1. Unit Tests (`*.unit.spec.ts`): Runs purely in Node. Super fast, meant for business logic, utilities and composables.
2. Component Tests (`*.component.spec.ts`): Runs in `happy-dom` with the Vue plugin enabled. Meant for testing actual `.vue` files and UI behaviour.
3. Nuxt Tests (`*.nuxt.spec.ts`): Runs in a `nuxt` environment. For components tightly coupled to the Nuxt framework (auto-imports and all that).

Here is the `vitest.config.ts` in its full glory lol:

```typescript
import { defineVitestProject } from "@nuxt/test-utils/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const workspaceRoot = process.cwd();
const uiLayerRoot = resolve(workspaceRoot, "packages/ui-layer");

// nuxt loads the layer config while resolving each runtime project.
const workspaces = [
  { name: "admin", root: resolve(workspaceRoot, "apps/admin") },
  { name: "distributor", root: resolve(workspaceRoot, "apps/distributor") },
  { name: "provider", root: resolve(workspaceRoot, "apps/provider") },
  { name: "ui-layer", root: uiLayerRoot },
];

export default defineConfig(async () => {
  const unitProjects = workspaces.map(({ name, root }) => ({
    extends: true as const,
    root,
    resolve: {
      alias: {
        "@mca/ui-layer": uiLayerRoot,
        "@": root,
        "~": root,
      },
    },
    test: {
      name: `unit-${name}`,
      include: ["**/*.unit.spec.ts"],
      environment: "node" as const,
      setupFiles: [resolve(workspaceRoot, "test/setup.ts")],
    },
  }));

  const componentProjects = workspaces.map(({ name, root }) => ({
    extends: true as const,
    root,
    plugins: [vue({})],
    resolve: {
      alias: {
        "@mca/ui-layer": uiLayerRoot,
        "@": root,
        "~": root,
      },
    },
    test: {
      name: `component-${name}`,
      include: ["**/*.component.spec.ts"],
      environment: "happy-dom" as const,
      setupFiles: [resolve(workspaceRoot, "test/setup.ts")],
    },
  }));

  const nuxtProjects = [];
  if (process.env.VITEST_NUXT === "true") {
    for (const { name, root } of workspaces) {
      nuxtProjects.push(
        await defineVitestProject({
          test: {
            name: `nuxt-${name}`,
            include: ["**/*.nuxt.spec.ts"],
            environment: "nuxt",
            environmentOptions: {
              nuxt: {
                rootDir: root,
                domEnvironment: "happy-dom",
              },
            },
          },
        })
      );
    }
  }

  return {
    test: {
      globals: true,
      clearMocks: true,
      restoreMocks: true,
      projects: [...unitProjects, ...componentProjects, ...nuxtProjects],
      coverage: {
        provider: "v8" as const,
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "./coverage",
        exclude: [
          "**/*.unit.spec.ts",
          "**/*.component.spec.ts",
          "**/*.d.ts",
          "**/.nuxt/**",
          "**/.output/**",
          "**/node_modules/**",
          "**/*.config.*",
          "test/**"],
      },
    },
  };
});

```

**Why this works so well**

1. No DOM overhead for pure logic: Notice how the `unitProjects` use `environment: "node"` and doesn't load the Vue plugin? If I'm testing a utility function that formats a currency string, I don't need to boot up a simulated browser environment. It keeps the unit tests blazing fast.
2. Handling Cross-Workspace Aliasing: When you test outside of the Nuxt context, Vitest has no idea what `~`⁠ or `@`⁠ means. By explicitly mapping `@mca/ui-layer⁠` and the Nuxt aliases (`⁠@⁠,` `~`⁠) dynamically to each workspace's root, imports resolve seamlessly without Nuxt having to hold our hand.

**Pro-Tip: The Setup File**

You might notice this line `setupFiles: [resolve(workspaceRoot, "test/setup.ts")]` in the config. Because my unit tests runs in Node, they don't have access to browser APIs. I use this to dynamically polyfill things like `localStorage⁠` only when the environment needs it, without overwriting `happy-dom⁠'s` native implementation.

```typescript
import { vi } from "vitest";

const createStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, String(value)),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size;
    },
  };
};

for (const key of ["localStorage", "sessionStorage"] as const) {
  if (typeof globalThis[key]?.getItem !== "function") {
    vi.stubGlobal(key, createStorage());
  }
}
```

*This simple check makes the setup file completely polymorphic across both environments.*

**Phase 2: UI Components**

Testing Vue components in a monorepo could get messy when you try to boot up Nuxt just to test a simple button. But because I separated my `componentProjects` to run in `happy-dom` in the Vitest config, I can test my shared UI layer instantly.

Let's look at a component from the `packages/ui-layer` folder. Here is a standard test for a Badge.vue component:

```typescript
import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import Badge from "./badge.vue";

describe("Badge", () => {
  it("renders its label from props", async () => {
    render(Badge, { props: { label: "Active" } });

    // Testing what the user actually sees
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders a named label slot when provided", async () => {
    render(Badge, {
      slots: { label: "Custom label" },
    });

    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });
});
```

**The Beauty of Isolation**

Look at the imports. Notice what's missing? **Nuxt.** This is a pure Vue component test using `@testing-library/vue`. Because this component lives in my shared `ui-layer` package and relies on standard Vue props and slots, it is completely framework-agnostic. The Vitest config mounts it in `happy-dom`, verifies the DOM output, and gets out of the way fast.

By choosing to test these presentational components in isolation and focusing strictly on what the user actually sees on the screen, I avoid dealing with high maintenance tests altogether..

**Phase 3:** The Framework Gray Area (Nuxt Auto-Imports)

If you’re looking at that `vitest.config.ts&#x60; and thinking, *"Hmmmnn, I see a nuxtProjects block. How does this handle components that actually use Nuxt stuffs like*&#x20;`useFetch`*,*&#x20;`useRoute`*, or*&#x20;`useRuntimeConfig`*?"*

Testing these components usually forces you into a terrible compromise. You might be spending hours trying to manually mock the router, fetch interceptors, auto-imports, etc, descending into "mocking hell" (if that's a thing), or you boot up a full Nuxt context for every single standard test, making the fast unit tests to be annoyingly slow.

I don't want to do any of that. This is exactly what the `*.nuxt.spec.ts` layer solves.

Using `@nuxt/test-utils/vitest`, I spinned up a lightweight Nuxt context natively within Vitest. Composables, plugins, and routing just work, completely mock-free. Because I isolate these tests by filename suffix and gate them behind an environment variable, they don't bog down the rest of my standard unit tests. I test the Nuxt logic natively, without writing 50 lines of setup code just to get a component to render.

**Enter Playwright**

So, if Vitest is handling pure logic, isolated components, and even Nuxt-coupled components, what is left?

Actual user journeys.

Vitest is good at verifying that a component works in isolation. But verifying that a user can successfully click through your flow, log into the dashboard, and submit a form across multiple routes? That is a job for Playwright.

Playwright boots up the real Nuxt server in a real browser. You test the app exactly how a user interacts with it across a full end-to-end flow.

**Phase 3: The Playwright Setup**

The codebase has multiple apps sitting in the `apps/` directory. I'm definitely not going to be opening three terminal tabs to manually boot up dev servers every time I want to run E2E tests.

Instead, I just let the root `playwright.config.mts` handle the orchestration.

```typescript
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";

export default defineConfig<ConfigOptions>({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  outputDir: "./test-results/playwright",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "admin-chromium",
      testMatch: "admin/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        nuxt: { rootDir: fileURLToPath(new URL("./apps/admin", import.meta.url)) },
      },
    },
    {
      name: "distributor-chromium",
      testMatch: "distributor/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        nuxt: { rootDir: fileURLToPath(new URL("./apps/distributor", import.meta.url)) },
      },
    },
    {
      name: "provider-chromium",
      testMatch: "provider/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        nuxt: { rootDir: fileURLToPath(new URL("./apps/provider", import.meta.url)) },
      },
    },
  ],
});
```

**Why this works so well**

There are two details in this config that save me from doing manual setup:

1. **The** `@nuxt/test-utils/playwright` **Integration:** Instead of standard Playwright types, I typed the config with `<ConfigOptions>` from Nuxt's official test utilities. This exposes the `nuxt` key in the `use` block.
2. **Project-Scoped Roots:** In the `projects` array, I explicitly pass the path to each app's directory using `fileURLToPath`.

Because of this, Playwright is smart. When I run `npx playwright test`, it looks at the project, maps it to the correct directory in my monorepo, automatically builds and boots the local Nuxt server for that specific app, runs the tests inside a real browser, and shuts the server down when it's finished.

I don't have to manage any local ports, I don't have to coordinate server lifecycles in my CI/CD pipeline, and I don't have to manually mock a single API call. It just works.

**The Pragmatic Monorepo**

Setting up tests in a monorepo usually feels like fighting against your tools. But by letting each tool do exactly what it was built for, testing actually becomes invisible.

- **Vitest (Node)** handles pure logic in milliseconds.
- **Vitest (Happy-DOM)** handles framework-agnostic presentational components instantly.
- **Vitest (Nuxt)** handles framework-coupled components natively, without the mocking hell.
- **Playwright** boots up the apps to test full end-to-end user journeys like a real browser.
- **The Root Configs** act as the orchestrators, meaning I don't have to jump between a terminal tabs to get confidence in my code.

I don't think I need 100% test coverage on every single layer. I just need tests that are fast, reliable, and actually catch bugs without forcing me to write 50 lines of setup code just to render a button. By drawing hard boundaries between Node, isolated UI, simulated Nuxt contexts, and Playwright, testing actually feels productive again.

How are you handling your Nuxt monorepos? Have you adopted a layered approach to your testing environments, or are you tackling the configuration differently? Let me know what you think.
