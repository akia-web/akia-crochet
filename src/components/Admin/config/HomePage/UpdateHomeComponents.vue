<template>
  <div class="p-[10px]">
    <div class="bg-white p-[10px]">
      <h1 class="mt-4 mb-4">Modification de la page d'accueil</h1>
      <InputGroup>
        <InputText :placeholder="placeholder" @click="activeInput" readonly/>
        <Button icon="pi pi-upload" @click="activeInput"/>
      </InputGroup>
      <InputText
          id="uploadImage"
          hidden
          type="file"
          multiple
          accept="image/png, image/jpeg"
          @change="onFileSelect"
      />
      <img v-if="thumbnail"
           :src="thumbnail"
           class="preview mb-4 mt-4"
           alt="image du produit"
      />

      <LabelAndInputText v-model:property="form.path"
                         label="Route"
                         inputId="path"
                         required
                         placeholder="/peluches"
                         class="w-full mt-4"
                         :propertyRules="v$.path"
                         errorMessage="Route invalide"/>
      <div class="flex items-center gap-2 mt-4 ">
        <Checkbox v-model="form.isActual" binary id="actual"/>
        <label for="actual">Page d'accueil actuelle</label>
      </div>
      <Button label="Envoyer"
              class="mt-4"
              @click="send"
              :disabled="thumbnail === undefined"/>
    </div>

  </div>


</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { ADMIN_DASHBORD_ROUTE, ADMIN_HOME_ROUTE } from '@/router/routes-name.ts';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { getImageName, getMimeType, urlToFile } from '@/functions/images.ts';
import type { HomeConfigDto } from '@/interfaces/home-config.dto.ts';

const imageFile = ref<File>();
const placeholder = computed(() => imageFile.value ? imageFile.value.name : 'Sélectionner une image');
const toast = useToast();
const router = useRouter();
const route = useRoute();

const selectedHomeConfig = ref<HomeConfigDto>();

const activeInput = () => {
  const input = document.getElementById(`uploadImage`) as HTMLInputElement;
  if (input) {
    input.click();
  }
};

const form = reactive({
  checked: false,
  isActual: false,
  path: '',
});

const thumbnail = ref();

const rules = computed(() => ({
  path: { required, minLength: minLength(4) },

}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

onMounted(async () => {
      if (route.query && route.query.id) {
        await apiGet(`${api(env.homePage.adminGet)}?id=${route.query.id}`, 'GET', true)
            .then(response => response.json())
            .then(async (data: HomeConfigDto) => {
              form.path = data.path;
              form.isActual = data.isActual;
              const image = await urlToFile(data.imageUrl, getImageName(data.imageUrl), getMimeType(data.imageUrl));
              createThumbnail(image);
              selectedHomeConfig.value = data;
            })
            .catch(e => {
              toast.add({
                severity: 'error',
                summary: e,
                life: 3000
              });
            });
      }
    }
);

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  imageFile.value = target.files[0];
  createThumbnail(imageFile.value);
};


const createThumbnail = (file: File) => {
  thumbnail.value = URL.createObjectURL(file);
};

const send = async () => {
  console.warn(form);
  const formData = new FormData();

  if (thumbnail.value && !v$.value.$invalid) {

    if (imageFile.value) {
      formData.append('images', imageFile.value);
      if (selectedHomeConfig.value) {
        formData.append('imageUrl', selectedHomeConfig.value.imageUrl);
      }
    }

    if (selectedHomeConfig.value) {
      formData.append('id', selectedHomeConfig.value.id.toString());
    }

    formData.append('path', form.path);
    formData.append('checked', form.checked.toString());
    formData.append('isActual', form.isActual.toString());

    const method: 'PATCH' | 'POST' = selectedHomeConfig.value ? 'PATCH' : 'POST';

    apiPost(api(env.homePage.crud), method, formData, false, true)
        .then(() => {
          toast.add({ severity: 'success', summary: 'Modification enregistrée', life: 3000 });
          router.push({ name: ADMIN_HOME_ROUTE });
        })
        .catch(e => {
          toast.add({
            severity: 'error',
            summary: e,
            life: 3000
          });
        });
  }

};
</script>

<style scoped>
.preview {
  width: 400px;
}
</style>