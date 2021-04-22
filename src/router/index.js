import { createRouter, createWebHistory } from 'vue-router'

import ViewTest from "@/views/ViewTest.vue";

const routes = [
    {
        path: '/test',
        component: ViewTest
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router