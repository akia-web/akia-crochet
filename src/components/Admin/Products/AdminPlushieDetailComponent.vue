<template>
  <Card v-if="selectedVariant">
    <template #title>
      <div class="flex justify-between align-center">
        <p> {{ props.product.name }}</p>
        <div>
          <span class="pi pi-file-edit" @click="editPeluche(props.product)"></span>
          <span class="pi pi-trash ml-4" @click="deletePlushie(props.product)"></span>
        </div>

      </div>

    </template>
    <template #content>
      <img :src="selectedVariant.images[0].url" class="image-card" alt="">

      <div class="flex gap-2 mt-1">
        <div v-for="(variant, index) in product.productVariants "
             class="w-[20px] h-[20px] rounded-full cursor-pointer"
             :style="{ background: variant.color, border: selectedVariant.color === variant.color?'1px solid black' : 'transparent' }"
             @click="selectedVariant = props.product.productVariants![index]">
        </div>
      </div>

      <div v-if="product.collection" class="mt-2">
        <Chip label="Collection"
        class="bg-actionColor"/>

      </div>

    </template>
  </Card>
</template>

<script lang="ts" setup>
import type { ProductDto } from '@/interfaces/product.dto.ts';
import { onMounted, ref } from 'vue';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto.ts';

const props = defineProps<{
  product: ProductDto;
}>();

const selectedVariant = ref<ProductVariantDto>();

const emit = defineEmits(['edit', 'delete']);

onMounted(() => {
  if (props.product.productVariants) {
    selectedVariant.value = props.product.productVariants[0];
  }

});

const editPeluche = (item: ProductDto) => {
  emit('edit', item);
};

const deletePlushie = (item: ProductDto) => {
  emit('delete', item);
};

</script>
<style src="./style.css" scoped></style>