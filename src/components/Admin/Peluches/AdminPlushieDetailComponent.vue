<template>
  <Card>
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
      <img :src="selectedVariant" class="image-card" alt="">
    </template>
  </Card>
</template>

<script lang="ts" setup>
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  plushie: PlushieDto;
}>();

const selectedVariant = ref<string>('');

const emit = defineEmits(['edit', 'delete']);

onMounted(()=>{
  if(props.plushie.plushieVariants){
    selectedVariant.value = props.plushie.plushieVariants[0].images[0].url
  }

})

const editPeluche = (item: PlushieDto) =>{
  emit('edit', item)
}

const deletePlushie = (item: PlushieDto) =>{
  emit('delete', item)
}

</script>
<style src="./style.css" scoped></style>