import type { MenuItem } from 'primevue/menuitem';
import { ADMIN_DELIVERY_PRICE_NAME } from '@/router/routes-name.ts';

export const adminMenuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-chart-line', url: '/Dashboard' },
  { label: 'Commandes', icon: 'pi pi-box', url: '/commandes' },
  { label: 'À faire', icon: 'pi pi-bell', url: '/Patrons' },
  {
    label: 'Config', icon:'pi pi-cog' ,items: [
      { label: 'Adresses', icon: 'pi pi-address-book', url: '/address' },
      { label: 'Createurs', icon: 'pi pi-crown', url: '/creators' },
      { label: `Page d'accueil`, icon: 'pi pi-image', url: '/home-page' },
      { label: 'Prix livraison', icon: 'pi pi-car', url: '/livraison-prix' },
      { label: 'Boxtal webhook', icon: 'pi pi-truck', url: '/boxtal' },
    ]
  },
  {
    label: 'Produits', icon: 'pi pi-book', items: [
      { label: 'Produits', icon: 'pi pi-camera', url: '/produits' },
      { label: 'Patrons', icon: 'pi pi-file-edit', url: '/Patrons' },
    ]
  },
];
