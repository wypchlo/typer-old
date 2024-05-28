import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
    },
    {
        path: '/testing',
        name: 'Testing',
        component: () => import('../views/NewHomeView.vue'),
    },
    {
        path: '/set/details/:id',
        name: 'SetDetails',
        component: () => import('../views/SetDetailsView.vue')
    },
    {
        path: '/set/practice/:id',
        name: 'SetPractice',
        component: () => import('../views/SetPracticeView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router