<template>
  <form>
    <LabelAndInputText v-model:property="form.code"
                       inputId="code"
                       label="Code du transporteur"
                       required
                       :propertyRules="v$?.code"
                       errorMessage="code requis"
    />

    <LabelAndInputText v-model:property="form.name"
                       inputId="name"
                       label="Nom du transporteur"
                       required
                       :propertyRules="v$?.name"
                       errorMessage="Nom requis"
                       class="mt-4"
    />
    <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>

    <div class="flex justify-between mt-4">
      <Button label="Annuler"
              severity="secondary"
              @click="close"
      />
      <Button label="Valider"
              @click="save"
              :disabled="v$.$invalid"/>

    </div>

    <div class="bg-red-50 p-2 mt-4 flex justify-between items-center" v-if="isUpdating">
      <p class="text-red-700">Supprimer le transporteur</p>
      <Button icon="pi pi-trash"
              class="p-button-white"
              rounded
              @click="deleteTransporter"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, ref } from 'vue';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';

const dialogRef = inject('dialogRef') as any;
const toast = useToast();
const isUpdating = ref(false);

const form = reactive({
  name: '',
  code: '',
  checked: false,
  id: undefined,
});

if (dialogRef?.value?.data) {
  form.name = dialogRef.value?.data?.name;
  form.code = dialogRef.value?.data?.code;
  form.id =
  isUpdating.value = dialogRef.value?.data?.id;
}

const rules = computed(() => ({
  name: { required },
  code: { required },

}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

const save = async () => {
  const method = dialogRef?.value?.data?.id ? 'PATCH' : 'POST';
  await apiPost(api(env.transporter.crud), method, form, false, true)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: `Transporter ajouté`,
          life: 3000
        });
        dialogRef.value.close({ action: 'recharge' });
      }).catch((err) => {
        toast.add({
          severity: 'error',
          summary: err,
          life: 3000
        });
      });
};

const deleteTransporter = async () => {
  await apiGet(`${api(env.transporter.crud)}?id=${form.id}`, 'DELETE', true)
      .then(response => response.json())
      .then(() => {
        toast.add({
          severity: 'success',
          summary: `Transporter supprimé`,
          life: 3000
        });
        dialogRef.value.close({ action: 'recharge' });
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
}

const close = () => {
  dialogRef.value.close({});

};
</script>