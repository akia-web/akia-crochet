<template>

  <div class="flex flex-col">
    <div class="flex gap-2">
      <label :for="inputId" class="text-xs font-bold mb-1">{{label}}{{required? '*': ''}}</label>
      <p v-if="propertyRules?.$error"
         class="text-actionColor text-xs font-bold">
        {{errorMessage }}
      </p>
    </div>

    <InputNumber
        :id="inputId"
        v-model="property"
        :minFractionDigits="maxFractionDigits" :maxFractionDigits="maxFractionDigits" fluid
        :placeholder="placeholder? placeholder: props.label"
        @blur="propertyRules?.$touch()"/>
  </div>

</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  property: Number,
  label: String,
  inputId: String,
  required: Boolean,
  propertyRules: Object,
  errorMessage: String,
  placeholder: String,
  minFractionDigits: Number,
  maxFractionDigits: Number,
});

const emit = defineEmits([
  'update:property',
]);

const property = computed({
  get: () => props.property,
  set: value => emit('update:property', value)
});

</script>