import { createRouter, createWebHistory } from 'vue-router';
import { updatePinia } from '@/functions/auth.ts';
import { useUserStore } from '@/stores/user.ts';
import type { UserDto } from '@/interfaces/user.dto.ts';
import { RoleEnum } from '@/enum/role.enum.ts';
import { ADMIN_ADD_CREATOR_ROUTE, ADMIN_ADD_PLUSHIES_ROUTE, ADMIN_ADDRESS_ROUTE, ADMIN_CREATOR_ROUTE, ADMIN_DASHBORD_ROUTE, ADMIN_ETIQUETTES_ROUTE, ADMIN_HOME_ROUTE, ADMIN_ORDERS_ROUTE, ADMIN_PATTERN_ROUTE, ADMIN_PLUSHIES_ROUTE, ADMIN_UPDATE_HOME_ROUTE, CONFIRM_EMAIL_ROUTE, CONNEXION_ROUTE, CONTACT_ROUTE, INSCRIPTION_ROUTE, PAYMENT_ROUTE, PRODUCTS_DETAILS_ROUTE, PRODUCTS_ROUTE, PROFILE_ORDER_ROUTE, PROFILE_ROUTE, RECAP_CART_ROUTE, SIMULATOR_ROUTE } from '@/router/routes-name.ts';

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
          component: () => import('@/components/Admin/config/Creators/CreatorsComponent.vue'),
        },
        {
          path: 'address',
          name: ADMIN_ADDRESS_ROUTE,
          component: () => import('../components/Admin/config/address/AdminAdressComponent.vue'),
        },
        {
          path: 'home-page',
          name: ADMIN_HOME_ROUTE,
          component: () => import('@/components/Admin/config/HomePage/HomePageListComponent.vue'),
        },
        {
          path: 'update-home',
          name: ADMIN_UPDATE_HOME_ROUTE,
          props: true,
          component: () => import('@/components/Admin/config/HomePage/UpdateHomeComponents.vue'),
        },
        {
          path: 'add-creator',
          name: ADMIN_ADD_CREATOR_ROUTE,
          component: () => import('@/components/Admin/config/Creators/edit-creator.vue'),
        },
        {
          path: 'produits',
          name: ADMIN_PLUSHIES_ROUTE,
          component: () => import('../components/Admin/Products/AdminTablePeluchesComponent.vue'),
        },
        {
          path: 'add-product',
          name: ADMIN_ADD_PLUSHIES_ROUTE,
          component: () => import('@/components/Admin/Products/edit-product/edit-product-container.vue'),
          props: true
        },
        {
          path: 'pattern',
          name: ADMIN_PATTERN_ROUTE,
          component: () => import('../components/Admin/Patron/AdminPatronComponent.vue'),
        },
        {
          path: 'commandes',
          name: ADMIN_ORDERS_ROUTE,
          component: () => import('../components/Admin/Orders/AdminOrdersComponent.vue'),
        },
        {
          path: 'etiquettes/:id/:network',
          name: ADMIN_ETIQUETTES_ROUTE,
          props: true,
          component: () => import('../components/Admin/Orders/createEtiquettes.vue'),
        },
      ],
    },

    {
      path: '/',
      component: () => import('../components/layout/default/defaultLayout.vue'),
      children: [
        {
          path: '',
          name:'home',
          component: () => import('@/pages/Home/HomeComponent.vue'),
        },
        {
          path: 'produits',
          name: PRODUCTS_ROUTE,
          component: () => import('@/pages/Products/ProductsPage.vue'),
        },
        {
          path: `${PRODUCTS_DETAILS_ROUTE}/:productName/:selectedVariantName`,
          name: PRODUCTS_DETAILS_ROUTE,
          component: () => import('../components/Products/ProductDetailsComponent.vue'),
          props: true
        },
        {
          path:`${PROFILE_ROUTE}/:step`,
          name: PROFILE_ROUTE,
          component: () => import('../pages/Profile/ProfileComponent.vue'),
          props: true
        },
        {
          path:`${PROFILE_ROUTE}/commandes/:id`,
          name: PROFILE_ORDER_ROUTE,
          component: () => import('../pages/Profile/orderDetails/OrderDetails.vue'),
          props: true
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
          path: 'Payment',
          name: PAYMENT_ROUTE,
          component: () => import('@/pages/Payment/PaymentPage.vue'),
        },
        {
          path: RECAP_CART_ROUTE,
          name: RECAP_CART_ROUTE,
          component: () => import('@/pages/recapCart/RecapCartPage.vue'),
        },

        {
          path: 'sucess-paiement',
          name: 'sucess-paiement',
          component: () => import('@/pages/Payment/StripeResponse/SuccessPaymentPage.vue'),
        },

        {
          path: 'error-paiement',
          name: 'error-paiement',
          component: () => import('@/pages/Payment/StripeResponse/ErrorPaymentPage.vue'),
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


  if(to.path.startsWith('/profile')|| to.path.startsWith('/admin') || userStore.user === null) {
    await updatePinia(userStore);
  }


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
