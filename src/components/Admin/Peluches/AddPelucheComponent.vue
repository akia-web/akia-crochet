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

      <div class="mb-1 flex column">
        <InputText id="uploadPresentationImage"
                   hidden
                   type="file"
                   @change="onFileSelect($event)">
        </InputText>

        <InputGroup class="w-100 mt-2">
          <InputText placeholder="Selectionner une image"
                     class="padding-10px width-file-input"
                     @click="activeInput($event)"
                     readonly
                     v-model="presentationImage"/>
          <Button icon="pi pi-upload" class="background-dark" @click="activeInput($event)"/>
        </InputGroup>

        <div v-if="thumbnailPresention" class="mt-2 flex width-100 justify-space-between align-items-center">
          <img :src="thumbnailPresention"
               class="preview mb-4"
               alt="image du produit">
        </div>

        <div v-for="(index) in numberImage" :key="index">
          <InputText :id="`uploadImages-${index}`"
                     hidden
                     type="file"
                     @change="onFileSelect($event, index)"/>
          <InputGroup class="w-100 mt-2">
            <InputText placeholder="Sélectionner une image"
                       class="padding-10px width-file-input"
                       v-model="imagesName[index - 1]"
                       @click="activeInput($event, index)"
                       readonly/>
            <Button icon="pi pi-upload" class="background-dark" @click="activeInput($event, index)"/>
          </InputGroup>

          <div v-if="thumbnailsImages[index - 1]" class="mt-2 flex width-100 justify-space-between align-items-center">
            <img :src="thumbnailsImages[index - 1]"
                 class="preview mb-4"
                 alt="image du produit"/>
          </div>
        </div>
      </div>

      <div>
        <Button label="Ajouter une image"
                icon="pi pi-plus"
                @click="numberImage +=1 "
        ></Button>
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

const activeInput = (event: Event, n?: number) => {
  const input = n ? `uploadImages-${n}` : 'uploadPresentationImage';
  const buttonUpload = document.getElementById(input);
  if (buttonUpload) {
    buttonUpload.click();
  }
};

const onFileSelect = async (event: Event, n?: number) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  if (n) {
    imagesName.value[n - 1] = target.files[0].name;
    imagesFiles.value[n - 1] = target.files[0];
    createThumbnail(n);
  } else {
    presentationImage.value = target.files[0].name;
    filePresentation.value = target.files[0];
    createThumbnail();
  }
};

const createThumbnail = (n?: number) => {
  const reader = new FileReader();

  if (n) {
    if (imagesFiles.value[n - 1]) {
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          thumbnailsImages.value[n - 1] = e.target.result;
        }
      };
      reader.readAsDataURL(imagesFiles.value[n - 1]);
    }
  } else {
    if (filePresentation.value) {
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          thumbnailPresention.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(filePresentation.value);
    }
  }
};
const onFormSubmit = async (e: any) => {
  e.preventDefault();
  const allImage = [... imagesFiles.value, filePresentation.value]

  const formData = new FormData();
  allImage.forEach((file) => {
    formData.append('images', file as File);
  });

  formData.append('name', name.value)
  formData.append('description', description.value)
  formData.append('realisationTime', realisationTime.value.toString())
  formData.append('presentationImage', presentationImage.value)

  if(video.value){
    formData.append('video', video.value)
  }


  await fetch('http://localhost:3001/peluches', {
    method: 'POST',
    body: formData,
  });


};
</script>

<style scoped src="./style.css"></style>