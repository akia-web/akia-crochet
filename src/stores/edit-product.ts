import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ProductDto } from '@/interfaces/product.dto.ts';

export const usePlushieEditStore = defineStore('edit-product', () => {
  const product = ref<ProductDto | null>(null);

  function updatePeluche(value: ProductDto | null) {
    product.value = value;
  }

  return { product: product, updatePeluche };
});
