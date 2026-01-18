<template>
  <ContactInfo v-model:deliveryAddressLastName="deliveryAddressLastName"
               v-model:deliveryAddressFirstName="deliveryAddressFirstName"
               v-model:phone="phone"
               v-model:email="email"
               v-model:company="company"
               :isInvoiceAddress="false"
               :v$="v$"/>


  <AddressComponent v-model:street="street"
                    v-model:numberStreet="numberStreet"
                    v-model:postalCode="postalCode"
                    v-model:city="city"
                    :isInvoiceAddress="false"
                    v-model:deliveryAddressCountry="deliveryAddressCountry"
                    :v$="v$"

  />

  <BoxMap2Component v-model:livraisonOption="livraisonOption"
                    v-model:deliveryAddressCountry="deliveryAddressCountry"
                    v-model:selectedParcelPoint="selectedParcelPoint"
                    :city="city"
                    :numberStreet="numberStreet"
                    :postalCode="postalCode"
                    :street="street"/>


</template>
<script lang="ts" setup>
import ContactInfo from '@/components/paymentFormsComponents/contactInfo.vue';
import { computed, type PropType } from 'vue';
import type { ParcelPointDto } from '@/interfaces/parcel-point.dto.ts';
import AddressComponent from '@/components/paymentFormsComponents/AddressComponent.vue';
import BoxMap2Component from '@/components/BoxMap/BoxMap2Component.vue';

const props = defineProps({
  deliveryAddressLastName: String,
  deliveryAddressFirstName: String,
  deliveryAddressCountry: Object,
  email: String,
  phone: String,
  isInvoiceAddress: Boolean,
  company: String,
  v$: Object,
  livraisonOption: Object,
  selectedParcelPoint: Object as PropType<ParcelPointDto>,
  street: String,
  numberStreet: String,
  postalCode: String,
  city: String,
});

const emit = defineEmits([
  'update:deliveryAddressLastName',
  'update:deliveryAddressFirstName',
  'update:deliveryAddressCountry',
  'update:phone',
  'update:email',
  'update:livraisonOption',
  'update:selectedParcelPoint',
  'update:street',
  'update:numberStreet',
  'update:postalCode',
  'update:city',
  'update:company',
]);

const deliveryAddressLastName = computed({
  get: () => props.deliveryAddressLastName,
  set: value => emit('update:deliveryAddressLastName', value)
});

const deliveryAddressFirstName = computed({
  get: () => props.deliveryAddressFirstName,
  set: value => emit('update:deliveryAddressFirstName', value)
});

const deliveryAddressCountry = computed({
  get: () => props.deliveryAddressCountry,
  set: value => emit('update:deliveryAddressCountry', value)
});

const phone = computed({
  get: () => props.phone,
  set: value => emit('update:phone', value)
});


const email = computed({
  get: () => props.email,
  set: value => emit('update:email', value)
});

const livraisonOption = computed({
  get: () => props.livraisonOption,
  set: value => emit('update:livraisonOption', value)
});

const selectedParcelPoint = computed({
  get: () => props.selectedParcelPoint,
  set: value => emit('update:selectedParcelPoint', value)
});

const street = computed({
  get: () => props.street,
  set: value => emit('update:street', value)
});

const numberStreet = computed({
  get: () => props.numberStreet,
  set: value => emit('update:numberStreet', value)
});

const postalCode = computed({
  get: () => props.postalCode,
  set: value => emit('update:postalCode', value)
});

const city = computed({
  get: () => props.city,
  set: value => emit('update:city', value)
});

const company = computed({
  get: () => props.company,
  set: value => emit('update:company', value)
});

</script>