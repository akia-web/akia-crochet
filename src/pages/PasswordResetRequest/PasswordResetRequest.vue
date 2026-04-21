<template>
  <div class="min-h-[80vh] pb-[20px] shadow-lg bg-white border border-[var(--action-color)] rounded md:w-1/2 mx-auto">
    <h1 class="text-center mt-8">Demande de réinitialisation de mot de passe</h1>
    <div class="flex justify-center">
      <div v-if="!viewNext" class="sm:w-[70%] p-[20px]">
        <p class="mt-8">Pour réinitialiser votre mot de passe, merci de renseigner l'adresse e-mail du compte concerné.</p>
        <p>Un email avec les instructions vous sera ensuite envoyé.</p>
        <form @submit.prevent="handleSubmit"
              class="flex flex-col gap-4 w-full mt-4"
        >
          <LabelAndInputText v-model:property="form.email"
                             label="Email"
                             required
                             :propertyRules="v$.email"
                             errorMessage="Email incorrect"/>
          <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
          <Button label="Envoyer la demande"
                  type="submit"
                  :disabled="v$.$invalid"/>
        </form>
      </div>

      <div v-else
           class="flex p-[20px] flex-col items-center">
        <img class=" mt-[100px] w-[200px]"
             src="@/assets/icones/QuokkaMail.png"
             alt="Quokka qui tient une enveloppe">
        <div>
          <p class="mt-8">Rendez-vous dans votre boite e-mail.</p>
          <p>Un courriel vous a été envoyé.</p>
          <p>Suivez les instructions pour réinitialiser votre mot de passe !</p>
        </div>

      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { computed, reactive, ref } from 'vue';
import { email, required } from '@vuelidate/validators';

import { useVuelidate } from '@vuelidate/core';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const form = reactive({
  email: '',
  checked: false,
});

const viewNext = ref<boolean>(false);

const rules = computed(() => ({
  email: { required, email }
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });


const handleSubmit = () => {
  apiPost(api(env.auth.passwordResetRequest), 'POST', form,)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: `${`La demande a été prise en compte`}`,
          life: 3000
        });
        viewNext.value = true;
      })
      .catch(e => toast.add({
        severity: 'error',
        summary: e.message,
        life: 3000
      }));
};

</script>