import 'maplibre-gl/dist/maplibre-gl.css';
import './assets/main.css';
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'cropperjs/dist/cropper.css';


import App from './App.vue';
import router from './router';
import { PrimeVue } from '@primevue/core';
import Button from 'primevue/button';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel, Card, Checkbox, Chip, ColorPicker, Column, DataTable, DatePicker, Dialog, DialogService, Divider, Drawer, DynamicDialog, InputGroup, InputGroupAddon, InputNumber, InputText, Menu, Message, MultiSelect, PanelMenu, Password, Popover, RadioButton, Select, SelectButton, Step, StepList, Stepper, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Textarea, Toast, ToastService } from 'primevue';
import Editor from 'primevue/editor';
import { Form, FormField } from '@primevue/forms';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  locale: {
    firstDayOfWeek: 1,
    dayNames: ['Dimanche','Lundi', 'Mardi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort:	['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    dayNamesMin:	['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    monthNames:	['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
    monthNamesShort:	['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Jui', 'Jui', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'],
    today:	`Aujourd'hui`,
  }
});
app.use(ToastService);
app.use(DialogService);


const components = {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
  Button,
  Card,
  Checkbox,
  Chip,
  Column,
  ColorPicker,
  DataTable,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  DynamicDialog,
  Editor,
  Form,
  FormField,
  InputGroup,
  InputGroupAddon,
  InputNumber,
  InputText,
  Menu,
  Message,
  MultiSelect,
  PanelMenu,
  Password,
  Popover,
  RadioButton,
  Select,
  SelectButton,
  Step,
  StepList,
  Stepper,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Textarea,
  Toast,
  Tag,
};

Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});
app.mount('#app');
