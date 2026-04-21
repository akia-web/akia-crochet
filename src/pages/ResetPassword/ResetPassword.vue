<template>
  <div class="flex justify-center">
    <div class="bg-white flex flex-col w-[98%] lg:w-[60%] justify-center p-[20px]">
      <div v-if="loading">
        <Loader />
      </div>
      <div v-else>
        <div v-if="(!tokenIsValid && requestToVerifyCodeDone) || !requestToVerifyCodeDone || !hasToken"
             class="flex flex-col items-center">
          <img src="@/assets/icones/quokka-triste.png"
               alt="quokka triste"
               class="w-[200px] mx-auto mt-4">
          <p class="mt-8 text-center">Oh non ! le lien pour changer ton mot de passe a expiré !</p>
          <Button label="Je re-génère un nouveau lien pour changer mon mot de passe"
                  class="mt-8"
                  @click="goTo('reset-request')"></Button>
        </div>
        <div v-if="requestToVerifyCodeDone && tokenIsValid && !finalTemplate"
             class="w-full">
          <form>
            <h1 class="text-center mt-8">Réinitialisation du mot de passe</h1>
            <p class="mt-8">Remplissez les champs suivant pour réinitialiser votre mot de passe. <br>
              Un e-mail de confirmation vous seras envoyé par la suite.</p>
            <LabelAndInputPasswordWithIcon v-model:property="form.password"
                                           label="Mot de passe"
                                           required
                                           inputId="password"
                                           class="mt-8"
                                           :propertyRules="v$?.password"
                                           :feedback="true"
                                           errorMessage="Format invalide"
            />

            <LabelAndInputPasswordWithIcon v-model:property="form.confirmPassword"
                                           label="Confirmation mot de passe"
                                           required
                                           inputId="confirmPassword"
                                           :propertyRules="v$?.confirmPassword"
                                           class="mt-8"
                                           :feedback="false"
                                           errorMessage="Pas le même mot de passe"
            />

            <Button label="Valider"
                    class="mt-8 text-center"
                    @click="resetPassword"
                    :disabled="v$.$invalid"/>
          </form>
        </div>

        <div v-if="finalTemplate"
             class="flex flex-col items-center">
          <img src="@/assets/icones/QuokkaOk.png"
               alt="quokka triste"
               class="w-[200px] mx-auto mt-4">
          <p class="mt-8 text-center">Votre mot de passe a bien été réinitialisé ! <br></p>
          <Button label="Me connecter"
                  @click="goTo('connexion')"
                  class="mt-8"></Button>
        </div>
      </div>
    </div>

  </div>


</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { type LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';
import type { ResetPasswordDto } from '@/pages/ResetPassword/reset-password.dto.ts';
import LabelAndInputPasswordWithIcon from '@/components/FormComponents/LabelAndInputPasswordWithIcon.vue';
import { required } from '@vuelidate/validators';
import { samePassword } from '@/validators/same-password.ts';
import { useVuelidate } from '@vuelidate/core';
import { strongPassword } from '@/validators/regex-validator.ts';
import { CONNEXION_ROUTE, PASSWORD_RESET_REQUEST_NAME } from '@/router/routes-name.ts';
import Loader from '@/components/Loader/Loader.vue';


const hasToken = ref<boolean>(false);
const toast = useToast();
const route = useRoute();
const token = ref<LocationQueryValue | LocationQueryValue[]>();
const tokenIsValid = ref<boolean>(false);
const requestToVerifyCodeDone = ref<boolean>(false);
const finalTemplate = ref<boolean>(false);
const loading = ref(true);

const router = useRouter();

const form = reactive<ResetPasswordDto>({
  password: '',
  confirmPassword: '',
  checked: false,
  token: ''
});

const rules = computed(() => ({
  password: { required, strongPassword },
  confirmPassword: {
    required, samePassword: samePassword(
        () => form.password
    ),
  },
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });
onMounted(() => {

  token.value = route.query.token;
  hasToken.value = !!route.query.token;

  if (token.value) {
    form.token = token.value;
    apiPost(api(env.auth.resetPasswordCodeIsValid), 'POST', { token: token.value }, false, false)
        .then(() => {
          tokenIsValid.value = true;
        })
        .catch(e => toast.add({
          severity: 'error',
          summary: e.message,
          life: 3000
        })).finally(() => {
      requestToVerifyCodeDone.value = true;
      loading.value = false;
    });
  }
});

const resetPassword = () => {
  apiPost(api(env.auth.resetPasswordForNotLoggedAccount), 'POST', form, false, false)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: `Mot de passe réinitialisé`,
          life: 3000
        });
        finalTemplate.value = true;
      })
      .catch(e => toast.add({
        severity: 'error',
        summary: e.message,
        life: 3000
      }));
};

const goTo = (path: 'reset-request' | 'connexion') => {
  router.push({ name: path === 'connexion' ? CONNEXION_ROUTE : PASSWORD_RESET_REQUEST_NAME });
};
</script>

