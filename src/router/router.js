import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/view/Home.vue';
import Dienpinigiai from '@/view/Dienpinigiai.vue';

const routes = [
  { path: '/', name: 'Home', component: Home},
  { path: '/dienpinigiai', name: 'Dienpinigiai', component: Dienpinigiai}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;