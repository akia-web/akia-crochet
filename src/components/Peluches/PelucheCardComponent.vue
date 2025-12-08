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
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { Card } from 'primevue';
import { computed } from 'vue';

const props = defineProps<{
  plushie: PlushieDto
}>();

const price = computed(() => {
  return `${props.plushie.price ? props.plushie.price / 100 : 0} €`;
});
</script>