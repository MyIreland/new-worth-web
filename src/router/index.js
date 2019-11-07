import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  }
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/documentation/index'),
  //     name: 'documentation',
  //     meta: { title: 'documentation', icon: 'documentation', noCache: true }
  //   }]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/guide/index'),
  //     name: 'guide',
  //     meta: { title: 'guide', icon: 'guide', noCache: true }
  //   }]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/sysMonitoring',
    component: Layout,
    redirect: '#',
    name: 'SysMonitoring',
    alwaysShow: true, // will always show the root menu
    meta: {
      hasPerm: ['sysMonitoring'],
      title: '系统监控',
      icon: 'eye'
    },
    children: [
      { path: 'dataMonitoring', name: 'DataMonitoring', component: () => import('@/views/sysMonitoring/dataMonitoring/index'), meta: { hasPerm: ['sysMonitoring-data'], title: '数据监控' }},
      { path: 'task', name: 'Task', component: () => import('@/views/sysMonitoring/task/index'), meta: { hasPerm: ['sysMonitoring-task'], title: '任务管理' }}
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '#',
    name: 'System',
    alwaysShow: true, // will always show the root menu
    meta: {
      hasPerm: ['sys'],
      title: '系统管理',
      icon: 'system'
    },
    children: [
      { path: 'menu', name: 'Menu', component: () => import('@/views/system/menu/index'), meta: { hasPerm: ['sys-menu'], title: '菜单管理' }},
      { path: 'dict', name: 'Dict', component: () => import('@/views/system/dict/index'), meta: { hasPerm: ['sys-dict'], title: '字典管理' }},
      { path: 'user', name: 'User', component: () => import('@/views/system/user/index'), meta: { hasPerm: ['sys-user'], title: '用户管理' }},
      { path: 'role', name: 'Role', component: () => import('@/views/system/role/index'), meta: { hasPerm: ['sys-role'], title: '角色管理' }},
      { path: 'file', name: 'File', component: () => import('@/views/system/file/index'), meta: { hasPerm: ['sys-file'], title: '文件管理' }}
    ]
  },
  {
    path: '/platform',
    component: Layout,
    redirect: '#',
    name: 'Platform',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '平台管理',
      hasPerm: ['platform'],
      icon: 'nested'
    },
    children: [
      { path: 'tenant', name: 'Tenant', component: () => import('@/views/platform/tenant/index'), meta: { title: '客户管理', hasPerm: ['platform-tenant'] }},
      { path: 'approval', name: 'Approval', component: () => import('@/views/platform/approval/index'), meta: { title: '审批管理', hasPerm: ['platform-approval'] },
        redirect: '/platform/approval/model',
        children: [
          { path: 'model', name: 'ApprovalModel', component: () => import('@/views/platform/approval/model'), meta: { title: '模型管理', hasPerm: ['platform-approval-model'] }},
          { path: 'task', name: 'ApprovalTask', component: () => import('@/views/platform/approval/task'), meta: { title: '任务管理', hasPerm: ['platform-approval-task'] }},
          { path: 'myApproval', name: 'MyApproval', component: () => import('@/views/platform/approval/myApproval'), meta: { title: '我的审批', hasPerm: ['platform-approval-myApproval'] }}
        ]
      },
      { path: 'icons', name: 'Icons', component: () => import('@/views/svg-icons/index'), meta: { hasPerm: ['platform-icons'], title: '图标管理', icon: 'icon', noCache: true }}
    ]
  },
  {
    path: '/approval',
    component: Layout,
    name: 'Approval',
    redirect: '/approval/model',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '审批管理',
      hasPerm: ['approval'],
      icon: 'excel'
    },
    children: [
      { path: 'model', name: 'ApprovalModel', component: () => import('@/views/approval/model'), meta: { title: '模型管理', hasPerm: ['approval-model'] }},
      { path: 'task', name: 'ApprovalTask', component: () => import('@/views/approval/task'), meta: { title: '任务管理', hasPerm: ['approval-task'] }},
      { path: 'myApproval', name: 'MyApproval', component: () => import('@/views/approval/myApproval'), meta: { title: '我的审批', hasPerm: ['approval-myApproval'] }}
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock'
    },
    children: [{
      path: 'page',
      component: () => import('@/views/permission/page'),
      name: 'pagePermission',
      meta: {
        title: 'pagePermission'
      }
    }, {
      path: 'directive',
      component: () => import('@/views/permission/directive'),
      name: 'directivePermission',
      meta: {
        title: 'directivePermission'
      }
    }]
  },
  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
      { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
      { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
      { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
      { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
      { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
      { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
      { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
      { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
      { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
      { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
      { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
      { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
    ]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
      { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/tab/index'),
      name: 'tab',
      meta: { title: 'tab', icon: 'tab' }
    }]
  },
  {
    path: '/table',
    component: Layout,
    redirect: '/table/complex-table',
    name: 'table',
    meta: {
      title: 'Table',
      icon: 'table'
    },
    children: [
      { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
      { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
      { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
      { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
      { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
      { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
      { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
      { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
      { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [{ path: 'download', component: () => import('@/views/zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  },

  { path: '*', redirect: '/404', hidden: true }
]
