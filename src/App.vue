<template>
	<global-loader v-if="loading" />
	<router-view></router-view>
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
		if(!this.user.loggedIn) {
            this.$store.dispatch('loader/pending')
		}
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
* {
	font-family: $F-main;
}
</style>