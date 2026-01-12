<template>
  <div class="flex" v-if="plushie && selectedVariant">
    <div class="mr-1">
      <div v-for="image in selectedVariant.images"
           :class="['border-2', 'mb-1','rounded','cursor-pointer',
      image.url === selectedImage?.url ? ' border-[var(--action-color)]' : 'border-black']">
        <img :src="image.url" alt="" class="w-[50px] h-[50px] object-cover"
             @click="selectedImage = image">
      </div>
    </div>
    <img v-if="selectedImage" :src="selectedImage.url" class="w-[400px] h-[400px] object-cover" alt="">
    <div class="ml-8 w-[calc(100%-500px)]">
      <h1 class="text-center">{{ pelucheName }}</h1>
      <h2 class="mt-4 underline">Description du produit</h2>
      <p v-html="plushie.description"></p>

      <h2 class="mt-4 underline">Prix</h2>
      <p>{{ price }} €</p>

      <div v-if="selectedVariant.height && selectedVariant.width">
        <h2 class="mt-4 underline">Dimentions</h2>
        <p>Hauteur: {{ selectedVariant.height }} cm - Largeur: {{ selectedVariant.width }} cm</p>
      </div>

      <div v-for="(variant, index) in plushie.plushieVariants">
        <div class="w-[20px] h-[20px] rounded-full cursor-pointer"
             :style="{ background: variant.color, border: selectedVariant.color === variant.color?'1px solid black' : 'transparent' }"
             @click="updateVariant(index)">
        </div>
      </div>


      <Button :label="selectedVariant.stock >0? 'Ajouter': 'Pré-commander'"
              icon="pi pi-cart-plus"
              :disabled="disabled"
              @click="addCart(selectedVariant.stock===0)">
      </Button>

    </div>
  </div>


</template>
<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { divideBy100 } from '@/functions/convertions.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';
import type { ImagesDto } from '@/interfaces/images.dto.ts';
import { useRoute, useRouter } from 'vue-router';


const storeProductsCart = useProductsCartStore();

const props = defineProps<{
  pelucheName: string,
  selectedVariantName: string
}>();


const plushie = ref<PlushieDto>();
const selectedVariant = ref<PlushieVariantDto>();
const selectedImage = ref<ImagesDto>();
const router = useRouter();
const route = useRoute();

const disabled = computed(() =>
    storeProductsCart.productsCart.some(
        el => el.plushieVariant.id === selectedVariant.value?.id
    )
);
onMounted(async () => {
  await apiGet(api(`${env.plushies.byName}?name=${props.pelucheName}`), 'GET').then(response => response.json())
      .then(data => {
        plushie.value = data;

        if (plushie.value?.plushieVariants) {
          const variant: PlushieVariantDto[] = plushie.value.plushieVariants.filter((e) => e.name === props.selectedVariantName);
          if (variant.length > 0) {
            selectedVariant.value = variant[0];
          } else {
            selectedVariant.value = plushie.value.plushieVariants[0];
          }
          selectedImage.value = selectedVariant.value.images[0];
        }
      });
});

const price = computed(() => divideBy100(selectedVariant.value?.price));

const updateVariant = (index: number) => {
  if (plushie.value && plushie.value.plushieVariants) {
    selectedVariant.value = plushie.value.plushieVariants[index];
    selectedImage.value = selectedVariant.value.images[0];

    router.replace({
      name: route.name,      // ou path: route.path
      params: { ...route.params, selectedVariantName: selectedVariant.value.name }  // garde les autres params
    });
  }

};

const addCart = (preOrder: boolean): void => {
  if (plushie.value?.id && selectedVariant.value?.id) {
    storeProductsCart.updateCart({
      plushieVariant: selectedVariant.value,
      plushie: plushie.value,
      quantity: 1,
      preOrder: preOrder,
      acceptedPreOrder: preOrder,
    });
  }
};

</script>
