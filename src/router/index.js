import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () => import('@/views/login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/errorPage/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/errorPage/401'),
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: 'dashboard',
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: 'dashboard',
      icon: 'dashboard',
      noCache: true,
      affix: true
    }
  }]
},
{
  path: '/documentation',
  component: Layout,
  redirect: '/documentation/index',
  children: [{
    path: 'index',
    component: () => import('@/views/documentation/index'),
    name: 'Documentation',
    meta: {
      title: 'documentation',
      icon: 'documentation',
      affix: true
    }
  }]
},
{
  path: '/shiplist',
  component: Layout,
  children: [{
    path: 'index',
    component: () => import('@/views/tab/index'),
    name: 'Tab',
    meta: {
      title: '船运管理',
      icon: 'tab'
    }
  }]
},
{
  path: '/guide',
  component: Layout,
  redirect: '/guide/index',
  children: [{
    path: 'index',
    component: () => import('@/views/guide/index'),
    name: 'Guide',
    meta: {
      title: 'guide',
      icon: 'guide',
      noCache: true
    }
  }]
}
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

// export const asyncRouterMap = [
//   {
//     path: '/permission',
//     // component: Layout,
//     redirect: '/permission/index',
//     alwaysShow: true, // will always show the root menu
//     meta: {
//       title: 'permission',
//       icon: 'lock',
//       roles: ['admin', 'editor'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'page',
//         // component: () => import('@/views/permission/page'),
//         name: 'PagePermission',
//         meta: {
//           title: 'pagePermission',
//           roles: ['admin'] // or you can only set roles in sub nav
//         }
//       },
//       {
//         path: 'directive',
//         // component: () => import('@/views/permission/directive'),
//         name: 'DirectivePermission',
//         meta: {
//           title: 'directivePermission'
//           // if do not set roles, means: this page does not require permission
//         }
//       }
//     ]
//   },
//   {
//     path: '/settings',
//     // component: Layout,
//     redirect: '/settings/userManagement',
//     name: 'settings',
//     meta: {
//       title: 'settings',
//       icon: 'component',
//       roles: ['admin']
//     },
//     children: [
//       {
//         path: 'userManagement',
//         // component: () => import('@/views/settings/userManagement'),
//         name: 'userManagement',
//         meta: { title: 'userManagement', icon: 'user', noCache: true }
//       },
//       {
//         path: 'menuManagement',
//         // component: () => import('@/views/settings/menuManagement'),
//         name: 'menuManagement',
//         meta: { title: 'menuManagement', icon: 'tree', noCache: true }
//       }
//     ]
//   },
//   { path: '*', redirect: '/404', hidden: true }
// ]
