<template>
	<div>
		<h1>Firestore</h1>
		data from store : {{ data }}
	</div>
</template>

<script>
import { db } from "@/firebase/index.js";
export default {
	beforeMount() {
		db.collection("test")
			.doc("test-doc")
			.get()
			.then((result) => {
				this.data = result.data();
			})
			.catch((error) => {
				this.data = error.message;
			});
	},
	data() {
		return {
			data: null,
		};
	},
};
</script>

<style></style>
