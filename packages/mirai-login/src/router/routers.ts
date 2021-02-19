import { createRouter, createWebHashHistory, RouteRecordRaw, Router } from 'vue-router';
import Index from '../pages/Index/index';
import Download from '../pages/Download/index';
import Login from '../pages/Login/index';

const routesConfig: Array<RouteRecordRaw> = [
  { path: '/', name: 'index', component: Index },
  { path: '/Download', name: 'download', component: Download },
  { path: '/Login', name: 'login', component: Login }
];

export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: routesConfig
});