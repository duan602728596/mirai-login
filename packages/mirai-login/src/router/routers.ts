import { createRouter, createWebHashHistory, RouteRecordRaw, Router } from 'vue-router';
import Index from '../pages/index/index';

const routesConfig: Array<RouteRecordRaw> = [
  { path: '/', name: 'index', component: Index }
];

export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: routesConfig
});