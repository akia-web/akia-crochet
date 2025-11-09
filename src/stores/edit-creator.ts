import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { PlushieCreatorDto } from '@/interfaces/plushie-creator.dto.ts';

export const useCreatorEditStore = defineStore('edit-creator', () => {
  const creator = ref<PlushieCreatorDto | null>(null);

  function updateCreator(value: PlushieCreatorDto | null) {
    creator.value = value;
  }

  return { creator, updateCreator };
});
