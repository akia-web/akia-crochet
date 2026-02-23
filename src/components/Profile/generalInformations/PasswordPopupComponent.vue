<template>
  <form v-if="!loading">
    <div class="flex flex-col gap-1">
      <div class="flex gap-2">
        <label for="pwd" class="text-xs">Ancien mot de passe</label>
        <p v-if="v$.oldPassword.$error"
           class="text-actionColor text-xs font-bold">
          Invalide
        </p>
      </div>

      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock"></i>
        </InputGroupAddon>
        <Password
            input-id="pwd"
            v-model="form.oldPassword"
            placeholder="Ancien mot de passe"
            prompt-label="Saisissez un mot de passe"
            toggleMask
            :feedback="false"
            @blur="v$?.oldPassword.$touch()"
            fluid/>
      </InputGroup>
    </div>
    <div class="flex flex-col gap-1 mt-4">
      <div class="flex gap-2">
        <label for="pwd" class="text-xs">Mot de passe</label>
        <p v-if="v$.password.$error"
           class="text-actionColor text-xs font-bold">
          {{ v$.passwordConfirm.required.$invalid ? 'Invalide' : 'Pas identique' }}
        </p>
      </div>

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
            @blur="v$?.password.$touch()"/>
      </InputGroup>
    </div>
    <div class="flex flex-col gap-1 mt-4">
      <div class="flex gap-2">
        <label for="pwd2" class="text-xs">Confirmer le mot de passe</label>
        <p v-if="v$.passwordConfirm.$error"
           class="text-actionColor text-xs font-bold">
          {{ v$.passwordConfirm.required.$invalid ? 'Requis' : 'Pas identique' }}
        </p>
      </div>

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
            @blur="v$?.passwordConfirm.$touch()"/>
      </InputGroup>
    </div>
    <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
    <Button
        class="mt-8"
        @click="updatePassword"
        label="Changer le mot de passe"
        :disabled="v$.$invalid"
    />

  </form>
  <Loader v-if="loading" height="200px"></Loader>
</template>

<script setup lang="ts">

import { computed, inject, reactive, ref } from 'vue';
import type { UpdatePasswordDto } from '@/components/Profile/generalInformations/update-password-dto.ts';
import { PASSWORD_STRONG_REGEX } from '@/functions/check-forms.ts';
import { helpers, required, sameAs } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { OrderDto } from '@/interfaces/order.dto.ts';
import { useToast } from 'primevue/usetoast';
import Loader from '@/components/Loader/Loader.vue';

const form = reactive<UpdatePasswordDto>({
  oldPassword: '',
  password: '',
  passwordConfirm: '',
  checked: false

});

const rules = computed(() => ({
  oldPassword: { required },
  password: { required, strongPassword: helpers.regex(PASSWORD_STRONG_REGEX) },
  passwordConfirm: { required, sameAsPassword: sameAs(form.password), },
}));

const loading = ref(false);

const toast = useToast();
const dialogRef = inject('dialogRef') as any;
const v$ = useVuelidate(rules, form, { $autoDirty: true });

const updatePassword = async () => {
  if (!v$.value.$invalid) {
    loading.value = true;
    await apiPost(api(env.auth.updatePassword), 'PATCH', form, false, true)
        .then(() => {
          toast.add({
            severity: 'success',
            summary: `Mot de passe mit à jour`,
            life: 3000
          });
          dialogRef.value.close()
        }).catch((err) => {
          toast.add({
            severity: 'error',
            summary: err,
            life: 3000
          });
        }).finally(() => {

          loading.value = false;
        });
  }
};

</script>

<style scoped>

</style>