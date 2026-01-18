<template>
  <div v-if="props.livraisonOption?.code === 'domicile'">
    <div class="flex items-center gap-2 mt-4">
      <Checkbox v-model="sameAddressForDeliveryAndInvoice" binary id="sameAddress"/>
      <label for="sameAddress">Utiliser la même adresse pour la facturation</label>
    </div>
  </div>

  <div v-if="(props.livraisonOption?.name ==='domicile' && !sameAddressForDeliveryAndInvoice) || (props.livraisonOption?.name !=='domicile')">
    <ContactInfo v-model:deliveryAddressLastName="invoiceAddressLastName"
                 v-model:deliveryAddressFirstName="invoiceAddressFirstName"
                 v-model:email="invoiceAddressEmail"
                 v-model:company="invoiceAddressCompany"
                 :livraisonOptionCode="props.livraisonOption?.code"
                 :isInvoiceAddress="true"
                 :v$="v$"/>

    <AddressComponent class="mt-4"
                      v-model:street="invoiceAddressStreet"
                      v-model:numberStreet="invoiceAddressNumberStreet"
                      v-model:postalCode="invoiceAddressPostalCode"
                      v-model:city="invoiceAddressCity"
                      :isInvoiceAddress="true"
                      v-model:sameAddressForDeliveryAndInvoice="sameAddressForDeliveryAndInvoice"
                      :v$="v$"/>

    <LabelAndInputText v-model:property="invoiceAddressCountry"
                       label="Pays"
                       inputId="countryInvoice"
                       required
                       placeholder="exemple: France"
                       class="w-full mt-4"
                       :propertyRules="v$"
                       errorMessage="Pays requis"/>
  </div>

</template>
<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import ContactInfo from '@/components/paymentFormsComponents/contactInfo.vue';
import AddressComponent from '@/components/paymentFormsComponents/AddressComponent.vue';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';


const props = defineProps({
  sameAddressForDeliveryAndInvoice: Boolean,
  invoiceAddressLastName: String,
  invoiceAddressFirstName: String,
  invoiceAddressCountry: String,
  invoiceAddressEmail: String,
  isInvoiceAddress: Boolean,
  v$: Object,
  livraisonOption: Object,
  invoiceAddressStreet: String,
  invoiceAddressNumberStreet: String,
  invoiceAddressPostalCode: String,
  invoiceAddressCity: String,
  invoiceAddressCompany: String,
});

const emit = defineEmits([
  'update:sameAddressForDeliveryAndInvoice',
  'update:invoiceAddressLastName',
  'update:invoiceAddressFirstName',
  'update:invoiceAddressCountry',
  'update:invoiceAddressEmail',
  'update:invoiceAddressStreet',
  'update:invoiceAddressNumberStreet',
  'update:invoiceAddressPostalCode',
  'update:invoiceAddressCity',
  'update:invoiceAddressCompany',

]);

const sameAddressForDeliveryAndInvoice = computed({
  get: () => props.sameAddressForDeliveryAndInvoice,
  set: value => emit('update:sameAddressForDeliveryAndInvoice', value)
});

const invoiceAddressLastName = computed({
  get: () => props.invoiceAddressLastName,
  set: value => emit('update:invoiceAddressLastName', value)
});

const invoiceAddressFirstName = computed({
  get: () => props.invoiceAddressFirstName,
  set: value => emit('update:invoiceAddressFirstName', value)
});

const invoiceAddressCountry = computed({
  get: () => props.invoiceAddressCountry,
  set: value => emit('update:invoiceAddressCountry', value)
});

const invoiceAddressEmail = computed({
  get: () => props.invoiceAddressEmail,
  set: value => emit('update:invoiceAddressEmail', value)
});

const invoiceAddressStreet = computed({
  get: () => props.invoiceAddressStreet,
  set: value => emit('update:invoiceAddressStreet', value)
});

const invoiceAddressNumberStreet = computed({
  get: () => props.invoiceAddressNumberStreet,
  set: value => emit('update:invoiceAddressNumberStreet', value)
});

const invoiceAddressPostalCode = computed({
  get: () => props.invoiceAddressPostalCode,
  set: value => emit('update:invoiceAddressPostalCode', value)
});

const invoiceAddressCity = computed({
  get: () => props.invoiceAddressCity,
  set: value => emit('update:invoiceAddressCity', value)
});
const invoiceAddressCompany = computed({
  get: () => props.invoiceAddressCompany,
  set: value => emit('update:invoiceAddressCompany', value)
});



</script>