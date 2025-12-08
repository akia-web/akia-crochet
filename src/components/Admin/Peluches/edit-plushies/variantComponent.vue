<template>
  <div class="flex flex-col mt-2">
    <label class="text-xs">Nom</label>
    <InputText v-model="name"/>

    <br>

    <label class="text-xs">Matériaux</label>
    <MultiSelect
        v-model="materials"
        :options="[ 'Laine chenille', 'Coton','Acrylique', 'Yeux de sécurité' ,'Yeux brodés','Fil de fer']"
        filter
        placeholder="Selectionner des matériaux"
    />

    <InputText
        :id="'uploadImage-' + props.index"
        hidden
        type="file"
        multiple
        accept="image/png, image/jpeg"
        @change="onFileSelect"
    />

    <br>

    <div class="flex gap-2">
      <ColorPicker v-model="color"/>
      <button @click="pickColor" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        🎨 Utiliser la pipette</button>
      {{ color }}
      <label class="text-xs">Stock</label>
      <InputNumber v-model="stock" :min="0"/>
    </div>

    <label class="text-xs">Images</label>
    <InputGroup>
      <InputText placeholder="Selectionner une image" @click="activeInput" readonly/>
      <Button icon="pi pi-upload" @click="activeInput"/>
    </InputGroup>

    <div class="flex gap-2">
      <div v-for="(image, index) in imagesFiles" :key="index" class="relative">
        <img
            :src="createThumbnail(image)"
            class="preview mb-4"
            alt="image du produit"
        />

        <p class="pi pi-times absolute right-[5px] top-[5px] p-[10px] bg-white hover:bg-actionColorHover hover:cursor-pointer hover:text-white"
           @click="deleteFile(image)"/>

        <p class="text-white absolute left-[5px] bottom-[16px] text-xs">
          {{ image.name }} - {{ (image.size / 1024).toFixed(1) }} KB
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ImagesDto } from '@/interfaces/images.dto.ts';


const props = defineProps<{
  name: string;
  color: string;
  materials: string[];
  imagesFiles: File[];
  images: ImagesDto[];
  stock: number;
  index: number;
}>();

const emit = defineEmits([
  'update:name',
  'update:color',
  'update:materials',
  'update:imagesFiles',
  'update:images',
  'update:stock',
]);

const name = computed({
  get: () => props.name,
  set: (value) => emit('update:name', value)
});

const color = computed({
  get: () => props.color,
  set: (value) => emit('update:color', value)
});

const materials = computed({
  get: () => props.materials,
  set: (value) => emit('update:materials', value)
});

const imagesFiles = computed({
  get: () => props.imagesFiles,
  set: (value) => emit('update:imagesFiles', value)
});

const stock = computed({
  get: () => props.stock,
  set: (value) => emit('update:stock', value)
});

const images = computed({
  get: () => props.images,
  set: (value) => emit('update:images', value)
});


const activeInput = () => {
  const input = document.getElementById(`uploadImage-${props.index}`) as HTMLInputElement;
  if (input) input.click();
};

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  imagesFiles.value.push(...target.files);
};

const createThumbnail = (file: File) => {
  return URL.createObjectURL(file);
};

const deleteFile = (file: File) => {
  imagesFiles.value = imagesFiles.value.filter(f => f !== file);
  images.value  = images.value.filter(img => img.url.split('/images/')[1] !== file.name )

};

const pickColor = async () => {
  // Vérifie que le navigateur supporte l'API
  if ('EyeDropper' in window) {
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open(); // Ouvre la pipette
      color.value = result.sRGBHex;          // "#RRGGBB"
    } catch (err) {
      console.error('Pipette annulée ou erreur :', err);
    }
  } else {
    alert('Votre navigateur ne supporte pas la pipette 😢 (Chrome/Edge requis)');
  }
};

</script>

<style scoped src="./style.css"></style>