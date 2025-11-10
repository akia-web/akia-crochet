<template>
  <Card>
    <template #content>
      <img v-if=" props.plushie.presentationImage"
           :src=" props.plushie.presentationImage"
           alt="illustration"
           class="w-[300px] h-[300px] object-cover"
      />
      <h2 class="font-bold mt-1">
        {{ props.plushie.name }}
      </h2>

      <p class="mt-2">{{ price }}</p>
    </template>
  </Card>
</template>
<script lang="ts" setup>
import type { PeluchesDto } from '@/interfaces/peluchesDto.ts';
import { Card } from 'primevue';
import { computed } from 'vue';

const props = defineProps<{
  plushie: PeluchesDto
}>();

const price = computed(() => {
  return `${props.plushie.price ? props.plushie.price / 100 : 0} €`;
});
</script>