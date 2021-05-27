import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";
import firebaseAuth from '@/firebase/auth/index'

import ViewTest from '@/views/ViewTest.vue'
import ViewHome from '@/views/ViewHome.vue'
import ViewProfile from '@/views/ViewProfile.vue'
import ViewRestitution from '@/views/ViewRestitution.vue'
import ViewSleepMode from '@/views/ViewSleepMode.vue'
import ViewStatistics from '@/views/ViewStatistics.vue'
import ViewVisualisation from '@/views/ViewVisualisation.vue'
import ViewTest1 from '@/views/ViewTest1.vue'
import ViewTest2 from '@/views/ViewTest2.vue'
import ViewAuthentication from '@/views/ViewAuthentication.vue'

const routes = [
	{
		path: "/",
		name: "home",
		component: ViewHome,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/authentification",
		name: "authentification",
		component: ViewAuthentication,
		meta:{
		  requireAuth: false
		}
	},
	{
		path: "/visualisation",
		name: "visualisation",
		component: ViewVisualisation,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/restitution",
		name: "restitution",
		component: ViewRestitution,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/sommeil",
		component: ViewSleepMode,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/statistiques",
		component: ViewStatistics,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/profil",
		component: ViewProfile,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/test",
		component: ViewTest,
	},
	{
		path: "/generation_pending",
		component: ViewTest1,
	},
	{
		path: "/generation_done",
		component: ViewTest2,
	},
];

const router = createRouter({
    history: createWebHistory(),
    routes
})
//https://medium.com/@gaute.meek/vue-guard-routes-with-firebase-authentication-7a139bb8b4f6

router.beforeEach(async (to, from, next) => {
	const requireAuth = to.matched.some((record) => record.meta.requireAuth);
	const isLoggedIn = store.getters['auth/user'].loggedIn;

	// const t = await firebaseAuth.getCurrentUser()
	// console.log('test', t)
	//redirect to login if not connected
	const currentUser = await firebaseAuth.getCurrentUser();
	console.log(currentUser.email)
	
	if (requireAuth /* && !await firebaseAuth.getCurrentUser() */) {
		next("/authentification");
	}
	//redirect to dashboard if connected and tring to log in
	// else if (!requireAuth && isLoggedIn) {
	// 	next("/");
	// } 
	else {
		next();
	}
});

export default router
