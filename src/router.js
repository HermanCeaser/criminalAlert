import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import firebase from "firebase";
require("firebase/auth");

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/map',
        name: 'map',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Home
    },
    {
        path: '/reportCriminal',
        name: 'reportCriminal',
        meta: { requiresAuth: true },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => { return import('./views/ReportCriminal.vue') }
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => { return import('./views/About.vue') }
    },
    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => { return import('./views/Login.vue') }
    },
    {
        path: '/register',
        name: 'register',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => { return import('./views/Register.vue') }
    },
    {
        path: '/resetCredentials',
        name: 'resetCredentials',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => { return import('./views/ResetCredentials.vue') }
    },
    {
        path: '/user',
        name: 'user',
        meta: { requiresAuth: true },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => { return import('./views/User.vue') }
    }
    ]
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    let isAuthenticated = firebase.auth().currentUser;

    if (isAuthenticated !== null) {
        isAuthenticated = isAuthenticated.emailVerified;
    }

    if (requiresAuth && !isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;
