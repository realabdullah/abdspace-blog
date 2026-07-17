---
title: Building a simple rating component with Vue 3
brief: A rating component which is sometimes referred to as a star rating component, is a user-facing element that allows users to provide feedback or rate something, typically on a scale, and just to display the rating of something sometimes. It's used in ...
createdAt: 2023-10-12T21:06:23.034Z
description: A rating component which is sometimes referred to as a star rating component, is a user-facing element that allows users to provide feedback or rate something, typically on a scale, and just to display the rating of something sometimes. It's used in many applications and websites to collect user opinions, feedback, or reviews by assigning a certain number of stars or other symbols to represent a rating.
readTime: "4"
slug: building-a-simple-rating-component-with-vue-3
---

A rating component which is sometimes referred to as a star rating component, is a user-facing element that allows users to provide feedback or rate something, typically on a scale, and just to display the rating of something sometimes. It's used in many applications and websites to collect user opinions, feedback, or reviews by assigning a certain number of stars or other symbols to represent a rating.

In this post, we'll be building a basic and simple rating reusable rating component using Vue 3.

We'll begin by creating a new Single File Component (SFC) named "Rate.vue" within our current Vue 3 project. If you're exploring, you can also use Vue's [playground](https://play.vuejs.org/). Inside the Rate component, we'll include the necessary HTML elements.

```vue
<template>
	<div class="wrapper">
		<span class="star">★</span>
		<span class="star">★</span>
		<span class="star">★</span>
		<span class="star">★</span>
		<span class="star">★</span>
	</div>
</template>
```

The above code block will render the following UI:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1697142132842/b55975cd-b4ca-46fa-9c52-0ac4fca86f83.png)

Next, let's introduce some JavaScript code to enhance the interactivity of our user interface. This involves specifying props, emits, and a function to update/emit ratings as needed.

We start by declaring props using pure type annotations. Props can be defined using [defineProps](https://vuejs.org/guide/components/props.html#props-declaration).

```vue
import { defineProps } from "vue"; const props = defineProps<{ value: number; totalRating: number; }>();
```

In Vue, a component can explicitly declare the events it will emit using the [defineEmits](https://vuejs.org/guide/components/events.html#declaring-emitted-events) macro, in our case, which is to declare an `update-rating` event with an argument. We'll be doing this using pure type annotations like so:

```vue
import { defineEmits } from "vue"; defineEmits<(event: "update-rating", value: number) => void>();
```

Now, we will use a loop to dynamically render the `span` element based on the `totalRating` prop:

```vue
<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
	value: number;
	totalRating: number;
}>();

const emit = defineEmits<(event: "update-rating", value: number) => void>();
</script>

<template>
	<div class="wrapper">
		<span v-for="star in totalRating" :key="star" class="star">★</span>
	</div>
</template>
```

Moving forward, we can now utilize our Rating component in another component, which has the `rating` and `totalRating` states, which will be supplied as props to the Rating component.

```vue
<script setup>
import Rating from "./Rating.vue";
import { ref } from "vue";

const rating = ref(3);
const totalRating = ref(5);
</script>

<template>
	<Rating :value="rating" :total-rating="totalRating" />
</template>
```

Indeed, it's important to note that, at this point, there haven't been any visible changes in our user interface. The reason is that we have yet to apply styles to the "Rating" component. Now, it's time to add the necessary styles to enhance the appearance and presentation of the "Rating" component:

```vue
<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
	value: number;
	totalRating: number;
}>();

const emit = defineEmits<(event: "update-rating", value: number) => void>();
</script>

<template>
	<div class="wrapper">
		<span v-for="star in totalRating" :key="star" class="star">★</span>
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	align-items: center;
	gap: 2px;
}

.star {
	cursor: pointer;
	color: #d8d8d8;
}

.star:hover,
.star:active,
.star.filled {
	color: orange;
}
</style>
```

Currently, there may not be any noticeable changes, but if you hover over the stars, you will observe a color change to orange. Our next step is to visually indicate the current rating value by conditionally applying a class to the `span` element. When the current star is less than or equal to the `value` prop that we previously declared, we will add a `filled` class to the element.

```html
<span v-for="star in totalRating" :key="star" class="star" :class="{ filled: star <= value }">★</span>
```

With this modification, you can now observe the current rating value in the user interface, represented with varying colors to distinguish between filled and unfilled stars.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1697141096435/ff56bece-c871-40a8-966f-d740123e2639.png)

The final piece to complete our implementation is to introduce a functionality for setting new ratings. We will create a `setRating` function for updating the rating and emitting the new value to the parent component. This function will then be attached to the `span` element as a click event handler.

```vue
<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
	value: number;
	totalRating: number;
}>();

const emit = defineEmits<(event: "update-rating", value: number) => void>();

const setRating = (star: number) => {
	emit("update-rating", star);
};
</script>

<template>
	<div class="wrapper">
		<span v-for="star in totalRating" :key="star" class="star" :class="{ filled: star <= value }" @click="setRating(star)">★</span>
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	align-items: center;
	gap: 2px;
}

.star {
	cursor: pointer;
	color: #d8d8d8;
}

.star:hover,
.star:active,
.star.filled {
	color: orange;
}
</style>
```

In the parent component, we listen for the "update-rating" event allowing us to respond to changes in the rating value and update the rating state accordingly. This ensures that any changes made in the "Rating" component are reflected and managed in the parent component:

```vue
<script setup>
import Rating from "./Rating.vue";
import { ref } from "vue";

const rating = ref(3);
const totalRating = ref(5);
</script>

<template>
	<Rating :value="rating" :total-rating="totalRating" @update-rating="rating = $event" />
</template>
```

Excellent! We've successfully created a reusable Rating component that enables users to review and rate products or any other items in your project. This component can be further extended to accommodate various icons or symbols by utilizing [slots](https://vuejs.org/guide/components/slots.html). Additionally, it can be customized to display the rating of a product or other items without allowing user interaction.
