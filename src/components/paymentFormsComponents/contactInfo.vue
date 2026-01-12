<template>
  <Form class="flex flex-col w-full gap-4">
    <LabelAndInputText v-if="!isInvoiceAddress"
                       v-model:property="phone"
                       inputId="phone"
                       :label="`Numéro de téléphone ${isInvoiceAddress? '':'du destinataire'}`"
                       required
                       placeholder="exemple: 0607080906"
                       :propertyRules="props.v$?.phone"
                       errorMessage="Numéro invalide" />


    <LabelAndInputText v-model:property="company"
                       inputId="company"
                       :label="`Entreprise ${isInvoiceAddress? 'de l\'expediteur':'du destinataire'} (optionel)`"
                       placeholder="exemple: EI John Doe"
                       class="mt-4"/>

    <LabelAndInputText v-model:property="email"
                       inputId="email"
                       :label="`Email ${isInvoiceAddress? 'de l\'expediteur':'du destinataire'}`"
                       required
                       placeholder="exemple: john@doe.fr"
                       :propertyRules="props.v$?.email"
                       errorMessage="Email invalide"
                       class="mt-4"
    >
    </LabelAndInputText>


    <LabelAndInputText v-model:property="deliveryAddressLastName"
                       inputId="lastName"
                       :label="`Nom de famille ${isInvoiceAddress? 'de l\'expediteur':'du destinataire'}`"
                       placeholder="exemple: Doe"
                       required
                       :propertyRules="props.v$?.lastName"
                       errorMessage="Nom de famille requis"
                       class="mt-4"
    >
    </LabelAndInputText>

    <LabelAndInputText v-model:property="deliveryAddressFirstName"
                       inputId="firstName"
                       :label="`Prénom ${isInvoiceAddress? 'de l\'expediteur':'du destinataire'}`"
                       placeholder="exemple: John"
                       required
                       :propertyRules="props.v$?.firstName"
                       errorMessage="Prénom requis"
                       class="mt-4">
    </LabelAndInputText>

    <div class="flex flex-col mt-4"
         v-if="!props.isInvoiceAddress">
      <label for="country" class="text-xs font-bold">Pays {{isInvoiceAddress? 'de l\'expediteur':'du destinataire'}}</label>
      <Select v-model="deliveryAddressCountry"
              :options="optionCountries"
              optionLabel="name"
              placeholder="Pays"
              class="w-full"
      />
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';

const props = defineProps({
  deliveryAddressLastName: String,
  deliveryAddressFirstName: String,
  deliveryAddressCountry: Object,
  email: String,
  phone: String,
  company: String,
  isInvoiceAddress: Boolean,
  livraisonOptionCode: String,
  v$: Object,
});

const optionCountries = [
  { name: 'France', code: 'FR' },
  { name: 'Belgique', code: 'BE' },
  { name: 'Suisse', code: 'CH' },
  { name: 'Allemage', code: 'DE' }
];

const emit = defineEmits([
  'update:deliveryAddressLastName',
  'update:deliveryAddressFirstName',
  'update:deliveryAddressCountry',
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

const company = computed({
  get: () => props.company,
  set: value => emit('update:company', value)
});

// watch(() => props.deliveryAddressCountry, () => {
//   console.warn('je change');
//   props.v$?.phone.$reset?.();
//   props.v$?.phone.$validate?.();
// });


</script>