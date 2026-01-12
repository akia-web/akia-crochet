<template>

  <div class="flex flex-col">
    <div class="flex flex-col">
      <label :for="inputId" class="text-xs font-bold mb-1">{{label}}{{required? '*': ''}}</label>
      <p v-if="propertyRules?.$error"
         class="text-actionColor font-bold">
        {{errorMessage }}
      </p>
    </div>

    <InputText
        :id="inputId"
        v-model="property"
        :placeholder="placeholder? placeholder: props.label"
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
});

const emit = defineEmits([
  'update:property',
]);

const property = computed({
  get: () => props.property,
  set: value => emit('update:property', value)
});

</script>