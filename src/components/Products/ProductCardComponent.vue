<template>
  <Card v-if="selectedVariant" class="min-h-[434px]">
    <template #content>
      <RouterLink
          :to="{ name: PRODUCTS_DETAILS_ROUTE, params: { productName: props.product.name, selectedVariantName: selectedVariant.name } }">
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
        {{ props.product.name }}
      </h2>

      <div class="flex gap-1" v-if="product && product.productVariants && product.productVariants.length>1">
        <div v-for="(variant, index) in product.productVariants">
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
import type { ProductDto } from '@/interfaces/product.dto.ts';
import { Card } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto.ts';
import { PRODUCTS_DETAILS_ROUTE } from '@/router/routes-name.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';

const props = defineProps<{
  product: ProductDto
}>();

const storeProductsCart = useProductsCartStore();


const selectedVariant = ref<ProductVariantDto>();

onMounted(() => {
  if (props.product.productVariants) {
    selectedVariant.value = props.product.productVariants[0];
  }

});

const updateVariant = (index: number) => {
  selectedVariant.value = props.product.productVariants![index];
};


const price = computed(() => {
  return `${selectedVariant.value?.price ? selectedVariant.value?.price / 100 : 0} €`;
});

const disabled = computed(() => {
      return storeProductsCart.productsCart.some(
          el => el.productVariant.id === selectedVariant.value?.id
      );
    }
);


const addCart = async (preOrder: boolean): Promise<void> => {
  if (props.product?.id && selectedVariant.value?.id) {
    await storeProductsCart.updateCart({
      productVariant: selectedVariant.value,
      product: props.product,
      quantity: 1,
      preOrder: preOrder,
      acceptedPreOrder: preOrder,
    });
  }
};
</script>