<template>
  <h1 class="text-center mb-6 text-xl mt-2"> Images</h1>
  <form>
    <div>
      <div class="mb-1 flex column">
        <label class="font-size-0_8em italic">Image de présentation</label>
        <InputText id="uploadPresentationImage"
                   hidden
                   type="file"
                   @change="onFileSelect($event, 'uploadPresentationImage')">
        </InputText>

        <InputGroup class="w-100">
          <InputText placeholder="Selectionner une image"
                     class="padding-10px width-file-input"
                     @click="activeInput($event, 'uploadPresentationImage')"
                     readonly
                     v-model="presentationImage"/>
          <Button icon="pi pi-upload" class="background-dark"
                  @click="activeInput($event, 'uploadPresentationImage')"/>
        </InputGroup>

        <div v-if="thumbnailPresention" class="mt-2 flex width-100 justify-space-between align-items-center">
          <img :src="thumbnailPresention"
               class="preview mb-4"
               alt="image du produit">
        </div>
      </div>

      <div v-if="presentationImage" class="ml-2">
        <InputText :id="`uploadImages`"
                   hidden
                   type="file"
                   @change="onFileSelect($event, 'uploadImages')"/>
        <Button label="Ajouter une autre image"
                v-if="thumbnailPresention"
                icon="pi pi-plus"
                @click="activeInput($event, 'uploadImages')"
        />
      </div>
        <div v-if="thumbnailsImages.length>0"
             class="mt-2">
          <label class="font-size-0_8em italic">Autres images</label>
          <div class="flex">
            <div v-for="(image, index) in thumbnailsImages" :key="index"
            class="relative">
              <img v-if="image" :src="image as string"
                   class="preview mb-4"
                   alt="image du produit"/>
              <p class="pi pi-times absolute right-[5px] top-[5px] rounded-full p-[10px] bg-white hover:bg-actionColorHover hover:cursor-pointer hover:text-white" @click="deleteFile(image, index)"></p>
            </div>
          </div>
        </div>
      <div>
      </div>
    </div>

  </form>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  const imagesName = ref<string[]>([]);
  const imagesFiles = ref<File[]>([]);
  const thumbnailsImages = ref<(string | ArrayBuffer)[]>([]);
  const presentationImage = ref<string>('');
  const filePresentation = ref<File>();
  const thumbnailPresention = ref();

  const deleteFile = (image: any, index: number) => {
    const deleteImage = imagesFiles.value[index];
    imagesFiles.value = imagesFiles.value.filter((element) => element !== deleteImage);
    thumbnailsImages.value = thumbnailsImages.value.filter((element) => element !== image);
    emit('update:imagesFiles', imagesFiles.value);
  };

  const activeInput = (event: Event, selectInput: 'uploadImages' | 'uploadPresentationImage') => {
    const buttonUpload = document.getElementById(selectInput);
    if (buttonUpload) {
      buttonUpload.click();
    }
  };

  const emit = defineEmits([
    'update:filePresentation',
    'update:imagesFiles',
    'update:presentationImage',
  ]);

  const props = defineProps({
    imagesFiles: {
      type: Array as () => File[],
      default: () => []
    },
    filePresentation: File,
    presentationImage: String
  });


  const onFileSelect = async (event: Event, selectFile: 'uploadImages' | 'uploadPresentationImage') => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    if (selectFile === 'uploadImages') {
      imagesName.value.push(target.files[0].name);
      imagesFiles.value.push(target.files[0]);
      createThumbnail(target.files[0], 'uploadImages');
      emit('update:imagesFiles', imagesFiles.value);
    } else {
      presentationImage.value = target.files[0].name;
      filePresentation.value = target.files[0];
      createThumbnail(target.files[0], 'uploadPresentationImage');
      emit('update:filePresentation', filePresentation.value);
      emit('update:presentationImage', presentationImage.value);
    }
  };

  const createThumbnail = (file: File, selectGroup: 'uploadImages' | 'uploadPresentationImage') => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target && e.target.result) {
        if (selectGroup === 'uploadPresentationImage') {
          thumbnailPresention.value = e.target.result as string;
        } else {
          thumbnailsImages.value.push(e.target.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };
</script>

<style scoped src="./style.css"></style>