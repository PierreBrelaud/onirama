import { createRouter, createWebHistory } from 'vue-router'
import { user } from '@/firebase/index'

import Test from '@/views/Test.vue'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Restitution from '@/views/Restitution.vue'
import Statistics from '@/views/Statistics.vue'
import Visualisation from '@/views/Visualisation.vue'
import Authentication from '@/views/Authentication.vue'
import Filter from '@/views/Filter.vue'
import PortalLab from '@/views/PortalLab.vue'

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/authentification",
		name: "authentification",
		component: Authentication,
	},
	{
		path: "/visualisation",
		name: "visualisation",
		component: Visualisation,
	},
	{
		path: "/restitution",
		name: "restitution",
		component: Restitution,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/statistiques",
		component: Statistics,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/profil",
		component: Profile,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/tri",
		component: Filter,
		meta:{
		  requireAuth: true
		}
	},
	{
		path: "/test",
		component: Test,
	},
	{
		path: "/portal-lab",
		component: PortalLab,
	}
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {

	const requireAuth = to.matched.some((record) => record.meta.requireAuth);
	
	if (requireAuth && !await user.getCurrentUser()) {
		next("/authentification");
	}
	else {
		next();
	}
});

export default router
