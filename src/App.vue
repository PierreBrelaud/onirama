<template>
	<global-loader v-if="loading" />
	<navigation />
</template>

<script>
import Navigation from '@/components/layouts/Navigation.vue'
import GlobalLoader from '@/components/layouts/GlobalLoader.vue';

import { mapState } from 'vuex'
export default {
	computed: {
		...mapState('loader', ['loading'])
	},
	components: {
		Navigation,
		GlobalLoader
	}
}
</script>

<style lang='scss'>
@import "assets/scss/main";
</style>