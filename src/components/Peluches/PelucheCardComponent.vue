<template>
  <Card v-if="selectedVariant">
    <template #content>
      <RouterLink
          :to="{ name: PLUSHIES_DETAILS_ROUTE, params: { pelucheName: props.plushie.name, selectedVariantName: selectedVariant.name } }">
        <div class="w-[300px] h-[300px] overflow-hidden relative group">
          <img
              :src="selectedVariant.images[0].url"
              alt="illustration"
              class="w-[300px] h-[300px] transition-transform duration-300 hover:scale-105"/>
          <div
              class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Voir détail
          </div>
        </div>
      </RouterLink>
      <h2 class="font-bold mt-1">
        {{ props.plushie.name }}
      </h2>

      <div class="flex gap-1" v-if="plushie && plushie.plushieVariants && plushie.plushieVariants.length>0">
        <div v-for="(variant, index) in plushie.plushieVariants">
          <div class="w-[20px] h-[20px] rounded-full cursor-pointer"
               :style="{ background: variant.color, border: selectedVariant.color === variant.color?'1px solid black' : 'transparent' }"
               @click="updateVariant(index)">
          </div>
        </div>
      </div>


      <div class="flex justify-between items-center">
        <p class="mt-2">{{ price }}</p>
        <Button :label="selectedVariant.stock >0? 'Ajouter': 'Pré-commander'"
                icon="pi pi-cart-plus"
                :disabled="disabled"
                @click="addCart(selectedVariant.stock===0)"></Button>
      </div>

    </template>
  </Card>
</template>
<script lang="ts" setup>
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { Card } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';
import { PLUSHIES_DETAILS_ROUTE } from '@/router/routes-name.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';

const props = defineProps<{
  plushie: PlushieDto
}>();

const storeProductsCart = useProductsCartStore();


const selectedVariant = ref<PlushieVariantDto>();

onMounted(() => {
  if (props.plushie.plushieVariants) {
    selectedVariant.value = props.plushie.plushieVariants[0];
  }

});

const updateVariant = (index: number) => {
  selectedVariant.value = props.plushie.plushieVariants![index];
};


const price = computed(() => {
  return `${selectedVariant.value?.price ? selectedVariant.value?.price / 100 : 0} €`;
});

const disabled = computed(() => {
      return storeProductsCart.productsCart.some(
          el => el.plushieVariant.id === selectedVariant.value?.id
      );
    }
);


const addCart = async (preOrder: boolean): Promise<void> => {
  if (props.plushie?.id && selectedVariant.value?.id) {
    await storeProductsCart.updateCart({
      plushieVariant: selectedVariant.value,
      plushie: props.plushie,
      quantity: 1,
      preOrder: preOrder,
      acceptedPreOrder: preOrder,
    });
  }
};
</script>