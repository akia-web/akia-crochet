<template>
  <div class="flex column justify-center">
    <form>
      <div class="mb-1 flex column">
        <label class="font-size-0_8em italic">Titre</label>
        <InputText name="name"
                   v-model="name"
                   type="text"
                   placeholder="nom"
        />
      </div>

      <div class="mb-1 flex column">
        <label class="font-size-0_8em italic">Description</label>
        <Editor name="description"
                v-model="description"
                editorStyle="height: 320px"
        />
      </div>

      <div class="mb-1 flex column">
        <label class="font-size-0_8em italic">Temps de réalisation</label>
        <InputNumber name="realisationTime"
                     v-model="realisationTime"
                     placeholder="Temps de réalisation"
        />
      </div>

      <div class="mb-1 flex column">
        <label class="font-size-0_8em italic">Vidéo</label>
        <InputText name="vidéo"
                   v-model="video"
                   type="text"
                   placeholder="vidéo"
        />
      </div>


      <div class="flex">
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
          <label class="font-size-0_8em italic">Autres images</label>
          <div class="flex">
            <div>
              <InputText :id="`uploadImages`"
                         hidden
                         type="file"
                         @change="onFileSelect($event, 'uploadImages')"/>

              <div v-if="thumbnailsImages.length>0"
                   class="mt-2 flex width-100 justify-space-between align-items-center">
                <div v-for="(image, index) in thumbnailsImages" :key="index">
                  <img v-if="image" :src="image as string"
                       class="preview mb-4"
                       alt="image du produit"/>
                  <p class="pi pi-times" @click="deleteFile(image, index)"></p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button label="Ajouter une image"
                    v-if="thumbnailPresention"
                    icon="pi pi-plus"
                    @click="activeInput($event, 'uploadImages')"
            ></Button>
          </div>
        </div>
      </div>

      <Button type="submit" severity="secondary" label="Submit" @click="onFormSubmit"/>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const name = ref<string>('');
const description = ref<string>('');
const realisationTime = ref<number>(0);
const video = ref<string>('');
const presentationImage = ref<string>('');
const filePresentation = ref<File>();
const thumbnailPresention = ref();
const imagesName = ref<string[]>([]);
const imagesFiles = ref<File[]>([]);
const thumbnailsImages = ref<(string | ArrayBuffer)[]>([]);
const numberImage = ref<number>(0);


const deleteFile = (image: any, index:number) => {
  const deleteImage = imagesFiles.value[index]
  imagesFiles.value = imagesFiles.value.filter((element)=> element !== deleteImage)
  thumbnailsImages.value = thumbnailsImages.value.filter((element) => element !== image);console.log(imagesFiles.value)
};

const activeInput = (event: Event, selectInput: 'uploadImages' | 'uploadPresentationImage') => {
  const buttonUpload = document.getElementById(selectInput);
  if (buttonUpload) {
    buttonUpload.click();
  }
};

const onFileSelect = async (event: Event, selectFile: 'uploadImages' | 'uploadPresentationImage') => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  if (selectFile === 'uploadImages') {
    imagesName.value.push(target.files[0].name);
    imagesFiles.value.push(target.files[0]);
    createThumbnail(target.files[0], 'uploadImages');
  } else {
    presentationImage.value = target.files[0].name;
    filePresentation.value = target.files[0];
    createThumbnail(target.files[0], 'uploadPresentationImage');
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

const onFormSubmit = async (e: any) => {
  e.preventDefault();
  const allImage = [...imagesFiles.value, filePresentation.value];

  const formData = new FormData();
  allImage.forEach((file) => {
    formData.append('images', file as File);
  });

  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('realisationTime', realisationTime.value.toString());
  formData.append('presentationImage', presentationImage.value);

  if (video.value) {
    formData.append('video', video.value);
  }


  await fetch('http://localhost:3001/peluches', {
    method: 'POST',
    body: formData,
  });


};
</script>

<style scoped src="./style.css"></style>