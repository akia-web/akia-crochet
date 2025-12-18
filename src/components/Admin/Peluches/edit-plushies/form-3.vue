<template>
  <h1 class="text-center mb-6 text-xl mt-2"> Variants</h1>
  <div class="flex flex-row-reverse">
    <Button icon="pi pi-plus"
            class="mb-2"
            @click="addVariant"
    ></Button>
  </div>

  <Accordion  class="w-[80%] m-auto">
    <AccordionPanel v-for="(variant, index) in variants" :key="variant.id ?? variant.randomId"
                    :value="index">
      <AccordionHeader>{{
          variant.name ? variant.name : `variant ${index}`
        }}
      </AccordionHeader>
      <AccordionContent>
        <VariantComponent
            v-model:name="variant.name"
            v-model:color="variant.color"
            v-model:materials="variant.materials"
            v-model:imagesFiles="variant.imagesFiles"
            v-model:images="variant.images"
            v-model:stock="variant.stock"
            v-model:price="variant.price"
            v-model:width="variant.width"
            v-model:height="variant.height"
            v-model:weight="variant.weight"
            v-model:depth="variant.depth"
            :index="index">
        </VariantComponent>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import VariantComponent from '@/components/Admin/Peluches/edit-plushies/variantComponent.vue';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';

const props = defineProps<{
  variants: PlushieVariantDto[];
}>();

const emit = defineEmits(['update:variants']);

const variantsComputed = computed({
  get: () => props.variants,
  set: (value: PlushieVariantDto[]) => emit('update:variants', value),
});


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
    depth: 0
  });
};

const deleteVariant = (index: number) => {
  variantsComputed.value.splice(index, 1);
};

</script>

<style scoped src="./style.css"></style>