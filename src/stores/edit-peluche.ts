import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { PeluchesDto } from '@/interfaces/peluchesDto.ts';

export const usePlushieEditStore = defineStore('edit-peluche', () => {
  const peluche = ref<PeluchesDto | null>(null);

  function updatePeluche(value: PeluchesDto | null) {
    peluche.value = value;
  }

  return { peluche, updatePeluche };
});
