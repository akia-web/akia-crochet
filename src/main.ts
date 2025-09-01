import './assets/main.css'
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { PrimeVue } from '@primevue/core'
import Button from "primevue/button";
import { Card, Dialog, DialogService, Divider, DynamicDialog, InputGroup, InputNumber, InputText, Menu, Select, Step, StepList, Stepper, Toast, ToastService } from 'primevue';
import Editor from 'primevue/editor';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(ToastService);
app.use(DialogService);


const components = {
    Button,
    InputText,
    InputNumber,
    Card,
    Toast,
    Menu,
    Editor,
    InputGroup,
    Select,
    Stepper,
    StepList,
    Step,
    Divider,
    Dialog,
    DynamicDialog,

};

Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
});
app.mount('#app')
