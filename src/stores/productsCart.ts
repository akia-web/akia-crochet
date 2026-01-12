import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { divideBy100 } from '@/functions/convertions';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

export const useProductsCartStore = defineStore('cart', () => {
    const productsCart = ref<ProductShopDto[]>([]);
    const totalPrice = ref<number>(0);
    const openModal = ref<boolean>(false);
    const openSlider = ref<boolean>(false);
    const listOutOfStocks = ref<ProductShopDto[]>([]);
    const productCartLength = ref<number>(0);

    const updateCart = async (value: ProductShopDto): Promise<void> => {
      console.warn('updateCart');
      await apiGet(`${api(env.plushies.variant)}?id=${value.plushieVariant.id}`, 'GET').then(response => response.json())
        .then(data => {
          value.plushieVariant = data;
          value.preOrder = data.stock === 0;

        });

      const searchVariantInProductCartIndex = productsCart.value.findIndex((element: ProductShopDto) => element.plushieVariant.id === value.plushieVariant.id);

      if (searchVariantInProductCartIndex === -1) {
        value.acceptedPreOrder = value.preOrder;
        productsCart.value.push(value);

        if (!openSlider.value) {
          openSlider.value = true;
        }
      } else {
        productsCart.value[searchVariantInProductCartIndex].acceptedPreOrder = value.acceptedPreOrder;
        productsCart.value[searchVariantInProductCartIndex].quantity = value.quantity;
        productsCart.value[searchVariantInProductCartIndex].preOrder = value.preOrder;
      }

      totalPrice.value = calculateAmount();
      saveInLocalStorageCart();
    };

    const deleteProduct = (product: ProductShopDto): void => {
      console.warn('deleteProduct');
      productsCart.value = productsCart.value.filter((element: ProductShopDto) => element.plushieVariant.id !== product.plushieVariant.id);
      totalPrice.value = calculateAmount();
      saveInLocalStorageCart();
    };

    const calculateAmount = () => {
      console.warn('calculateAmount');

      return productsCart.value.reduce((sum, item) => {
        return (item.preOrder && item.acceptedPreOrder) || !item.preOrder
          ? sum + divideBy100(item.plushieVariant.price)!
          : sum;
      }, 0);
    };

    const saveInLocalStorageCart = () => {
      console.warn('saveInLocalStorageCart');

      if (productsCart.value.length > 0) {
        localStorage.setItem(import.meta.env.VITE_CART, JSON.stringify(productsCart.value));
      } else {
        localStorage.removeItem(import.meta.env.VITE_CART);
      }

      getProductsCartLength(productsCart.value);
    };

    const getLocalStorageCart = async (): Promise<void> => {
      console.warn('getLocalStorageCart');
      const storage: string | null = localStorage.getItem(import.meta.env.VITE_CART);

      listOutOfStocks.value = [];
      openModal.value = false;

      if (storage) {
        productsCart.value = [];
        await searchAllProducts(JSON.parse(storage));


        if (listOutOfStocks.value.length > 0) {
          openModal.value = true;
        }

        totalPrice.value = calculateAmount();
        getProductsCartLength(productsCart.value);

      } else {
        productsCart.value = [];
        totalPrice.value = 0;
        getProductsCartLength([]);
      }

    };

    const searchAllProducts = async (list: ProductShopDto[]) => {
      for (const item of list) {
        await apiGet(`${api(env.plushies.variant)}?id=${item.plushieVariant.id}`, 'GET').then(response => response.json())
          .then(data => {
            item.plushieVariant = data;
            item.preOrder = data.stock === 0;

            if (item.preOrder && !item.acceptedPreOrder) {
              listOutOfStocks.value.push(item);
            }

            productsCart.value.push(item);
          });
      }
    };


    const getProductsCartLength = (list?: ProductShopDto[]): void => {
      const storage: string | null = localStorage.getItem(import.meta.env.VITE_CART);

      if (!storage) {
        productCartLength.value = 0;
        return;
      }

      const parsedCart: ProductShopDto[] = JSON.parse(storage);
      productCartLength.value = list && list.length > 0 ? list.length : parsedCart.length;

    };

    const updateVisibility = (value?: boolean) => {
      console.warn('updateVisibility');
      openSlider.value = value ? value : !openSlider.value;
    };


    return { productsCart, totalPrice, updateCart, deleteProduct, getLocalStorageCart, openModal, openSlider, updateVisibility, listOutOfStocks, getProductsCartLength, productCartLength };
  })
;