<template>
  <div class="w-full bg-white p-[10px] rounded-lg">

    <div class="flex flex-wrap flex-col lg:flex-row justify-between">
      <div class="lg:w-[48%]">
        <h2 class="text-xl mt-8 text-center font-bold mb-12">Mes dernières réalisations</h2>
        <div class="flex w-full flex-col justify-center align-center mt-6 ">
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
      </div>


      <div class="hidden lg:block">
        <Divider  layout="vertical" type="dashed"></Divider>
      </div>
      <div class="block lg:hidden mt-6">
        <Divider layout="horizontal" type="dashed"></Divider>
      </div>

      <div class="flex lg:w-[48%] justify-center items-center  gap-4">
        <div class="mt-8 border border-actionColor p-[10px] lg:p-[30px] bg-actionColor">
          <div class="border border-dashed p-[10px] lg:p-[30px] rounded-lg bg-white">
            <h2 class="text-xl font-semibold text-actionColor">S'inscrire à la newsletter</h2>
            <p class="mt-4">S’inscrire à notre newsletter vous permet de rester informé(e) en avant-première de toutes nos nouveautés.
              <br>
              Vous recevez directement dans votre boîte mail les dernières actualités et mises à jour. <br>
              C’est le moyen le plus simple de ne rien manquer de nos offres et de nos lancements. <br>
              Vous profitez également d’informations exclusives réservées à nos abonnés. <br>
              En vous inscrivant, vous êtes sûr(e) de toujours recevoir les nouveautés dès leur sortie.</p>
            <form class="lg:w-[50%] mt-8">
              <LabelAndInputText v-model:property="form.email"
                                 label="E-mail"
                                 inputId="email"
                                 required
                                 :propertyRules="v$.email"
                                 errorMessage="Invalide"/>
              <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
              <Button @click="saveInscription"
                      :disabled="v$.$invalid"
                      class="mt-4 p-button-white-border-action-color">
                <p>S'inscrire</p>
                <img src="@/assets/icones/QuokkaMail.png" class="w-[50px]" alt="">

              </Button>
            </form>
          </div>

        </div>


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