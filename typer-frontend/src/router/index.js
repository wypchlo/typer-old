import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
    },
    {
        path: '/group/edit/:id',
        name: 'EditGroup',
        component: () => import('../views/GroupDetailsView.vue')
    },
    {
        path: '/group/add',
        name: 'AddGroup',
        component: () => import('../views/AddGroupView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router