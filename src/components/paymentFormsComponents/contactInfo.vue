<template>
  <Form class="flex flex-col w-full gap-4">

    <DropDownPhone v-model:phone="phone"
                   v-if="!isInvoiceAddress || isAdmin"
                   :propertyRules="props.v$?.phone"
                   :isAdmin="isAdmin"
                   errorMessage="Numéro invalide"></DropDownPhone>

    <LabelAndInputText v-model:property="company"
                       inputId="company"
                       :label="`Entreprise ${label} (optionel)`"
                       placeholder="exemple: EI John Doe"
                       class="mt-4"/>

    <LabelAndInputText v-model:property="email"
                       inputId="email"
                       :label="`Email ${label}`"
                       required
                       placeholder="exemple: john@doe.fr"
                       :propertyRules="props.v$?.email"
                       errorMessage="Email invalide"
                       class="mt-4"
    >
    </LabelAndInputText>


    <LabelAndInputText v-model:property="deliveryAddressLastName"
                       inputId="lastName"
                       :label="`Nom de famille ${label}`"
                       placeholder="exemple: Doe"
                       required
                       :propertyRules="props.v$?.lastName"
                       errorMessage="Nom de famille requis"
                       class="mt-4"
    >
    </LabelAndInputText>

    <LabelAndInputText v-model:property="deliveryAddressFirstName"
                       inputId="firstName"
                       :label="`Prénom ${label}`"
                       placeholder="exemple: John"
                       required
                       :propertyRules="props.v$?.firstName"
                       errorMessage="Prénom requis"
                       class="mt-4">
    </LabelAndInputText>
  </Form>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import DropDownPhone from '@/components/DropDownPhone/DropDownPhone.vue';

const props = defineProps({
  deliveryAddressLastName: String,
  deliveryAddressFirstName: String,
  email: String,
  phone: String,
  company: String,
  isInvoiceAddress: Boolean,
  livraisonOptionCode: String,
  v$: Object,
  isAdmin: Boolean,
});


const emit = defineEmits([
  'update:deliveryAddressLastName',
  'update:deliveryAddressFirstName',
  'update:phone',
  'update:email',
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

const phone = computed({
  get: () => props.phone,
  set: value => emit('update:phone', value)
});


const email = computed({
  get: () => props.email,
  set: value => emit('update:email', value)
});

const company = computed({
  get: () => props.company,
  set: value => emit('update:company', value)
});

const label = computed(() => {
  if (!props.isAdmin) {
    return `${props.isInvoiceAddress ? 'de l\'expediteur' : 'du destinataire'}`;
  } else {
    return '';
  }
});


</script>