<template>
  <div>
    <h1 class="mt-4">Profile</h1>

    <form class="mb-4 mt-4 flex items-center gap-4">

      <div class="flex gap-4 justify-start">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <LabelAndInputText v-model:property="form.firstName"
                               label="Prénom"
                               inputId="fistName"
                               required
                               :propertyRules="v$.firstName"
                               errorMessage="Invalide"
            />

            <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
          </div>

          <div class="flex flex-col">
            <LabelAndInputText v-model:property="form.lastName"
                               label="Nom"
                               inputId="nom"
                               required
                               :propertyRules="v$.lastName"
                               errorMessage="Invalide"
            />

            <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
          </div>

          <div class="flex flex-col">
            <LabelAndInputText v-model:property="form.email"
                               label="E-mail"
                               inputId="email"
                               required
                               :readonly="isGoogleClient"
                               class="w-full md:w-[500px]"
                               :propertyRules="v$.email"
                               errorMessage="Invalide"
            />

            <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
          </div>

        </div>
      </div>
    </form>

    <div class="flex flex-col gap-4  w-[300px] mt-12">
      <Button icon="pi pi-save"
              rounded
              @click="updateEmail"
              label="Sauvegarder"

              :disabled="v$.$invalid"/>
      <hr class="mt-5 border-actionColor mb-5" />
      <Button label="Changer de mot de passe"
              icon="pi pi-key"
              v-if="!isGoogleClient"
              class="p-button-white"
              @click="updatePassword"
      />

      <Button label="Se deconnecter"
              icon="pi pi-power-off"
              @click="disconnect"/>
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
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { apiPost } from '@/services/request-service.ts';
import { CONNEXION_ROUTE } from '@/router/routes-name.ts';
import { useToast } from 'primevue/usetoast';
import DialogModal from '@/components/dialog-modal/dialog-modal.vue';
import { useDialog } from 'primevue';
import type { UserDto } from '@/interfaces/user.dto.ts';
import PasswordPopupComponent from '@/components/Profile/generalInformations/PasswordPopupComponent.vue';

const useUser = useUserStore();
const router = useRouter();
const toast = useToast();
const dialog = useDialog();
const oldEmail = ref('');

const isGoogleClient = computed(() => {

  return !!(useUser && useUser.user && useUser.user.googleId);
});

const form = reactive<{ email: string, firstName: string, lastName: string, checked: boolean }>({
  email: '',
  firstName: '',
  lastName: '',
  checked: false
});

const rules = computed(() => ({
  email: { required, email },
  firstName: { required, minLength: minLength(1) },
  lastName: { required, minLength: minLength(1) },
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

onMounted(() => {
  if (useUser && useUser.user) {
    form.email = useUser.user.email;
    form.firstName = useUser.user.firstName;
    form.lastName = useUser.user.lastName;
    oldEmail.value = useUser.user.email;
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


const updateEmail = async () => {
  await apiPost(api(env.auth.updateProfile), 'PATCH', form, true, true).then((data: UserDto) => {
    if (data.email !== oldEmail.value) {
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
    } else {
      toast.add({ severity: 'success', summary: 'Profile sauvegardé', life: 3000 });
    }

  }).catch(e => {
        toast.add({ severity: 'error', summary: e.message, life: 3000 });
      }
  );
};

const updatePassword = async () => {
  dialog.open(PasswordPopupComponent, {
    props: {
      header: 'Changer le mot de passe',
      modal: true
    },
  });
}

</script>