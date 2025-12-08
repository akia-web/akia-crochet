import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { divideBy100 } from '@/functions/convertions';

export const useProductsCartStore = defineStore('cart', () => {
  const productsCart = ref<ProductShopDto[]>([]);
  const totalPrice = ref<number>(0);

  const updateCart = (value: ProductShopDto): void => {
    productsCart.value.push(value);
    totalPrice.value = calculateAmount();
    saveInLocalStorageCart();
  };

  const deleteProduct = (product: ProductShopDto): void => {
    productsCart.value = productsCart.value.filter((element: ProductShopDto) => element.name !== product.name);
    totalPrice.value = calculateAmount();
    saveInLocalStorageCart();
  };

  const calculateAmount = () => {
    return productsCart.value.reduce((sum, item) => sum + divideBy100(item.price)!, 0);
  };

  const saveInLocalStorageCart = () => {
    localStorage.setItem(import.meta.env.VITE_CART, JSON.stringify(productsCart.value));
  };

  const getLocalStorageCart = (): void => {
    const storage: string | null = localStorage.getItem(import.meta.env.VITE_CART);

    if (storage) {
      productsCart.value = JSON.parse(storage);
      totalPrice.value = calculateAmount();
    } else {
      productsCart.value = [];
      totalPrice.value = 0;
    }
  };

  return { productsCart, totalPrice, updateCart, deleteProduct, getLocalStorageCart };
});