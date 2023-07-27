import * as components from './components_ex';
import * as externals from './externals';
import * as modules from './modules';

const PAGE_LIST = {
  ...components,
  ...externals,
  ...modules,
};

export default [
  {
    path: '/Slider',
    name: 'Slider 组件',
    component: PAGE_LIST.Slider,
    meta: {
      style: 1,
    },
  },
  {
    path: '/TabHost',
    name: 'TabHost 组件',
    component: PAGE_LIST.TabHost,
    meta: {
      style: 1,
    },
  },
  {
    path: '/NestedScroll',
    name: 'Nested Scroll 示例',
    component: PAGE_LIST.NestedScroll,
    meta: {
      style: 1,
    },
  },
  {
    path: '/ListViewEx',
    name: '双向列表组件',
    component: PAGE_LIST.ListViewEx,
    meta: {
      style: 1,
    },
  },
  {
    path: '/SVGDemo',
    name: 'SVG 组件',
    component: PAGE_LIST.SVGDemo,
    meta: {
      style: 1,
    },
  },
  {
    path: '/LayoutDemo',
    name: 'LayoutDemo 范例',
    component: PAGE_LIST.LayoutDemo,
    meta: {
      style: 1,
    },
  },
  {
    path: '/StyleDemo',
    name: 'StyleDemo 范例',
    component: PAGE_LIST.StyleDemo,
    meta: {
      style: 1,
    },
  },
  {
    path: '/BoxShadow',
    name: 'BoxShadow 范例',
    component: PAGE_LIST.BoxShadow,
    meta: {
      style: 1,
    },
  },
  {
    path: '/WebSocket',
    name: 'WebSocket 模块',
    component: PAGE_LIST.WebSocket,
    meta: {
      style: 2,
    },
  },
  {
    path: '/AsyncStorage',
    name: 'AsyncStorage 模块',
    component: PAGE_LIST.AsyncStorage,
    meta: {
      style: 2,
    },
  },
  {
    path: '/Animation',
    name: 'Animation 组件',
    component: PAGE_LIST.Animation,
    meta: {
      style: 2,
    },
  },
  {
    path: '/Clipboard',
    name: 'Clipboard 组件',
    component: PAGE_LIST.Clipboard,
    meta: {
      style: 2,
    },
  },
  {
    path: '/NetInfo',
    name: 'Network 能力',
    component: PAGE_LIST.NetInfo,
    meta: {
      style: 2,
    },
  },
  {
    path: '/UIManagerModule',
    name: 'UIManagerModule 模块',
    component: PAGE_LIST.UIManagerModule,
    meta: {
      style: 2,
    },
  },
  {
    path: '/SetNativeProps',
    name: 'setNativeProps能力',
    component: PAGE_LIST.SetNativeProps,
    meta: {
      style: 2,
    },
  },
  {
    path: '/DynamicImport',
    name: 'DynamicImport 能力',
    component: PAGE_LIST.DynamicImport,
    meta: {
      style: 2,
    },
  },
  {
    path: '/Localization',
    name: 'Localization 信息',
    component: PAGE_LIST.Localization,
    meta: {
      style: 2,
    },
  },
  {
    path: '/Turbo',
    name: 'Turbo',
    component: PAGE_LIST.Turbo,
    meta: {
      style: 2,
    },
  },
];
