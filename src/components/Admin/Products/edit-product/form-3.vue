<template>
  <h1 class="text-center mb-6 text-xl mt-2"> Variants</h1>
  <div class="flex flex-row-reverse">
    <Button icon="pi pi-plus"
            class="mb-2"
            @click="addVariant"
    ></Button>
  </div>

  <div>
    <draggable v-model="variantsComputed" item-key="variant.id ?? variant.randomId" @end="updateRows"
    class="flex flex-col">
      <template #item="{ element: variant, index }">
            <VariantComponent
                v-model:name="variant.name"
                v-model:color="variant.color"
                v-model:materials="variant.materials"
                v-model:imagesFiles="variant.imagesFiles!"
                v-model:images="variant.images"
                v-model:stock="variant.stock"
                v-model:price="variant.price"
                v-model:width="variant.width"
                v-model:height="variant.height"
                v-model:weight="variant.weight"
                v-model:depth="variant.depth"
                v-model:row="variant.row"
                v-model:isVisible="variant.isVisible"
                :isActive="activeVariant === index"
                :index="index"
                @updateActiveVariant="handleUpdateActiveVariant($event)"
                @deleteVariant = handleDeleteVariant($event)
                >
            </VariantComponent>
      </template>
    </draggable>
  </div>

</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import VariantComponent from '@/components/Admin/Products/edit-product/variantComponent.vue';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto.ts';

const props = defineProps<{
  variants: ProductVariantDto[];
}>();

const emit = defineEmits(['update:variants']);

const variantsComputed = computed({
  get: () => props.variants,
  set: (value: ProductVariantDto[]) => emit('update:variants', value),
});

const activeVariant = ref<number | undefined>(undefined);


const addVariant = () => {
  variantsComputed.value.push({
    name: '',
    color: '#000000',
    materials: [],
    imagesFiles: [],
    stock: 0,
    randomId: crypto.randomUUID(),
    images: [],
    price: 0,
    width: 0,
    height: 0,
    weight: 0,
    depth: 0,
    row: nextRow(),
    isVisible: true
  });
};

const nextRow = () => {
  const rows = variantsComputed.value.map(variant => variant.row);
  const maxRow = Math.max(...rows);
  return maxRow + 1;
}


const handleUpdateActiveVariant = (event:number | undefined) => {
  activeVariant.value = event
}


const updateRows = () => {
 variantsComputed.value.forEach((variant, index) => {
    variant.row = index;
  });
}

const handleDeleteVariant = (event:any) => {
  variantsComputed.value = variantsComputed.value.filter(element => element.row !== event)
  updateRows()
}
</script>

<style scoped src="./style.css"></style>