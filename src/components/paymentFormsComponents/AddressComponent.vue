<template>
  <Form>
    <div class="flex flex-wrap w-full gap-4">
      <LabelAndInputText v-model:property="numberStreet"
                         label="Numéro de voie"
                         inputId="number"
                         required
                         class=" w-full md:w-[30%]"
                         :propertyRules="v$?.numberStreet"
                         placeholder="exemple: 3 bis"
                         errorMessage="Numéro invalide">
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
      <LabelAndInputText v-model:property="zipCode"
                         label="Code postal"
                         inputId="zipCode"
                         required
                         placeholder="exemple: 75002"
                         class="w-full md:w-[30%]"
                         :propertyRules="v$?.zipCode"
                         errorMessage="Code postal invalide">
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
    </div>
  </Form>


</template>
<script lang="ts" setup>
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { computed } from 'vue';

const props = defineProps({
  street: String,
  numberStreet: String,
  zipCode: String,
  city: String,
  v$: Object,
});

const emit = defineEmits([
  'update:street',
  'update:numberStreet',
  'update:zipCode',
  'update:city',
]);


const street = computed({
  get: () => props.street,
  set: value => emit('update:street', value)
});

const numberStreet = computed({
  get: () => props.numberStreet,
  set: value => emit('update:numberStreet', value)
});

const zipCode = computed({
  get: () => props.zipCode,
  set: value => emit('update:zipCode', value)
});

const city = computed({
  get: () => props.city,
  set: value => emit('update:city', value)
});

</script>