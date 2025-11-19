<template>
    <Drawer v-model:visible="visible" position="right">
        <template #header>
            <div class="flex items-center gap-2">
                <h2>Panier</h2>
            </div>
        </template>

        <div v-for="product in storeProductsCart.productsCart"
        class="flex items-center border-b">
            <img :src="product.image" alt="" class="w-[25%]">
            <p class="w-[40%] text-center">{{ product.name }}</p>
            <p class="w-[40%] text-center">{{ divideBy100(product.price)  }} €</p>
           
            <Button icon="pi pi-trash" 
            class="w-[25%] p-button-transparent text-black"
            @click="deleteProduct(product)" />
        </div>

        <p class="text-right">Total: {{ storeProductsCart.totalPrice }} euros</p>

        <template #footer>
            <div class="flex items-center gap-2">
                <Button label="Commander" 
                icon="pi pi-card" 
                class="flex-auto" />
            </div>
        </template>
    </Drawer>
    <Button
    icon="pi pi-shopping-cart"
    class="mr-1 p-button-transparent text-black"
    :badge="storeProductsCart.productsCart.length.toString()"
    @click="visible = !visible" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import {divideBy100} from '@/functions/convertions.ts'


const visible = ref<boolean>(false)
const storeProductsCart = useProductsCartStore();


const deleteProduct = (product: ProductShopDto) =>{
    storeProductsCart.deleteProduct(product)
}

</script>