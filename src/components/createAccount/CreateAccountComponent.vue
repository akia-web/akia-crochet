<template>
  <div class="flex justify-center min-h-[80vh] pb-[20px] shadow-lg bg-white border border-[var(--action-color)] rounded">
    <form @submit.prevent="handleSubmit"
          class="flex flex-col gap-4  w-full sm:w-[70%] p-[20px] ">
      <h1 class="mt-8 mb-8 text-center">Formulaire d'inscription</h1>
      <div class="flex flex-col gap-1">
        <label for="lastName" class="text-xs">Nom</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText
              id="lastName"
              v-model="form.lastName"
              placeholder="Nom"
              @blur="inputNotNull('lastName')"/>

        </InputGroup>
        <Message
            v-if="errors.lastName"
            severity="error"
            size="small">
          {{ errors.lastName }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="firstName" class="text-xs">Prenom</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText
              id="firstName"
              v-model="form.firstName"
              placeholder="Prénom"
              @blur="inputNotNull('firstName')"/>

        </InputGroup>
        <Message
            v-if="errors.firstName"
            severity="error"
            size="small">
          {{ errors.firstName }}
        </Message>
      </div>


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

      <div class="flex flex-col gap-1">
        <label for="pwd" class="text-xs">Mot de passe</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-lock"></i>
          </InputGroupAddon>
          <Password
              input-id="pwd"
              v-model="form.password"
              placeholder="Mot de passe"
              weakLabel="Faible"
              mediumLabel="Moyen"
              strongLabel="Fort"
              prompt-label="Saisissez un mot de passe"
              :strong-regex="PASSWORD_STRONG_REGEX"
              toggleMask
              fluid
              @blur="validatePassword"/>
        </InputGroup>

        <Message
            v-if="errors.password"
            severity="error"
            size="small">
          {{ errors.password }}
        </Message>
      </div>


      <div class="flex flex-col gap-1">
        <label for="pwd2" class="text-xs">Confirmer le mot de passe</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-lock"></i>
          </InputGroupAddon>
          <Password
              input-id="pwd2"
              v-model="form.passwordConfirm"
              placeholder="Mot de passe"
              toggleMask
              :feedback="false"
              fluid
              @blur="samePassword"/>
        </InputGroup>

        <Message
            v-if="errors.passwordConfirm"
            severity="error"
            size="small">
          {{ errors.passwordConfirm }}
        </Message>
      </div>

      <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>

      <Button
          class="mt-8"
          type="submit"
          label="Créer le compte"
          :disabled="!isFormValid"
      />
    </form>
    <DynamicDialog/>
  </div>

</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import {
  checkInputIsNotNull,
  checkPasswordSame,
  checkValidateEmail,
  checkValidatePassword,
  PASSWORD_STRONG_REGEX
} from '@/functions/check-forms.ts';
import type { CreateAccountDto } from '@/interfaces/create-account.dto.ts';
import { apiPost } from '@/services/request-service.ts';
import { CONNEXION_ROUTE } from '@/router/routes-name.ts';
import { useDialog } from 'primevue';
import DialogModal from '@/components/dialog-modal/dialog-modal.vue';
import { useRouter } from 'vue-router';

const dialog = useDialog();
const toast = useToast();
const router = useRouter();

const form = reactive<CreateAccountDto>({
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
  checked: false
});

const errors = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
});


const validateEmail = () => {
  errors.email = checkValidateEmail(form.email);
};

const validatePassword = () => {
  errors.password = checkValidatePassword(form.password);

};

const samePassword = () => {
  errors.passwordConfirm = checkPasswordSame(form.password, form.passwordConfirm);
};

const inputNotNull = (type: 'firstName' | 'lastName') => {
  if (type === 'lastName') {
    errors.lastName = checkInputIsNotNull(form.lastName) ? '' : 'Vous devez remplir le champs';
  } else {
    errors.firstName = checkInputIsNotNull(form.firstName) ? '' : 'Vous devez remplir le champs';
  }


};

const isFormValid = computed(() => {
  return checkValidateEmail(form.email) === '' && checkValidatePassword(form.password) === '' && checkPasswordSame(form.password, form.passwordConfirm) === '';
});

const handleSubmit = () => {
  validateEmail();
  validatePassword();
  samePassword();
  inputNotNull('firstName');
  inputNotNull('lastName');

  if (isFormValid.value) {
    apiPost(api(env.auth.createAccount), 'POST', form).then(() => {
      toast.add({ severity: 'success', summary: 'Compte créer', life: 3000 });
      dialog.open(DialogModal, {
        props: {
          header: 'Inscription réussi',
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
          toast.add({ severity: 'error', summary: e.message, life: 3000 });
        }
    );
  }
};

</script>