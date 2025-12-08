import './assets/main.css';
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { PrimeVue } from '@primevue/core';
import Button from 'primevue/button';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel, Card, ColorPicker, Dialog, DialogService, Divider, Drawer, DynamicDialog, InputGroup, InputGroupAddon, InputNumber, InputText, Menu, Message, MultiSelect, Password, Select, Step, StepList, Stepper, Toast, ToastService } from 'primevue';
import Editor from 'primevue/editor';
import { Form, FormField } from '@primevue/forms';


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura
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
  ColorPicker,
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
  Password,
  Select,
  Step,
  StepList,
  Stepper,
  Toast,
};

Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});
app.mount('#app');
