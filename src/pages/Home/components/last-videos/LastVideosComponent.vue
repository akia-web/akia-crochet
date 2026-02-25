<template>
  <div class="w-full bg-white p-[10px] rounded-lg">
    <h2 class="text-xl mt-8 text-center font-bold mb-12">Mes dernières réalisations</h2>

    <div class="flex flex-wrap">
      <div class="flex w-[50%] flex-col justify-center align-center mt-6 ">
        <div class="flex m-0-auto justify-center gap-1 max-w-[100%]">
          <div v-for="(video, index) in videos" class="crop">
            <img :src="video.picture"
                 alt=""
                 @click="selectedVideo = video.url; selectedVideoName= video.picture"
                 :class="[selectedVideoName === video.picture? 'grayscale-0': 'grayscale',
                        'hover:grayscale-0',
                        'transition-transform',
                        'duration-300',
                        'ease-in-out',
                        'hover:scale-110',
                        'hover:brightness-110',
                        'cursor-pointer'
                        ]"
            >
          </div>
        </div>

        <iframe :src="selectedVideo" class="youtube-video mt-2 max-w-[100%]"/>
      </div>
      <Divider layout="vertical" type="dashed"></Divider>
      <div class="flex flex-col w-[48%] items-center  gap-4">
        <h3 class="text-xl ">S'inscrire à la newsletter</h3>
        <p>pour être prévenu des nouveautés</p>
        <form class="w-[50%] mt-8">
          <LabelAndInputText v-model:property="form.email"
                             label="E-mail"
                             inputId="email"
                             required
                             :propertyRules="v$.email"
                             errorMessage="Invalide"/>
          <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
          <Button label="S'inscrire"
                  @click="saveInscription"
                  :disabled="v$.$invalid"
                  class="mt-4"/>
        </form>

      </div>
    </div>


  </div>

</template>

<script setup lang="ts">
import { useToast } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { email, minLength, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { ADMIN_HOME_ROUTE } from '@/router/routes-name.ts';

const toast = useToast();
const videos = ref<any>([]);
const selectedVideo = ref<string>('');
const selectedVideoName = ref<string>('');

const form = reactive({
  email: '',
  checked: false,
});

const rules = computed(() => ({
  email: { required, email },

}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });


onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');

  if (status === 'error') {
    toast.add({
      severity: 'error',
      summary: 'Connexion',
      detail: `Une erreur s'est produite lors de la connexion`,
      life: 3000
    });
  }
  const url = `${import.meta.env.VITE_BASE_URL_BACK}videos`;
  await apiGet(url, 'GET')
      .then(response => response.json())
      .then(data => {
        videos.value = data;
        selectedVideo.value = data[0].url;
        selectedVideoName.value = data[0].picture;
      });
});


const saveInscription = async () => {
  if (!v$.value.$invalid) {

    apiPost(api(env.newsletter.crud), 'POST', form, false, false)
        .then(() => {
          toast.add({ severity: 'success', summary: 'Inscription newsletter validée', life: 3000 });
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
</script>

<style scoped src="./style.css"></style>