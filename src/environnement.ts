export const env = {
  auth: {
    revoque: 'auth/revoke',
    isAuthenticated: 'auth/is-authenticated',
    google: 'auth/google',
    createAccount: 'auth/create-account',
    confirmEmail: 'auth/verify-email',
    resendConfirmEmail: 'auth/resend-verify-email',
    login: 'auth/login',
    boxTal: 'auth/auth-boxtal',
    updateProfile: 'auth/update-profile',
    updatePassword: 'auth/update-password',
  },
  config: {
    address: 'address/config',
  },
  boxtal: {
    mapToken: 'boxtal/token-auth-boxtal-maps',
    createEtiquette: 'boxtal/order-shipping',
    getDocuments: 'boxtal/get-documents',
  },
  creator: {
    crud: 'creator'
  },
  contact: {
    send: 'contact-message'
  },
  order: {
    crud: 'order',
    updateGuest: 'order/update-guest',
  },
  homePage: {
    crud: 'home-config',
    adminGet: 'home-config/admin',
    active: 'home-config/active-home-config',
  },
  shipment: {
    crud: 'shipment',
    updateStatus: 'shipment/update-status'
  },
  products: {
    crud: 'products',
    byName: 'products/by-name',
    variant: 'products/variant'
  },

  stripe: {
    checkout: 'stripe/checkout'
  }
};