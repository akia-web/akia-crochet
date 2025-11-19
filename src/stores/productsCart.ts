import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { divideBy100 } from '@/functions/convertions';

export const useProductsCartStore = defineStore('cart', () => {
  const productsCart = ref<ProductShopDto[]>([]);
  const totalPrice = ref<number>(0)

  const updateCart = (value: ProductShopDto) => {
    productsCart.value.push(value)
    totalPrice.value = calculateAmount()
  }

  const deleteProduct = (product:ProductShopDto )=>{
    productsCart.value = productsCart.value.filter((element: ProductShopDto)=> element.name !== product.name)
    totalPrice.value = calculateAmount()

  }

  const calculateAmount = () => {
      return productsCart.value.reduce((sum, item) => sum + divideBy100(item.price)!, 0)
  } 

  return { productsCart, totalPrice,updateCart, deleteProduct };
});