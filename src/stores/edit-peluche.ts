import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { PlushieDto } from '@/interfaces/plushieDto.ts';

export const usePlushieEditStore = defineStore('edit-peluche', () => {
  const peluche = ref<PlushieDto | null>(null);

  function updatePeluche(value: PlushieDto | null) {
    peluche.value = value;
    console.warn(peluche.value)
  }

  return { peluche, updatePeluche };
});
