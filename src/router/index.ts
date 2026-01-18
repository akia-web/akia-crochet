import { createRouter, createWebHistory } from 'vue-router';
import { updatePinia } from '@/functions/auth.ts';
import { useUserStore } from '@/stores/user.ts';
import type { UserDto } from '@/interfaces/user.dto.ts';
import { RoleEnum } from '@/enum/role.enum.ts';
import { ADMIN_ADD_CREATOR_ROUTE, ADMIN_ADD_PLUSHIES_ROUTE, ADMIN_CREATOR_ROUTE, ADMIN_DASHBORD_ROUTE, ADMIN_PATTERN_ROUTE, ADMIN_PLUSHIES_ROUTE, CONFIRM_EMAIL_ROUTE, CONNEXION_ROUTE, CONTACT_ROUTE, INSCRIPTION_ROUTE, PAYMENT_ROUTE, PLUSHIES_DETAILS_ROUTE, PLUSHIES_ROUTE, PROFILE_ROUTE, RECAP_CART_ROUTE, SIMULATOR_ROUTE } from '@/router/routes-name.ts';

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
          component: () => import('../components/Admin/Peluches/AdminTablePeluchesComponent.vue'),
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
          component: () => import('@/pages/Home/HomeComponent.vue'),
        },
        {
          path: 'peluches',
          name: PLUSHIES_ROUTE,
          component: () => import('../components/Peluches/PeluchesComponent.vue'),
        },
        {
          path: `${PLUSHIES_DETAILS_ROUTE}/:pelucheName/:selectedVariantName`,
          name: PLUSHIES_DETAILS_ROUTE,
          component: () => import('../components/Peluches/PelucheDetailsComponent.vue'),
          props: true
        },
        {
          path: PROFILE_ROUTE,
          name: PROFILE_ROUTE,
          component: () => import('../components/Profile/ProfileComponent.vue'),
        },
        {
          path: CONNEXION_ROUTE,
          name: CONNEXION_ROUTE,
          component: () => import('../components/Connexion/ConnexionComponent.vue'),
        },
        {
          path: INSCRIPTION_ROUTE,
          name: INSCRIPTION_ROUTE,
          component: () => import('../components/createAccount/CreateAccountComponent.vue'),
        },
        {
          path: CONFIRM_EMAIL_ROUTE,
          name: CONFIRM_EMAIL_ROUTE,
          component: () => import('../components/ConfirmEmail/ConfirmEmail.vue'),
        },
        {
          path: CONTACT_ROUTE,
          name: CONTACT_ROUTE,
          component: () => import('../components/Contact/ContactComponenent.vue'),
        },
        {
          path: 'payment',
          name: PAYMENT_ROUTE,
          component: () => import('../pages/payment/paymentPage.vue'),
        },
        {
          path: RECAP_CART_ROUTE,
          name: RECAP_CART_ROUTE,
          component: () => import('@/pages/recapCart/RecapCartPage.vue'),
        },

        {
          path: 'sucess-paiement',
          name: 'sucess-paiement',
          component: () => import('@/pages/payment/SuccessPaymentPage.vue'),
        },

        {
          path: 'error-paiement',
          name: 'error-paiement',
          component: () => import('@/pages/payment/ErrorPaymentPage.vue'),
        },
        {
          path: 'conditions-generales-de-vente',
          name: 'cgv',
          component: () => import('@/components/DocsAdministratif/CGV.vue'),
        },
        {
          path: 'politique-de-livraison',
          name: 'deliveryPolicy',
          component: () => import('@/components/DocsAdministratif/DeliveryPolicy .vue'),
        },
        {
          path: 'mentions-legales',
          name: 'legalNotices',
          component: () => import('@/components/DocsAdministratif/LegalNotices.vue'),
        },
        {
          path: 'politique-de-confidentialite',
          name: 'privacyPolicy',
          component: () => import('@/components/DocsAdministratif/PrivacyPolicy.vue'),
        },
        {
          path: 'politique-de-retours-et-remboursements',
          name: 'returnAndRefunds',
          component: () => import('@/components/DocsAdministratif/ReturnsAndRefunds.vue'),
        },

      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
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
