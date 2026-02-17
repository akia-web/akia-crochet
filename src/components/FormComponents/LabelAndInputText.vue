<template>

  <div class="flex flex-col">
    <div class="flex gap-2">
      <label :for="inputId" class="text-xs font-bold mb-1">{{ label }}{{ required ? '*' : '' }}</label>
      <p v-if="propertyRules?.$error"
         class="text-actionColor text-xs font-bold">
        {{ errorMessage }}
      </p>
    </div>

    <InputText
        :id="inputId"
        v-model="property"
        :placeholder="placeholder? placeholder: props.label"
        :readonly="readonly"
        :class="[readonly? 'input-readOnly cursor-not-allowed':'bg-transparent cursor-text']"
        @blur="propertyRules?.$touch()"/>
  </div>

</template>
<script lang="ts" setup>
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
});

const emit = defineEmits([
  'update:property',
]);

const property = computed({
  get: () => props.property,
  set: value => emit('update:property', value)
});

</script>