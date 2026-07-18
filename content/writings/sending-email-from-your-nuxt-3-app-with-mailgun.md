---
title: Sending email from your Nuxt 3 app with Mailgun
description: A practical guide to sending email from a Nuxt 3 application with Mailgun and a server-side API endpoint.
createdAt: 2023-10-14T11:03:23.290Z
slug: sending-email-from-your-nuxt-3-app-with-mailgun
readTime: 6
brief: Have you found yourself in a situation where you needed to send emails from your Nuxt application? With Nuxt's server and Mailgun, sending emails directly from your Nuxt 3 app becomes a breeze.
---

Have you found yourself in a situation where you needed to send emails from your Nuxt application? With Nuxt's server and Mailgun, sending emails directly from your Nuxt 3 app becomes a breeze.

To get started, create a Nuxt 3 app using the following command. Ensure that you have Node.js version 16 or newer installed, along with a text editor and a terminal for running these commands:

```bash
npx nuxi@latest init my-app

# select preferred package manager
after the selection, the necessary dependencies will be installed

# initialize git repository
you'll be prompted to initialize a git respository or not

# navigate into your newly created project
cd my-app

# open with vscode
code .

# start the server
yarn dev or npm run dev
```

Now that our application is up and running, in this tutorial, we'll implement a straightforward sign-up process and send a welcome email to new users upon successful registration. To achieve this, we'll create a signup form where users can enter their information and submit it.

For this tutorial, we will work with the `app.vue` file in our application. First, let's clean up the content of `app.vue`. Within this file, we will define a reactive form state to store the data entered by the user. We will also create and style a basic form to gather user inputs.

```vue
<script lang="ts" setup>
const form = reactive({
	name: "",
	email: "",
	password: "",
});

const handleSubmission = () => {
	console.log(form);
	alert("Sign up successful!");
};
</script>

<template>
	<form @submit.prevent="handleSubmission">
		<label for="name">
			Name
			<input v-model="form.name" id="name" type="text" placeholder="Enter your name" required />
		</label>
		<label for="email">
			Email
			<input v-model="form.email" id="email" type="email" placeholder="Enter your email" required />
		</label>
		<label for="password">
			Password
			<input v-model="form.password" id="password" type="password" placeholder="Enter your password" required />
		</label>
		<button type="submit">Sign up</button>
	</form>
</template>

<style scoped>
form {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	max-width: 400px;
	margin: 0 auto;
	margin-top: 30px;
}

form label input {
	box-sizing: border-box;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 15px;
	padding: 15px;
	border: 1px solid #333333;
	border-radius: 10px;
}

form button {
	width: 100%;
	padding: 15px;
	background: #333333;
	color: #ffffff;
	border: none;
}
</style>
```

In the code block above, we declared a reactive `form` state to store user inputs. Additionally, we designed a basic form to collect the user's name, email, and password. Each input field is binded to a `v-model` to ensure the form data is synchronized with the state. We've also defined a function to handle the form submission, and this function is attached to the form element using the `@submit.prevent` directive. The `prevent` modifier is used to prevent the page from reloading when the form is submitted. You can customize the submission handling according to your specific needs, such as sending the data to a server. However, for this tutorial, we will keep it simple and only log the data to the console and display an alert.

Now, if you fill out the form and click the "Sign up" button, your form details will be logged to the console, and an alert dialog will appear, displaying a success message.

To send an email to the user's email after a successful signup, we will use Nuxt 3's server directory to create an API endpoint. This endpoint will handle email sending. Follow these steps:

- Create an `api` folder inside the `server` folder at the root of the application.

- In Nuxt 3, to create an API endpoint, you create a new file in the `api` folder with the method attached to the name of the file. For instance, if you want to create a `GET` endpoint named "hello," you would create a file named `hello.get.ts` if you're using TypeScript or `hello.get.js` if you're using JavaScript. In this case, we're creating an email endpoint with the `POST` method since we're sending data.

- Create a file named `email.post.ts` in the `api` folder.

- In the `email.post.ts` endpoint file, we'll export a default function defined with `defineEventHandler()`. This function will be an asynchronous arrow function that defines the event handler. It'll have an `event` object as its argument, which represents an incoming event or request.

- We'll asynchronously read the body content of the event by calling a `readBody` function. Then we assign the content of the event's body to a `body` variable. This `body` variable will contain the data that we receive in the request body.

This endpoint we just created will eventually be responsible for processing the data from our sign-up form and sending an email to the user's email address.

```typescript
export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	console.log(body);
});
```

Now that we have created an API endpoint accessible at `/api/email`, let's test it by returning to `app.vue`. In this step, we will make a `POST` request to the endpoint using the `form`'s email and name state as the request body. To make this request, we'll utilize `useFetch`, which is a composable provided by Nuxt.

```vue
<script lang="ts" setup>
const form = reactive({
	name: "",
	email: "",
	password: "",
});

const handleSubmission = async () => {
	await useFetch("/api/email", {
		method: "POST",
		body: {
			name: form.name,
			email: form.email,
		},
	});
	console.log(form);
	alert("Sign up successful!");
};
</script>

// rest of the code......
```

Upon submitting the form, you will notice that the name and email are logged to the terminal. Now, let's proceed to send an email to the user's provided email address. To do this, we need to install `mailgun.js` since we will be using Mailgun for sending our emails. If you haven't already, you can create an account with [Mailgun](https://signup.mailgun.com/new/signup) to get started with their email services.

In this tutorial, we will utilize Mailgun's sandbox domain, which has limitations allowing only authorized email addresses to receive emails. If you wish to send emails to all user email addresses and also connect your domain, consider upgrading your Mailgun account.

- Visit your [Mailgun dashboard](https://app.mailgun.com/app/sending/domains) to copy the domain associated with your Sandbox account.

- We then create a `.env` file in the root of our application and paste the copied domain into it.

- To send emails from our application, we'll need an API key from Mailgun. You can create an API key by following this [link](https://app.mailgun.com/settings/api_security).

```bash
MAILGUN_DOMAIN=sandboxxxxxxxxxxxxxxxxxxxxxc.mailgun.org
MAILGUN_API_KEY=f23xxxxxxxxxxxxxxxxxxx-xxxxx-xxxxxx
```

Next, we'll need to install `mailgun.js` to handle the email-sending process.

```bash
# Install mailgun.js
npm i mailgun.js or yarn add mailgun.js
```

In the endpoint file, we will begin by importing `formData` from the `form-data` package in Node.js, as well as `Mailgun` from `mailgun.js`. After the imports, we'll instantiate a Mailgun client by creating a new instance of `Mailgun` and passing `formData` as an argument. Then, using the `mailgun.client` method, we will set up the client with basic authentication credentials, which include the username as 'api' and the API key. The configured client will be assigned to a variable.

Following that, we will create a `data` object that includes the properties to be sent in the email, such as the sender (`from`), recipient (`to`), the subject, and the body of the email. Subsequently, we will call the `create` method of the `message` object within the `mailgun.client` that we assigned to a variable earlier. The `create` method will receive the domain and the `data` object as its arguments.

```typescript
import formData from "form-data";
import Mailgun from "mailgun.js";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const mailgun = new Mailgun(formData);
	const mg = mailgun.client({
		username: "api",
		key: process.env.MAILGUN_API_KEY,
	});

	const data = {
		from: "User <admin@test.test>",
		to: body.email,
		subject: "Welcome to test app!",
		text: `Hi ${body.name}! Welcome to our test app! We're glad to have you onBoard!.`,
	};

	await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
});
```

With these, every time the signup form is submitted successfully, a welcome email will be sent to the user's provided email address.
