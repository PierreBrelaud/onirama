import { createRouter, createWebHistory } from 'vue-router'

import ViewTest from '@/views/ViewTest.vue'
import ViewHome from '@/views/ViewHome.vue'
import ViewProfile from '@/views/ViewProfile.vue'
import ViewRestitution from '@/views/ViewRestitution.vue'
import ViewSleepMode from '@/views/ViewSleepMode.vue'
import ViewStatistics from '@/views/ViewStatistics.vue'
import ViewVisualisation from '@/views/ViewVisualisation.vue'

const routes = [
	{
		path: "/",
		name: "home",
		component: ViewHome,
	},
	{
		path: "/visualisation",
		name: "visualisation",
		component: ViewVisualisation,
	},
	{
		path: "/restitution",
		name: "restitution",
		component: ViewRestitution,
	},
	{
		path: "/sommeil",
		component: ViewSleepMode,
	},
	{
		path: "/statistiques",
		component: ViewStatistics,
	},
	{
		path: "/profil",
		component: ViewProfile,
	},
	{
		path: "/test",
		component: ViewTest,
	},
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
