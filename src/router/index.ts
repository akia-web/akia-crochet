import { createRouter, createWebHistory } from 'vue-router';
import { updatePinia } from '@/functions/auth.ts';
import { useUserStore } from '@/stores/user.ts';
import type { UserDto } from '@/interfaces/user.dto.ts';
import { RoleEnum } from '@/enum/role.enum.ts';
import { ADMIN_ADD_CREATOR_ROUTE, ADMIN_ADD_PLUSHIES_ROUTE, ADMIN_CREATOR_ROUTE, ADMIN_DASHBORD_ROUTE, ADMIN_PATTERN_ROUTE, ADMIN_PLUSHIES_ROUTE, PLUSHIES_ROUTE } from '@/router/routes-name.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      component: () => import('../components/layout/AdminLayout/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: ADMIN_DASHBORD_ROUTE,
          component: () => import('../components/Admin/Dashboard/AdminDashboardComponent.vue'),
        },
        {
          path: 'creators',
          name: ADMIN_CREATOR_ROUTE,
          component: () => import('@/components/Admin/Creators/CreatorsComponent.vue'),
        },
        {
          path: 'add-creator',
          name: ADMIN_ADD_CREATOR_ROUTE,
          component: () => import('@/components/Admin/Creators/edit-creator.vue'),
        },
        {
          path: 'peluches',
          name: ADMIN_PLUSHIES_ROUTE,
          component: () => import('../components/Admin/Peluches/AdminPeluchesComponent.vue'),
        },
        {
          path: 'add-peluches',
          name: ADMIN_ADD_PLUSHIES_ROUTE,
          component: () => import('../components/Admin/Peluches/edit-plushies/edit-plushies-container.vue'),
          props: true
        },
        {
          path: 'pattern',
          name: ADMIN_PATTERN_ROUTE,
          component: () => import('../components/Admin/Patron/AdminPatronComponent.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('../components/layout/default/defaultLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('@/ pages/Home/HomeComponent.vue'),
        },
        {
          path: 'peluches',
          name: 'peluches',
          component: () => import('../components/Peluches/PeluchesComponent.vue'),
        },
        {
          path: '/profile',
          name: PLUSHIES_ROUTE,
          component: () => import('../components/Profile/ProfileComponent.vue'),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  await updatePinia(userStore);

  const user: UserDto | null = userStore.user;
  if (to.path === '/profile') {
    if (user) {
      next();
    } else {
      next('/');
    }
  } else if (to.path.startsWith('/admin')) {
    if (user && user.role === RoleEnum.ADMIN) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});


export default router;
