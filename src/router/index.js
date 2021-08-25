import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout'
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        hidden: false,
        redirect: 'cat',
        children: [
            {
                path: 'cat',
                name: '喵',
                meta: {
                    title: '喵喵',
                    icon: 'documentation'
                },
                component: () => import('@/views/Cat.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/aboutP',
        component: Layout,
        redirect: '/aboutP/about2',
        name: 'aboutP',
        meta: {
            title: 'cloudy',
            icon: 'el-icon-cloudy'
        },
        children: [
            {
                path: 'about2',
                component: () => import('@/views/Aboute2'),
                name: 'About2',
                meta: { title: 'About2' }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        hidden: true
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/error',
        component: Layout,
        redirect: 'noRedirect',
        name: 'ErrorPages',
        meta: {
            title: 'Error Pages',
            icon: '404'
        },
        hidden: true,
        children: [
            {
                path: '401',
                component: () => import('@/views/error-page/401'),
                name: 'Page401',
                meta: { title: '401', noCache: true }
            },
            {
                path: '404',
                component: () => import('@/views/error-page/404'),
                name: 'Page404',
                meta: { title: '404', noCache: true }
            }
        ]
    },
    // 404 page must be placed at the end !!!
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
        hidden: true
    }
]
console.log('BASE_URL ', process.env.BASE_URL)
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter({
        history: createWebHistory(process.env.BASE_URL),
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    })
    router.matcher = newRouter.matcher // reset router
}
export default router
