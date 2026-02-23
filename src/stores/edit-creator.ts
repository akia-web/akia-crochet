import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { CreatorDto } from '@/interfaces/creator.dto.ts';

export const useCreatorEditStore = defineStore('edit-creator', () => {
  const creator = ref<CreatorDto | null>(null);

  function updateCreator(value: CreatorDto | null) {
    creator.value = value;
  }

  return { creator, updateCreator };
});
