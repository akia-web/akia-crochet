<template>
  <h1 class="text-lg">Demande de contact</h1>

  <form class="mt-4">
    <div class="flex flex-col gap-4">
      <LabelAndInputText v-model:property="form.email"
                         label="E-mail"
                         inputId="email"
                         required
                         :propertyRules="v$.email"
                         errorMessage="Invalide"
      />

      <LabelAndInputText v-model:property="form.subject"
                         label="Objet"
                         inputId="object"
                         required
                         :propertyRules="v$.object"
                         errorMessage="Invalide"
      />

      <Editor
          v-model="form.description"
          editorStyle="height: 320px"
      />
    </div>
    <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
    <Button label="Envoyer"
            :disabled="v$.$invalid"
            @click="sendEmail"
            class="mt-4"
    />
  </form>

</template>

<script lang="ts" setup>
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { computed, onMounted, reactive } from 'vue';
import { email, minLength, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useUserStore } from '@/stores/user.ts';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const form = reactive({
  subject: '',
  description: '',
  email: '',
  checked: false,
});

const rules = computed(() => ({
  subject: { required, minLength: minLength(4) },
  email: { required, email },
  description: { required, minLength: minLength(5) }
}));
const v$ = useVuelidate(rules, form, { $autoDirty: true });

const user = useUserStore();
const toast = useToast();
const router = useRouter();

onMounted(() => {
  if (user && user.user) {
    form.email = user.user.email;
  }

});

const sendEmail = async () => {
  if (!v$.value.$invalid) {
    await apiPost(api(env.contact.send), 'POST', form, false, false)
        .then(() => {
          toast.add({
            severity: 'success',
            summary: `Message envoyé`,
            life: 3000
          });
          router.push({ name: 'home' });
        }).catch((err) => {
          toast.add({
            severity: 'error',
            summary: err,
            life: 3000
          });
        })
  }
};

</script>