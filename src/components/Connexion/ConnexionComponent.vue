<template>
  <div class="min-h-[80vh] pb-[20px] shadow-lg bg-white border border-[var(--action-color)] rounded">
    <div class="flex justify-center">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full sm:w-[70%] p-[20px]">
        <h1 class="mt-8 mb-8 text-center">Formulaire de connexion</h1>
        <div class="flex flex-col gap-1 text-sm">
          <label for="email">Email</label>
          <InputText
              id="email"
              v-model="form.email"
              placeholder="Email"
              @blur="validateEmail"/>
          <Message
              v-if="errors.email"
              severity="error"
              size="small">
            {{ errors.email }}
          </Message>
        </div>

        <div class="flex flex-col gap-1 text-sm">
          <label for="pwd">Mot de passe</label>
          <Password
              inputId="pwd"
              v-model="form.password"
              placeholder="Mot de passe"
              :feedback="false"
              toggleMask
              fluid
              @blur="validatePassword"/>
          <Message
              v-if="errors.password"
              severity="error"
              size="small">
            {{ errors.password }}
          </Message>
        </div>

        <p class="text-[var(--action-color)] underline text-right">Mot de passe oublié ?</p>
        <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>

        <Button
            type="submit"
            label="Se connecter"
            :disabled="!isFormValid"
        />
      </form>
    </div>
    <div class="flex flex-col w-full justify-center items-center">
      <div class="sm:w-[70%]">
        <Divider align="center" type="solid" class="mt-16 mb-16 w-full divider-connexion">
          <p class="text-[var(--action-color)]">OU</p>
        </Divider>
      </div>

      <Button
          label="Se connecter avec Google"
          class="mr-1 p-button-bg-site sm:w-[70%]"
          rounded
          icon="pi pi-google"
          v-if="!storeUser.user"
          @click="loginWithGoogle"
      />
      <RouterLink to="/inscription"
                  class="text-decoration-none font-spartan">
        <p class="text-[var(--action-color)] underline text-center mt-8">Créer un compte</p>
      </RouterLink>
      <DynamicDialog/>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { apiPost } from '@/services/request-service.ts';
import { useDialog } from 'primevue';
import { useRouter } from 'vue-router';
import { ADMIN_DASHBORD_ROUTE } from '@/router/routes-name.ts';


const storeUser = useUserStore();
const toast = useToast();
const dialog = useDialog();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
  checked: false,
});

const errors = reactive({
  email: '',
  password: ''
});

const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const validateEmail = () => {
  if (!form.email) errors.email = 'Veuillez saisir votre email';
  else if (!emailRegex.test(form.email)) errors.email = 'Email invalide';
  else errors.email = '';
};

const validatePassword = () => {
  if (!form.password) errors.password = 'Veuillez saisir le mot de passe';
  else errors.password = '';
};

const isFormValid = computed(() => {
  return emailRegex.test(form.email) && form.password.length > 0;
});

const handleSubmit = () => {
  validateEmail();
  validatePassword();

  if (isFormValid.value) {
    apiPost(api(env.auth.login), 'POST', form, true).then((data: any) => {
      if (data.user.role === 'ADMIN') {
        router.push({ name: ADMIN_DASHBORD_ROUTE });
      }else{
        router.push('/')
      }

    }).catch(e => {
          if (e.message === 'E-mail déjà validé') {
            toast.add({ severity: 'warn', summary: e.message, life: 3000 });
          } else {
            toast.add({ severity: 'error', summary: e.message, life: 3000 });
          }

        }
    );
  }
};

const loginWithGoogle = async () => {
  window.location.href = api(env.auth.google);
};
</script>