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
    updateEmail: 'auth/update-email',
  },
  config: {
    address: 'address/config',
  },
  boxtal: {
    mapToken: 'boxtal/token-auth-boxtal-maps',
    createEtiquette: 'boxtal/order-shipping',
  },
  plushieCreator: {
    crud: 'plushie-creator'
  },
  order:{
    crud: 'order'
  },
  shipment:{
    crud: 'shipment',
    updateStatus: 'shipment/update-status'
  },
  plushies: {
    crud: 'peluches',
    byName: 'peluches/by-name',
    variant: 'peluches/variant'
  },

  stripe:{
    checkout:'stripe/checkout'
  }
};