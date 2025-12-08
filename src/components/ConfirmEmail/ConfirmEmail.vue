<template>
  <Loader v-if="loaded"></Loader>
  <div v-if="!loaded && !tokenIsValid && !tokenAlreadyValidate"
       class="bg-white p-[20px]">
    <h1 class="text-center">Oups votre compte ne peux pas être validé...</h1>
    <p class="mt-8 text-center">Ce lien a expiré !</p>
    <p class="text-center">Renseignez à nouveau votre e-mail pour regénérer un lien.</p>
    <p class="text-center text-xs">Il sera valable durant 15 minutes.</p>
    <div class="flex justify-center mt-16">
      <form @submit.prevent="handleSubmit"
            class="flex flex-col gap-4  w-full md:w-1/2">

        <div class="flex flex-col gap-1">
          <label for="email" class="text-xs">Email</label>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-at"></i>
            </InputGroupAddon>
            <InputText
                id="email"
                v-model="form.email"
                placeholder="Email"
                @blur="validateEmail"/>

          </InputGroup>
          <Message
              v-if="errors.email"
              severity="error"
              size="small">
            {{ errors.email }}
          </Message>
        </div>

        <Button
            class="mt-4"
            type="submit"
            label="Renvoyer le lien de confirmation"
            :disabled="!isFormValid"
        />
        <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>

      </form>
    </div>
    <DynamicDialog/>
  </div>

  <div v-if="!loaded && tokenIsValid && !tokenAlreadyValidate"
       class="bg-white p-[20px] flex flex-col align-center">
    <h1 class="text-center">Ton e-mail a été validé !</h1>
    <p class="text-center mt-8">Merci d'avoir validé ton e-mail ! <br> <br>
      Explorez, découvrez et succombez à la douceur de nos peluches.</p>
    <RouterLink :to="{ name: 'connexion' }"
                class="mt-8">
      <Button label="Se connecter"/>
    </RouterLink>
  </div>

  <div v-if="tokenAlreadyValidate"
       class="bg-white p-[20px] flex flex-col align-center">
    <h1 class="text-center">Ton e-mail est déjà validé !</h1>
    <p class="text-center mt-8">Tu peux maintenant <br> <br>
      Explorer, découvrir et succomber à la douceur de nos peluches.</p>
    <RouterLink :to="{ name: 'connexion' }"
                class="mt-8">
      <Button label="Se connecter"/>
    </RouterLink>
  </div>

</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';
import { api } from '@/functions/api.ts';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { env } from '@/environnement.ts';
import { useDialog, useToast } from 'primevue';
import Loader from '@/components/Loader/Loader.vue';
import type { UserDto } from '@/interfaces/user.dto.ts';
import { checkValidateEmail } from '@/functions/check-forms.ts';
import DialogModal from '@/components/dialog-modal/dialog-modal.vue';
import { CONNEXION_ROUTE } from '@/router/routes-name.ts';

const route = useRoute();
const token = route.query.token;
const toast = useToast();
const loaded = ref<boolean>(true);
const tokenIsValid = ref<boolean>(false);
const tokenAlreadyValidate = ref<boolean>(false);
const dialog = useDialog();
const router = useRouter();

onMounted(() => {

  apiGet(api(`${env.auth.confirmEmail}?token=${token}`), 'GET').then(response => response.json())
      .then((data: UserDto) => {
        toast.add({
          severity: 'success',
          summary: 'Validation de votre compte',
          detail: `Votre compte a bien été validé`,
          life: 3000
        });
        tokenIsValid.value = true;
      })
      .catch((e) => {
        if (e.message === 'E-mail déjà validé') {
          toast.add({ severity: 'warn', summary: e.message, life: 3000 });
          tokenAlreadyValidate.value = true;
        } else {
          toast.add({ severity: 'error', summary: e.message, life: 3000 });
        }

      })
      .finally(() => loaded.value = false);
});

const form = reactive<{ email: string, checked: boolean }>({
  email: '',
  checked: false
});

const errors = reactive({
  email: '',
});

const validateEmail = () => {
  errors.email = checkValidateEmail(form.email);
};

const isFormValid = computed(() => {
  return checkValidateEmail(form.email) === '';
});


const handleSubmit = () => {
  validateEmail();
  if (isFormValid.value) {
    apiPost(api(env.auth.resendConfirmEmail), 'POST', form).then(() => {
      dialog.open(DialogModal, {
        props: {
          header: 'E-mail envoyé',
          modal: true
        },
        data: {
          message: `<p>N'oubliez pas de valider votre mail avant de vous connecter</p>`
        },
        onClose() {
          router.push({ name: CONNEXION_ROUTE });
        },
      });
    }).catch(e => {
          if (e.message === 'E-mail déjà validé') {
            toast.add({ severity: 'warn', summary: e.message, life: 3000 });
            tokenAlreadyValidate.value = true;
          } else {
            toast.add({ severity: 'error', summary: e.message, life: 3000 });
          }

        }
    );
  }

};
</script>