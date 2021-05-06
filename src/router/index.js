import { createRouter, createWebHistory } from 'vue-router'

import ViewTest from '@/views/ViewTest.vue'
import ViewHome from '@/views/ViewHome.vue'
import ViewProfile from '@/views/ViewProfile.vue'
import ViewRestitution from '@/views/ViewRestitution.vue'
import ViewSleepMode from '@/views/ViewSleepMode.vue'
import ViewStatistics from '@/views/ViewStatistics.vue'
import ViewVisualisation from '@/views/ViewVisualisation.vue'
import ViewTest1 from '@/views/ViewTest1.vue'
import ViewTest2 from '@/views/ViewTest2.vue'

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

export default router
