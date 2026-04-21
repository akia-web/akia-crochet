
<template>
  <div class="flex flex-col">
    <div class="flex gap-2">
      <label :for="inputId" class="text-xs font-bold mb-1">{{ label }}{{ required ? '*' : '' }}</label>
      <p v-if="propertyRules?.$error"
         class="text-actionColor text-xs font-bold">
        {{ errorMessage }}
      </p>
    </div>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-lock"></i>
      </InputGroupAddon>
      <Password
          :id="inputId"
          v-model="property"
          :placeholder="placeholder? placeholder: props.label"
          weakLabel="Faible"
          mediumLabel="Moyen"
          strongLabel="Fort"
          prompt-label="Saisissez un mot de passe"
          :strong-regex="PASSWORD_STRONG_REGEX"
          toggleMask
          :feedback="feedback"
          fluid
          @blur="propertyRules?.$touch()"/>
    </InputGroup>
  </div>
</template>

<script lang="ts" setup>
import { PASSWORD_STRONG_REGEX } from '@/functions/check-forms.ts';
import { computed } from 'vue';

const props = defineProps({
  property: String,
  label: String,
  inputId: String,
  required: Boolean,
  propertyRules: Object,
  errorMessage: String,
  placeholder: String,
  readonly: Boolean,
  feedback: Boolean,
});

const emit = defineEmits([
  'update:property',
]);

const property = computed({
  get: () => props.property,
  set: value => emit('update:property', value)
});
</script>