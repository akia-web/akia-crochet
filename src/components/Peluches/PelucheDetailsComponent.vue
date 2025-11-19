<template>
 

  <div class="flex" v-if="plushie">
    <div class="mr-1">
      <div v-for="image in imagePlushie"
      :class="['border-2', 'mb-1','rounded','cursor-pointer', 
      image === selectedImage ? ' border-[var(--action-color)]' : 'border-black']">
        <img :src="image" alt="" class="w-[50px] h-[50px] object-cover"
        @click="selectedImage = image">
      </div>
    </div>
    <img v-if="selectedImage" :src="selectedImage" class="w-[400px] h-[400px] object-cover" alt="">
    <div class="ml-8 w-[calc(100%-500px)]">
       <h1 class="text-center">{{ pelucheName }}</h1> 
        <h2 class="mt-4 underline">Description du produit</h2>
          <p v-html="plushie.description"></p>      
          
         <h2 class="mt-4 underline">Prix</h2>
         <p>{{ price }} €</p>

         <div v-if="height && width">
          <h2 class="mt-4 underline">Dimentions</h2>
          <p>Hauteur: {{ height }} cm - Largeur: {{ width }} cm</p>
         </div>

         <Button label="Ajouter au panier" 
         icon="pi pi-cart-plus"
         :disabled="disabled"
         @click="addCart()">
        </Button>
      
    </div>
  </div>


</template>
<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { PeluchesDto } from '@/interfaces/peluchesDto.ts';
import {divideBy100} from '@/functions/convertions.ts'
import { useProductsCartStore } from '@/stores/productsCart.ts';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';


const storeProductsCart = useProductsCartStore();

const props = defineProps<{
  pelucheName: string
}>()


const plushie = ref<PeluchesDto>()
const imagePlushie = ref<string[]>([])
const selectedImage = ref<string>()
const pricePlushie = ref<number>(0)
const heightPlushie = ref<number | undefined>(undefined)
const widthPlushie = ref<number | undefined>(undefined)
const disabled = ref<boolean>(true);
onMounted(async() => {
 await apiGet(api(`${env.plushies.byName}?name=${props.pelucheName}`),'GET').then(response => response.json())
      .then(data => {
        console.warn(data)
        plushie.value = data;
        imagePlushie.value.push(data.presentationImage)
        selectedImage.value = data.presentationImage
        pricePlushie.value = data.price
        
        if(data.height){
          heightPlushie.value = data.height
        }

        if(data.width){
          widthPlushie.value = data.width
        }
        
        for(let img of data.images){
           imagePlushie.value.push(img.url)
        }

        const productIsInCart: ProductShopDto | undefined = storeProductsCart.productsCart.find((element)=> element.name === data.name)

        disabled.value = productIsInCart !== undefined;
      });
});

const price = computed(() => divideBy100( pricePlushie.value))
const height = computed(() => divideBy100( heightPlushie.value))
const width = computed(() => divideBy100( widthPlushie.value))

const addCart = () => {
  if(plushie.value?.name && plushie.value.price && plushie.value.presentationImage){
    storeProductsCart.updateCart({name: plushie.value.name, price:plushie.value.price, image: plushie.value.presentationImage})
    disabled.value = true;
  }
 
}

</script>
