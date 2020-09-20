// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'MES云平台系统',
    locale: false,
    siderWidth: 208,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/overview',
      name: '首页',
      layout: false,
      icon: 'WindowsOutlined',
      component: './Overview',
    },
    {
      path: '/company',
      name: '企业管理',
      icon: 'smile',
      component: './Company',
      access: 'company',
    },
    {
      path: '/system',
      name: '权限管理',
      icon: 'HddOutlined',
      access: 'system',
      routes: [
        {
          path: '/system/department',
          name: '部门管理',
          icon: 'TeamOutlined',
          component: './Department',
          access: 'system_department',
        },
        {
          path: '/system/user',
          name: '用户管理',
          icon: 'UserOutlined',
          component: './User',
          access: 'system_user',
        },
        {
          path: '/system/role',
          name: '角色管理',
          icon: 'UserOutlined',
          component: './Role',
          access: 'system_role',
        },
        {
          path: '/system/permission',
          name: '权限资源',
          icon: 'UserOutlined',
          component: './Permission',
          access: 'system_permission',
        },
      ],
    },
    {
      path: '/device',
      name: '设备管理',
      icon: 'ApartmentOutlined',
      routes: [
        {
          path: '/device/device-template',
          name: '设备数据模板',
          icon: 'DeploymentUnitOutlined',
          component: './DeviceTemplate',
        },
        {
          path: '/device/device-property',
          name: '模板属性',
          icon: 'DeploymentUnitOutlined',
          component: './DeviceProperty',
        },
        {
          path: '/device/device-supplier',
          name: '设备供应商',
          icon: 'DeploymentUnitOutlined',
          component: './DeviceSupplier',
        },
        {
          path: '/device/device',
          name: '设备信息',
          icon: 'UngroupOutlined',
          component: './Device',
        },
        {
          path: '/device/device-daily',
          name: '设备数据日统计',
          icon: 'UngroupOutlined',
          component: './DeviceDaily',
        },
      ],
    },
    {
      path: '/project',
      name: '项目构件',
      icon: 'ApartmentOutlined',
      routes: [
        {
          path: '/project/project',
          name: '项目管理',
          icon: 'UngroupOutlined',
          component: './Project',
        },
        {
          path: '/project/frame-member',
          name: '构件管理',
          icon: 'UngroupOutlined',
          component: './FrameMember',
        },
      ],
    },
    {
      path: '/warehouse',
      name: '仓储管理',
      icon: 'ApartmentOutlined',
      routes: [
        {
          path: '/warehouse/work-area',
          name: '工区管理',
          icon: 'UngroupOutlined',
          component: './WorkArea',
        },
        {
          path: '/warehouse/material-supplier',
          name: '原料供应商',
          icon: 'UngroupOutlined',
          component: './MaterialSupplier',
        },
        {
          path: '/warehouse/warehouse-entry',
          name: '原材入库',
          icon: 'UngroupOutlined',
          component: './WarehouseEntry',
        },
        {
          path: '/warehouse/warehouse-storage',
          name: '原材库存',
          icon: 'UngroupOutlined',
          component: './WarehouseStorage',
        },
        {
          path: '/warehouse/warehouse-out',
          name: '原材出库',
          icon: 'UngroupOutlined',
          component: './OutWarehouse',
        },
      ],
    },
    {
      path: '/',
      redirect: '/overview',
    },
    {
      name: '个人设置',
      icon: 'smile',
      path: '/account/settings',
      component: './user/account/AccountSettings',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
