<template>
  <Card v-if="selectedVariant">
    <template #title>
      <div class="flex justify-between align-center">
        <p> {{ props.plushie.name }}</p>
        <div>
          <span class="pi pi-file-edit" @click="editPeluche(props.plushie)"></span>
          <span class="pi pi-trash ml-4" @click="deletePlushie(props.plushie)"></span>
        </div>

      </div>

    </template>
    <template #content>
      <img :src="selectedVariant.images[0].url" class="image-card" alt="">

      <div class="flex gap-2 mt-1">
        <div v-for="(variant, index) in plushie.plushieVariants "
             class="w-[20px] h-[20px] rounded-full cursor-pointer"
             :style="{ background: variant.color, border: selectedVariant.color === variant.color?'1px solid black' : 'transparent' }"
             @click="selectedVariant = props.plushie.plushieVariants![index]">
        </div>
      </div>

      <div v-if="plushie.collection" class="mt-2">
        <Chip label="Collection"
        class="bg-actionColor"/>

      </div>

    </template>
  </Card>
</template>

<script lang="ts" setup>
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { onMounted, ref } from 'vue';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';

const props = defineProps<{
  plushie: PlushieDto;
}>();

const selectedVariant = ref<PlushieVariantDto>();

const emit = defineEmits(['edit', 'delete']);

onMounted(() => {
  if (props.plushie.plushieVariants) {
    selectedVariant.value = props.plushie.plushieVariants[0];
  }

});

const editPeluche = (item: PlushieDto) => {
  emit('edit', item);
};

const deletePlushie = (item: PlushieDto) => {
  emit('delete', item);
};

</script>
<style src="./style.css" scoped></style>