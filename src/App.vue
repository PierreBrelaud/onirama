<template>
	<global-loader v-if="loading" />
	<div 
		class="view"
		:class="{ 'view--full': !isVisible }">
		<router-view @showRestitution="showRestitution"></router-view>
	</div>
	<navigation :showRestitutionMenu="showRestitutionMenu" v-if="isVisible"/>
</template>

<script>
import Navigation from '@/components/layouts/Navigation.vue'
import GlobalLoader from '@/components/layouts/GlobalLoader.vue';
import auth from '@/firebase/auth'
import { mapState } from 'vuex'

export default {
	methods: {
		showRestitution: function() {
			this.showRestitutionMenu = false;
			setTimeout(() => {
				this.showRestitutionMenu = true;
			}, 100)
		}
	},
	data() {
		return {
			showRestitutionMenu: false,
			withoutNav: ['restitution', 'visualisation', 'authentification', 'portal-lab', 'arduino-visualizer']
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
	margin-bottom: 8rem;

	&--full {
		height: 100vh;
		margin-bottom: 0;
		overflow-y: hidden;
		.appview {
			height: 100vh;
		}
	}

	.appview {
		height: calc(100vh - 8rem);
		background-color: $C-extradark;
		box-sizing: border-box;
		color: $C-white;
	}
}
</style>