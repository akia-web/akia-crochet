import { createRouter, createWebHistory } from 'vue-router';
import { updatePinia } from '@/functions/auth.ts';
import { useUserStore } from '@/stores/user.ts';
import type { UserDto } from '@/interfaces/user.dto.ts';
import { RoleEnum } from '@/enum/role.enum.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      component: () => import('../components/layout/AdminLayout/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../components/Admin/Dashboard/AdminDashboardComponent.vue'),
        },
        {
          path: 'peluches',
          name: 'AdminPeluches',
          component: () => import('../components/Admin/Peluches/AdminPeluchesComponent.vue'),
        },
        {
          path: 'add-peluches',
          name: 'AdminAddPeluches',
          component: () => import('../components/Admin/Peluches/AddPelucheComponent.vue'),
        },
        {
          path: 'patrons',
          name: 'AdminPatrons',
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
          name: 'peluches',
          component: () => import('../components/Peluches/PeluchesComponent.vue'),
        },
        {
          path: 'peluches',
          name: 'peluches',
          component: () => import('../components/Peluches/PeluchesComponent.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('../components/Profile/ProfileComponent.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to,from,next)=>{
  const userStore = useUserStore()
  await updatePinia(userStore)

  const user: UserDto | null = userStore.user
  console.log(user)
  if (to.path === '/profile') {
    if (user) {
      next()
    } else {
      next('/')
    }
  } else if(to.path.startsWith('/admin')){
    if (user && user.role === RoleEnum.ADMIN) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})



export default router
