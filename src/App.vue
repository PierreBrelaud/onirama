<template>
	<global-loader v-if="loading" />
	<div class="view">
		<router-view></router-view>
	</div>
	<navigation v-if="isVisible"/>
</template>

<script>
import Navigation from '@/components/layouts/Navigation.vue'
import GlobalLoader from '@/components/layouts/GlobalLoader.vue';
import auth from '@/firebase/auth'
import { mapState } from 'vuex'

export default {
	created() {
		auth.onAuthChanged()
	},
	computed: {
		...mapState('loader', ['loading']),
		...mapState('auth', ['user']),
		isVisible() {
			return this.$route.name !== 'restitution'
		}
	},
	components: {
		Navigation,
		GlobalLoader
	}
}
</script>

<style lang='scss'>
.view {
	height: calc(100vh - 8rem);
	overflow-y: auto;
	overflow-x: hidden;
	margin-bottom: 8rem;
}
</style>