import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)//开发环境不使用懒加载
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import Login from '../views/login/index'
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Login,
    name: '登录',
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    leaf: true,
    menuShow: true,
    // hidden: true,
    meta: { title: '首页', icon: 'organization' },
      children: [{
        path: 'index',
        name: '首页测试1',
        // menuShow: true,
        meta: { title: '首页测试', icon: 'manage' },
        component: _import('dashboard/index')
      }]
  },
  //以前可用的登录首页 现在要改掉
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: '首页1',
  //   children: [{
  //     path: 'dashboard',
  //     component: _import('dashboard/index')
  //   }]
  // },
  {
    path: '/org',
    component: Layout,
    redirect: '/org/info',
    name: '机构管理',
    meta: { title: '机构管理', icon: 'organization' },
    roles: ['admin'],
    children: [{
      path: 'info',
      name: 'orgInfo',
      component: _import('org/OrgInfo'),
      meta: { title: '机构维护', icon: 'manage' }
    }, {
      path: 'add',
      name: 'orgAdd',
      hidden: true,
      component: _import('org/OrgAdd'),
      meta: { title: '机构新增', icon: 'manage' }
    }, {
      path: 'edit',
      name: 'orgEdit',
      hidden: true,
      component: _import('org/OrgEdit'),
      meta: { title: '机构修改', icon: 'manage' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/info',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'organization' },
    roles: ['admin'],
    children: [{
      path: 'info',
      name: 'userInfo',
      component: _import('user/userInfo'),
      meta: { title: '用户信息', icon: 'manage' }
    }, {
      path: 'test',
      name: 'userList',
      component: _import('user/userList'),
      meta: { title: '用户测试列表', icon: 'manage' }
    }, {
        path: 'add',
        name: 'add',
        hidden: true,
        component: _import('user/userAdd'),
        meta: { title: '用户新增', icon: 'manage' }
      }, {
        path: 'userAdd',
        name: 'userAdd',
        hidden: true,
        component: _import('user/userAdd1'),
        meta: { title: '用户测试列表新增新增', icon: 'manage' }
      },{
        path: 'natural',
        name: 'naturalPersonList',
        component: _import('user/naturalPersonList'),
        meta: { title: '自然人客户列表', icon: 'manage' }
      },{
      path: 'tabtest',
      name: 'tabtest',
      component: _import('user/tabTest'),
      meta: { title: 'tabtest', icon: 'manage' },
      children: [{
        path: 'tabtest1',
        name: 'tabtest1',
        component: _import('user/tabTest1'),
        meta: { title: 'tabtest1', icon: 'manage' }
      },
        {
          path: 'tabtest2',
          name: 'tabtest2',
          component: _import('user/tabTest2'),
          meta: { title: 'tabtest2', icon: 'manage' }
        }]
    }, {
        path: 'tabtest1',
        name: 'tabtest1',
        component: _import('user/tabTest1'),
        meta: { title: 'tabtest1', icon: 'manage' }
      },{
      path: 'userEdit',
      name: 'userEdit',
      hidden: true,
      component: _import('user/userEdit'),
      meta: { title: '用户测试列表修改', icon: 'manage' }
    }]
  },


  {
    path: '/contract',             //主路径需要更改
    component: Layout,
    //redirect: '/contract/info',    //重定向需要更改,info改成什么？
    redirect: '/contract/list', 	//路由
    name: '合同管理',
    meta: { title: '合同管理', icon: 'organization' },
    roles: ['admin'],     //这里需要更改
    children: [{
      path: 'info',
      name: 'orgInfo',
      component: _import('contract/loanContract'),    //更改
      meta: { title: '贷款合同', icon: 'manage' }
    }, {
      path: 'info',
      name: 'orgInfo',
      hidden: false,
      component: _import('org/OrgInfo'),        //组件还没有引出来
      meta: { title: '内部银团合同', icon: 'manage' }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开 注意: 这个功能只在 HTML5 history 模式下可用。
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

