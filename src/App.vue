<template>
	<global-loader v-if="loading" />
	<div 
		class="view"
		:class="{ 'view--full': !isVisible }">
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
	data() {
		return {
			withoutNav: ['restitution', 'visualisation', 'authentification', 'portal-lab']
		}
	},
	created() {
		auth.onAuthChanged()
	},
	computed: {
		...mapState('loader', ['loading']),
		...mapState('auth', ['user']),
		isVisible() {
			return !this.withoutNav.includes(this.$route.name)
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

	&--full {
		height: 100vh;
		margin-bottom: 0;
	}
}
</style>