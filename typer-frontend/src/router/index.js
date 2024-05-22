import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
    },
    {
        path: '/set/details/:id',
        name: 'SetDetails',
        component: () => import('../views/SetDetailsView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router