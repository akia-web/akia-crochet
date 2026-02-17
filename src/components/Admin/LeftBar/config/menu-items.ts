import type { MenuItem } from 'primevue/menuitem';

export const adminMenuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-chart-line', url: '/Dashboard' },
  { label: 'Commandes', icon: 'pi pi-box', url: '/commandes' },
  { label: 'À faire', icon: 'pi pi-bell', url: '/Patrons' },
  {
    label: 'Config', icon:'pi pi-cog' ,items: [
      { label: 'Adresses', icon: 'pi pi-address-book', url: '/address' },
      { label: 'Points de livraison', icon: 'pi pi-car', url: '/address' },
      { label: 'Createurs', icon: 'pi pi-crown', url: '/creators' },

    ]
  },
  {
    label: 'Produits', icon: 'pi pi-book', items: [
      { label: 'Produits', icon: 'pi pi-camera', url: '/Produits' },
      { label: 'Patrons', icon: 'pi pi-file-edit', url: '/Patrons' },
    ]
  },
];
