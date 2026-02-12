<template>
  <div class="flex mt-8 flex-col lg:flex-row gap-2 bg-white rounded-lg" v-if="plushie && selectedVariant">
    <div class="flex flex-col lg:flex-row gap-2 mx-auto pt-8 lg:pl-[50px] w-full lg:w-[40%] md:min-w-[500px]">
      <div class="flex gap-1 justify-center md:justify-normal lg:flex-col">
        <div v-for="image in selectedVariant.images"
             :class="['mb-1','rounded','cursor-pointer','w-[60px]', 'flex', 'justify-center', 'items-center', 'h-[60px]',
      image.url === selectedImage?.url ? ' bg-actionColor' : 'bg-transparent']">
          <img :src="image.url" alt="" class="w-[50px] h-[50px] rounded-lg"
               @click="selectedImage = image">
        </div>
      </div>
      <div>
        <div class="relative">
          <img v-if="selectedImage" :src="selectedImage.url" class=" w-[90%] mx-auto md:w-[400px] md:h-[400px] rounded-lg shadow-lg" alt="">
          <img src="../../assets/icones/scotch.svg" class=" hidden lg:block lg:absolute lg:top-[9px] lg:right-[-32px] w-[100px] rotate-[50deg]" alt="">
        </div>
      </div>

    </div>

    <div class="p-[20px] lg:w-[60%]">
      <h1 class="text-center border-dotted border border-actionColor p-[10px] text-actionColor">{{
          pelucheName
        }}{{ plushie.plushieVariants && plushie.plushieVariants.length > 1 ? ` - ` + selectedVariant.name : `` }}</h1>

      <div class="flex items-center mt-4 gap-2">
        <img src="@/assets/icones/doc.svg" alt="">
        <h2 class="font-semibold mt-1">Description du produit :</h2>
      </div>

      <p class="pl-8" v-html="plushie.description"></p>

      <div class="mt-4">
        <div class="flex items-center gap-2">
          <img src="@/assets/icones/cut.svg" alt="">
          <h2 class="font-semibold">Matériaux :</h2>
        </div>

        <div class="flex gap-2 flex-wrap mt-1  pl-8">
          <Tag v-for="material in selectedVariant.materials" :value="material" severity="secondary"></Tag>
        </div>
      </div>

      <div class="flex items-center mt-5 gap-1">
        <div class="flex items-center gap-2">
          <img src="@/assets/icones/piggy-bank.svg" alt="">
          <h2 class="font-semibold">Prix :</h2>
        </div>

        <p>{{ price }} €</p>
      </div>


      <div v-if="selectedVariant.height && selectedVariant.width" class="flex items-center gap-1 mt-4">
        <div class="flex items-center gap-2">
          <img src="@/assets/icones/zoom-out-1.svg" alt="">
          <h2 class="font-semibold mt-1">Dimension :</h2>
        </div>

        <p class="mt-1">H. {{ selectedVariant.height }} cm - L. {{ selectedVariant.width }} cm</p>
      </div>


      <div class="mt-4" v-if="plushie.plushieVariants && plushie.plushieVariants.length >1">
        <div class="flex items-center gap-1">
          <img src="@/assets/icones/paint-bucket.svg" alt="">
          <h2 class="font-semibold">Couleur :</h2>
        </div>

        <div class="flex gap-2 mt-1 pl-8">
          <div v-for="(variant, index) in plushie.plushieVariants">
            <div class="w-[20px] h-[20px] rounded-full cursor-pointer"
                 :style="{ background: variant.color, border: selectedVariant.color === variant.color?'2px solid black' : 'transparent' }"
                 @click="updateVariant(index)">
            </div>
          </div>

        </div>
      </div>
      <div class="mt-8">
        <MaintenanceTipsComponent/>
      </div>


      <Button :label="selectedVariant.stock >0? 'Ajouter': 'Pré-commander'"
              icon="pi pi-cart-plus"
              class="mt-8"
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
import MaintenanceTipsComponent from '@/components/Peluches/MaintenanceTipsComponent.vue';


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
      name: route.name,
      params: { ...route.params, selectedVariantName: selectedVariant.value.name }
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
