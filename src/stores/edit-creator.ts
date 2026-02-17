import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { creatorDto } from '@/interfaces/creator.dto.ts';

export const useCreatorEditStore = defineStore('edit-creator', () => {
  const creator = ref<creatorDto | null>(null);

  function updateCreator(value: creatorDto | null) {
    creator.value = value;
  }

  return { creator, updateCreator };
});
