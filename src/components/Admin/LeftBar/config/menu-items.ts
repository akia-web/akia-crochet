import { ref } from 'vue';
import type { MenuItem } from 'primevue/menuitem';

export const adminMenuItems: MenuItem[] =[
  { label: 'Dashboard', icon: 'pi pi-chart-line', url: '/Dashboard' },
  { label: 'Createurs', icon: 'pi pi-verified',url: '/creators' },
  { label: 'Peluches', icon: 'pi pi-camera', url: '/Peluches'},
  { label: 'Patrons', icon: 'pi pi-file-edit', url: '/Patrons'},
];
