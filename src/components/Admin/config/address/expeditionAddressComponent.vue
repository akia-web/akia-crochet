<template>
  <InvoiceAddressFormComponent
      :sameAddressForDeliveryAndInvoice="false"
      v-model:invoiceAddressLastName="form.lastName"
      v-model:invoiceAddressFirstName="form.firstName"
      v-model:invoiceAddressCountry="form.country.name"
      v-model:invoiceAddressEmail="form.email"
      v-model:invoiceAddressCompany="form.company"
      v-model:invoiceAddressPhone="form.phone"
      :isInvoiceAddress="true"
      :isAdmin="true"
      :livraisonOption="form.livraisonOption"
      :v$="v$"
      v-model:invoiceAddressStreet="form.street"
      v-model:invoiceAddressNumberStreet="form.numberStreet"
      v-model:invoiceAddressPostalCode="form.postalCode"
      v-model:invoiceAddressCity="form.city"
  />

  <div class="mt-4 text-right">
    <Button label="Valider" :disabled="v$.$invalid" @click="updateAddress"></Button>
  </div>

</template>


<script setup lang="ts">
import InvoiceAddressFormComponent from '@/components/paymentFormsComponents/InvoiceAddressFormComponent.vue';
import { computed, onMounted, reactive } from 'vue';
import { email, maxLength, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { ConfigAddressDto } from '@/components/Admin/config/address/config-address-dto.ts';
import type { AddressDto } from '@/interfaces/Address.dto.ts';
import { useToast } from 'primevue/usetoast';
import { phoneByCountry } from '@/validators/phone-validators.ts';

const form = reactive<ConfigAddressDto>({
  id: 0,
  firstName: '',
  lastName: '',
  numberStreet: '',
  company: '',
  street: '',
  city: '',
  country: { name: 'FR' },
  postalCode: '',
  email: '',
  phone: '',
  livraisonOption: {
    code: 'POFR-ColissimoAccess',
    name: 'Domicile',
    supplement: 5
  },
});

const toast = useToast();

const rules = computed(() => ({
  firstName: { required },
  lastName: { required },
  numberStreet: {
    required,
    maxLength: maxLength(12)
  },
  phone: {
    required,
    phoneByCountry: phoneByCountry(
        () => 'FR'
    ),
  },
  street: {
    required
  },
  city: {
    required
  },
  postalCode: {
    required,
    maxLength: maxLength(5)
  },
  email: {
    required,
    email
  },
  country: {
    required
  },
}));

const props = defineProps({
  type: String
});

const v$ = useVuelidate(rules, form, { $autoDirty: true });

onMounted(async () => {
  await apiGet(api(`${env.config.address}?type=${props.type}`), 'GET', true).then(response => response.json())
      .then((data: AddressDto) => {
        if (data) {
          populateForm(data);
        }
      });
});

const updateAddress = async () => {
  const data = {
    firstName: form.firstName,
    lastName: form.lastName,
    numberStreet: form.numberStreet,
    company: form.company,
    street: form.street,
    city: form.city,
    postalCode: form.postalCode,
    email: form.email,
    country: form.country,
    id: form.id,
    type: props.type,
    phone: form.phone
  };

  await apiPost(api(`${env.config.address}`), form.id ? 'PATCH' : 'POST', data, false, true).then((data: AddressDto) => {
    toast.add({
      severity: 'success',
      summary: `${form.id ? 'Adresse modifiée' : 'Adresse enregistrée'}`,
      life: 3000
    });
    populateForm(data);
  })
      .catch(e => toast.add({
        severity: 'error',
        summary: `Erreur lors de l'enregistrement de l'adresse`,
        life: 3000
      }));
};

const populateForm = (data: AddressDto) => {
  form.firstName = data.firstName;
  form.lastName = data.lastName;
  form.numberStreet = data.numberStreet;
  form.company = data.company;
  form.street = data.street;
  form.city = data.city;
  form.postalCode = data.postalCode;
  form.email = data.email;
  form.country.name = data.country;
  form.id = data.id;
  form.phone = data.phone;
};

</script>
