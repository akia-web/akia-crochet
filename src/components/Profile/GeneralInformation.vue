<template>
  <div>
    <h1 class="mt-4">Profile</h1>

    <form class="mb-4 mt-4 flex items-center gap-4"
          v-if="!isGoogleClient">
      <LabelAndInputText v-model:property="form.email"
                         label="E-mail"
                         inputId="email"
                         required
                         :propertyRules="v$.email"
                         errorMessage="Invalide"
      ></LabelAndInputText>

      <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>

      <Button icon="pi pi-save"
              rounded
              class="mt-5"
              @click="updateEmail"
              :disabled="v$.email.$invalid"/>
    </form>

    <div class="flex flex-col gap-4">
      <Button label="Changer de mot de passe" v-if="!isGoogleClient"></Button>

      <Button label="Se deconnecter"
              @click="disconnect"></Button>
    </div>
    <DynamicDialog/>
  </div>
</template>


<script lang="ts" setup>
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useUserStore } from '@/stores/user.ts';
import { useRouter } from 'vue-router';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { computed, onMounted, reactive } from 'vue';
import type { CheckoutFormDto } from '@/components/paymentFormsComponents/interfaces/checkoutForm.dto.ts';
import { email, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { apiPost } from '@/services/request-service.ts';
import { ADMIN_DASHBORD_ROUTE, CONNEXION_ROUTE } from '@/router/routes-name.ts';
import { useToast } from 'primevue/usetoast';
import DialogModal from '@/components/dialog-modal/dialog-modal.vue';
import { useDialog } from 'primevue';

const useUser = useUserStore();
const router = useRouter();
const toast = useToast();
const dialog = useDialog();

const isGoogleClient = computed(() => {

  return !!(useUser && useUser.user && useUser.user.googleId);
});

const form = reactive<{ email: string, checked: boolean }>({
  email: '',
  checked: false
});

const rules = computed(() => ({
  email: { required, email },
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

onMounted(() => {
  if (useUser && useUser.user) {
    form.email = useUser.user.email;
  } else {
    form.email = '';
  }
});

const disconnect = async () => {
  await fetch(
      api(env.auth.revoque),
      {
        method: 'GET',
        credentials: 'include',
      }
  ).then(() => {
    useUser.updateUser(null);
    localStorage.removeItem(import.meta.env.VITE_AUTH_STORAGE);
    router.push('/');
  });
};


const updateEmail = () => {
  apiPost(api(env.auth.updateEmail), 'PATCH', form, true, true).then((data: any) => {
    useUser.updateUser(null);
    toast.add({ severity: 'success', summary: 'E-mail modifié' });
    dialog.open(DialogModal, {
      props: {
        header: 'E-mail modifié',
        modal: true
      },
      data: {
        message: `<p>N'oubliez pas de valider votre mail avant de vous re-connecter</p>`
      },
      onClose() {
        router.push({ name: CONNEXION_ROUTE });
      },
    });
  }).catch(e => {
        toast.add({ severity: 'error', summary: e.message, life: 3000 });
      }
  );
};

</script>