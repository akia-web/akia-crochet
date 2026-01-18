<template>
  <Form>
    <div class="flex flex-wrap w-full gap-4 mt-4">
      <LabelAndInputText v-model:property="numberStreet"
                         label="Numéro de voie"
                         inputId="number"
                         required
                         class=" w-full md:w-[30%]"
                         :propertyRules="v$?.numberStreet"
                         placeholder="exemple: 3 bis"
                         errorMessage="invalide">
      </LabelAndInputText>

      <LabelAndInputText v-model:property="street"
                         label="Rue"
                         inputId="street"
                         required
                         placeholder="exemple: rue de la paix"
                         class="w-full md:w-[calc(70%-1rem)]"
                         :propertyRules="v$?.street"
                         errorMessage="Rue requise"
      >
      </LabelAndInputText>
    </div>
    <div class="flex flex-wrap mt-4 gap-4">
      <LabelAndInputText v-model:property="postalCode"
                         label="Code postal"
                         inputId="postalCode"
                         required
                         placeholder="exemple: 75002"
                         class="w-full md:w-[30%]"
                         :propertyRules="v$?.postalCode"
                         errorMessage="invalide">
      </LabelAndInputText>

      <LabelAndInputText v-model:property="city"
                         label="Ville"
                         inputId="city"
                         placeholder="exemple: Paris"
                         required
                         class="w-full md:w-[calc(70%-1rem)]"
                         :propertyRules="v$?.city"
                         errorMessage="Ville requise">
      </LabelAndInputText>

      <div class="flex flex-col w-full mt-4"
           v-if="!props.isInvoiceAddress">
        <label for="country" class="text-xs font-bold">Pays {{isInvoiceAddress? 'de l\'expediteur':'du destinataire'}}</label>
        <Select v-model="deliveryAddressCountry"
                :options="optionCountries"
                optionLabel="name"
                placeholder="Pays"
                class="w-full"
        />
      </div>
    </div>
  </Form>


</template>
<script lang="ts" setup>
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { computed } from 'vue';

const optionCountries = [
  { name: 'France', code: 'FR' },
];


const props = defineProps({
  street: String,
  numberStreet: String,
  postalCode: String,
  city: String,
  deliveryAddressCountry: Object,
  isInvoiceAddress: Boolean,
  v$: Object,
});

const emit = defineEmits([
  'update:street',
  'update:numberStreet',
  'update:postalCode',
  'update:city',
  'update:deliveryAddressCountry',
]);

const deliveryAddressCountry = computed({
  get: () => props.deliveryAddressCountry,
  set: value => emit('update:deliveryAddressCountry', value)
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

</script>