export const useTheme = () => {
	const isDark = useState("theme-is-dark", () => false);

	const applyTheme = (dark: boolean) => {
		isDark.value = dark;
		if (import.meta.client) {
			document.documentElement.classList.toggle("dark", dark);
			localStorage.setItem("abdspace-theme", dark ? "dark" : "light");
		}
	};

	const toggleTheme = (origin?: HTMLElement) => {
		if (!import.meta.client) return applyTheme(!isDark.value);
		const nextIsDark = !isDark.value;
		const rect = origin?.getBoundingClientRect();
		document.documentElement.style.setProperty("--theme-x", `${rect ? rect.left + rect.width / 2 : window.innerWidth - 32}px`);
		document.documentElement.style.setProperty("--theme-y", `${rect ? rect.top + rect.height / 2 : window.innerHeight - 32}px`);
		document.documentElement.dataset.themeTransition = nextIsDark ? "grow" : "shrink";
		if (document.startViewTransition) document.startViewTransition(() => applyTheme(nextIsDark));
		else applyTheme(nextIsDark);
	};

	if (import.meta.client && !document.documentElement.dataset.themeReady) {
		applyTheme(localStorage.getItem("abdspace-theme") === "dark");
		document.documentElement.dataset.themeReady = "true";
	}

	return { isDark, applyTheme, toggleTheme };
};
