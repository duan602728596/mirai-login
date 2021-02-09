import { createRouter, createWebHashHistory, RouteRecordRaw, Router } from 'vue-router';
import Index from '../pages/Index/index';
import Download from '../pages/Download/index';

const routesConfig: Array<RouteRecordRaw> = [
  { path: '/', name: 'index', component: Index },
  { path: '/Download', name: 'download', component: Download }
];

export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: routesConfig
});