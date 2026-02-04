<template>
  <div class="border border-transparent"
      :class="[props.step === 'Informations'? ' border-l-actionColor': 'border-l-transparent']">
    <Button label="Informations"
            :class="[props.step === 'Informations'? 'p-button-text-action-color-bg-white': 'p-button-transparent text-black']"
            @click="changeStep('Informations')"></Button>
  </div>

  <div class="border border-transparent"
      :class="[props.step === 'Commandes'? ' border-l-actionColor': 'border-l-transparent']">
    <Button label="Commandes"
            :class="[props.step === 'Commandes'? 'p-button-text-action-color-bg-white': 'p-button-transparent text-black']"
            @click="changeStep('Commandes')"></Button>
  </div>

  <div class="border border-transparent"
       :class="[props.step === 'Messages'? ' border-l-actionColor': 'border-l-transparent']">
    <Button label="Messages"
            :class="[props.step === 'Messages'? 'p-button-text-action-color-bg-white': 'p-button-transparent text-black']"
            @click="changeStep('Messages')"></Button>
  </div>
</template>

<script lang="ts" setup>
import { PLUSHIES_ROUTE } from '@/router/routes-name.ts';

const props = defineProps<{
  step: string,
}>();
const emit = defineEmits(['newStep']);
const changeStep = (step: 'Informations' | 'Commandes' | 'Messages') => {
  emit('newStep', step);
};
</script>