<template>
  <div v-if="webhook" class="w-full">
    <p>{{ webhook.eventType }}</p>
    <LabelAndInputText v-model:property="webhook.callbackUrl"/>
    <Button label="Modifier"
            @click="update"
            class="mt-5"/>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import type { WebhookResponseDto } from '@/components/Admin/config/Boxtal/interface/webhook-response.dto.ts';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';

const dialogRef = inject<any>('dialogRef');
const toast = useToast();
const webhook = ref<WebhookResponseDto>();
onMounted(() => {
  if (dialogRef?.value?.data) {
    webhook.value = dialogRef.value.data;
  }
});

const update = () => {
  console.warn(webhook.value);
  apiPost(api(env.boxtal.crud), 'PATCH', webhook.value, false, true).then(() => {
    toast.add({
      severity: 'success',
      summary: `Event ${webhook.value!.eventType} modifié`,
      life: 3000
    });
    dialogRef.value.close();
  })
      .catch(e => toast.add({
        severity: 'error',
        summary: e.message,
        life: 3000
      }));
};
</script>