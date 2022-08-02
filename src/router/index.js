import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/index';
import Users from '../components/users/index'
import User from '../components/users/User'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/createUser',
    name: 'createUser',
    component: User
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
