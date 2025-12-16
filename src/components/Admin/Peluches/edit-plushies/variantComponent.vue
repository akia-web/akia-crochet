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

    <div class="flex gap-2 justify-between">
      <div class="flex flex-col">
        <label class="text-xs">Couleur du variant</label>
        <div class="flex ">
          <div class="relative">
            <ColorPicker v-model="color"/>
            <div class="absolute bottom-[2px] left-[4px]">
              <p class="text-xs font-bold"
                 :style="{ color: getContrastColor() }">{{ color }}</p>
            </div>
          </div>

          <Button @click="pickColor"
                  class="w-[60px] h-[60px] p-button-transparent"
                  label="🎨">
          </Button>
        </div>

      </div>

      <div class="flex flex-col">
        <label class="text-xs">Stock</label>
        <InputNumber v-model="stock" :min="0"/>
      </div>

    </div>

    <br>

    <label class="text-xs">Images</label>
    <InputGroup>
      <InputText placeholder="Selectionner une image" @click="activeInput" readonly/>
      <Button icon="pi pi-upload" @click="activeInput"/>
    </InputGroup>
    <br>
    <draggable v-model="imagesFiles" item-key="file.name" @end="updateRows" class="flex gap-2">
      <template #item="{ element: image, index }">
        <div class="relative">
          <img
              :src="createThumbnail(image.file)"
              class="preview mb-4"
              alt="image du produit"
          />

          <p
              class="pi pi-times absolute right-[5px] top-[5px] p-[10px] bg-white hover:bg-actionColorHover hover:cursor-pointer hover:text-white"
              @click="deleteFile(image.file)"
          />

          <p class="text-white absolute left-[5px] bottom-[16px] text-xs">
            {{ image.file.name }} - {{ (image.file.size / 1024).toFixed(1) }} KB
          </p>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ImagesDto } from '@/interfaces/images.dto.ts';
import draggable from 'vuedraggable';


const props = defineProps<{
  name: string;
  color: string;
  materials: string[];
  imagesFiles: { file: File, row: number }[];
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
  set: (value) => {
    if (!value.includes('#')) {
      value = `#${value}`;
    }
    emit('update:color', value);
  }
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

  const newFiles = Array.from(target.files).map((file, index) => ({ file, row: getNextRow(index) }));
  imagesFiles.value.push(...newFiles);

};

const createThumbnail = (file: File) => {
  return URL.createObjectURL(file);
};

const deleteFile = (file: File) => {
  imagesFiles.value = imagesFiles.value.filter(f => f.file !== file);
  images.value = images.value.filter(img => img.url.split('/images/')[1] !== file.name);
  updateRows();

};

const pickColor = async () => {
  if ('EyeDropper' in window) {
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      color.value = result.sRGBHex;
    } catch (err) {
      console.error('Pipette annulée ou erreur :', err);
    }
  } else {
    alert('Votre navigateur ne supporte pas la pipette 😢 (Chrome/Edge requis)');
  }
};

const getContrastColor = () => {
  const hex = color.value.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  return luminance > 186 ? '#000000' : '#ffffff';
};

const getNextRow = (fileIndex?: number) => {

  if (imagesFiles.value.length === 0) {
    return fileIndex ? fileIndex : 0;
  }

  const rows = imagesFiles.value.map(img => img.row);
  const maxRow = Math.max(...rows);
  return maxRow + 1;
};

const updateRows = () => {
  imagesFiles.value.forEach((imageFile, index) => {
    imageFile.row = index;

    const filename = imageFile.file.name;

    const imageIndex = images.value.findIndex(image => {
      const dbFilename = image.url.includes('/images/')
          ? image.url.split('/images/')[1]
          : image.url;

      return dbFilename === filename;
    });

    if (imageIndex !== -1) {
      images.value[imageIndex].row = index;
    }
  });
};

</script>

<style scoped src="./style.css"></style>