<template>
  <div class="flex justify-center">
    <div class="bg-white p-[40px] w-full mb-4 lg:w-[60%]">
      <h1 class="text-center mt-8">Votre retour d'expérience</h1>
      <div v-if="!loading">

        <div v-if="step==='step1'">
          <p class="text-center mt-8">{{ userName }}, comment s'est passé votre commande sur Akialoops ?</p>

          <div class="flex justify-center gap-10 mt-8">
            <div class="flex flex-col">
              <p class="text-center">Bien</p>
              <Button rounded class="p-button-white-border-action-color w-[150px] h-[150px]"
                      @click="setIsGood(true)">
                <img src="@/assets/icones/quokkaWaw.png" alt="quokka heureux">
              </Button>
            </div>

            <div class="flex flex-col">
              <p class="text-center">Pas bien</p>
              <Button rounded
                      class="p-button-white-border-action-color w-[150px] h-[150px]"
                      @click="setIsGood(false)">
                <img src="@/assets/icones/quokka-triste.png" alt="quokka triste">
              </Button>
            </div>
          </div>

        </div>
        <div v-if="step==='step2'">
          <div class="flex justify-center flex-col items-center w-full">
            <p class="mt-8">Votre colis contenait : </p>
            <div class="mt-8 flex gap-5 flex-wrap">
              <div v-for="product in productsList" :key="product.image">
                <div class="relative w-[70px] ">
                  <img :src="product.image"
                       alt=""
                       class="w-[70px] h-[70px] object-cover"/>

                  <div class="absolute -top-1 -right-2 min-w-[25px] min-h-[25px]
            px-1 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center border border-white">
                    <p>{{ product.quantity }}</p>
                  </div>
                </div>
              </div>
            </div>


            <div class=" mt-8 flex gap-5">
              <p>Note : </p>
              <Rating v-model="form.note">
                <template #onicon>
                  <span class="pi pi-star-fill "/>
                </template>
                <template #officon>
                  <span class="pi pi-star "/>
                </template>
              </Rating>
            </div>


            <Editor
                v-model="form.comment"
                :modules="modules"
                :formats="formats"
                class="admin-editor w-full h-[350px] mt-8 mb-8"
                @blur="v$!.description?.$touch()"
            />

            <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>

            <Button label="Envoyer mon avis" class="mt-8" :disabled="v$.$invalid" @click="send"></Button>

          </div>
        </div>
        <div v-if="step==='step3'">
          <p class="text-center mt-8">Merci d'avoir laisser votre avis !</p>
          <div class="mt-8">
            <RouterLink to="/" class="text-actionColor"><p>Retour à la page d'accueil</p></RouterLink>
          </div>
        </div>
      </div>
      <div v-else>
        <Loader/>
      </div>


    </div>
  </div>


</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { minLength, minValue, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';
import Loader from '@/components/Loader/Loader.vue';

const route = useRoute();
const router = useRouter();
const step = ref<'step0' | 'step1' | 'step2' | 'step3'>('step0');
const toast = useToast();
const loading = ref(true);
const userName = ref<string>();
const productsList = ref<{ quantity: number; image: string }[]>([]);

const modules = {
  toolbar: [
    ['clean']
  ]
};

const formats = [
  'color'
];

const form = reactive({
  isGood: false,
  note: 0,
  comment: '',
  token: '',
  checked: false,
});

const rules = computed(() => ({
  note: { required, minValue: minValue(1) },
  isGood: { required },
  comment: { required, minLength: minLength(8) },
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

onMounted(async () => {
  if (route.query && route.query.token) {
    await apiGet(`${api(env.notice.canNotice)}?token=${route.query.token}`, 'GET').then(response => response.json())
        .then((data: { message: string; name: string; products: { image: string; quantity: number }[] }) => {
          productsList.value = data.products;
          userName.value = data.name.charAt(0).toUpperCase() + data.name.slice(1);

          step.value = 'step1';
          form.token = route.query.token as string;
        }).catch(e => {
          toast.add({
            severity: 'error',
            summary: e.message,
            life: 7000
          });
          router.push({ name: 'home' });
        }).finally(() => {loading.value = false;});
  } else {
    await router.push({ name: 'home' });
  }
});

const setIsGood = (value: boolean) => {
  form.isGood = value;
  if (!value) {
    sendForm();
  } else {
    step.value = 'step2';
  }
};

const send = () => {
  if (!v$.value.$invalid) {
    sendForm();
  }
};

const sendForm = async () => {
  await apiPost(api(env.notice.crud), 'POST', form, false, false).then(() => {
    toast.add({
      severity: 'success',
      summary: `Avis envoyé`,
      life: 3000
    });
    step.value = 'step3';
  })
      .catch(e => toast.add({
        severity: 'error',
        summary: e.message,
        life: 3000
      }));
};

</script>
