import * as components from './components';

const PAGE_LIST = {
  ...components,
};

export default [
  {
    path: '/View',
    name: 'View 组件',
    component: PAGE_LIST.View,
    meta: {
      style: 1,
    },
  },
  {
    path: '/Text',
    name: 'Text 组件',
    component: PAGE_LIST.Text,
    meta: {
      style: 1,
    },
  },
  {
    path: '/Image',
    name: 'Image 组件',
    component: PAGE_LIST.Image,
    meta: {
      style: 1,
    },
  },
  {
    path: '/ScrollView',
    name: 'ScrollView 组件',
    component: PAGE_LIST.ScrollView,
    meta: {
      style: 1,
    },
  },
  {
    path: '/ListView',
    name: 'ListView 组件',
    component: PAGE_LIST.ListView,
    meta: {
      style: 1,
    },
  },
  {
    path: '/WaterfallView',
    name: 'WaterfallView 组件',
    component: PAGE_LIST.WaterfallView,
    meta: {
      style: 1,
    },
  },
  {
    path: '/PullHeader',
    name: 'PullHeader/Footer组件',
    component: PAGE_LIST.PullHeaderFooter,
    meta: {
      style: 1,
    },
  },
  {
    path: '/RefreshWrapper',
    name: 'RefreshWrapper 组件',
    component: PAGE_LIST.RefreshWrapper,
    meta: {
      style: 1,
    },
  },
  {
    path: '/ViewPager',
    name: 'ViewPager 组件',
    component: PAGE_LIST.ViewPager,
    meta: {
      style: 1,
    },
  },
  {
    path: '/TextInput',
    name: 'TextInput 组件',
    component: PAGE_LIST.TextInput,
    meta: {
      style: 1,
    },
  },
  {
    path: '/Modal',
    name: 'Modal 组件',
    component: PAGE_LIST.Modal,
    meta: {
      style: 1,
    },
  },
  {
    path: '/WebView',
    name: 'WebView 组件',
    component: PAGE_LIST.WebView,
    meta: {
      style: 1,
    },
  },
  {
    path: '/RippleViewAndroid',
    name: 'RippleViewAndroid 组件',
    component: PAGE_LIST.RippleViewAndroid,
    meta: {
      style: 1,
    },
  },
];
