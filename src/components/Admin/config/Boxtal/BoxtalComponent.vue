<template>
  <div class="p-[20px]">
    <div v-if="webhooks.length>0" class="flex gap-4">
      <Card v-for="hook in webhooks"
            :key="hook.id"
            class="mt-4">
        <template #title>
          <div class="flex gap-2 items-center">
            <p class="text-base">{{ hook.eventType }}</p>
            <p class="w-[15px] h-[15px] rounded-full mb-[5px]" :class="[getStatusColor(hook.status)]"></p>
          </div>

        </template>
        <template #content>
          <DateComponent :date="hook.createdAt"/>
          <div class="flex flex-row-reverse">
            <span class="pi pi-times text-actionColor"/>
          </div>
        </template>
      </Card>
    </div>


    <h2 class="mt-8">Nouveau webhook : </h2>
    <form>
      <Select v-model="form.selectedType"
              :options="options"
              placeholder="Plateforme"
              class="w-[20%]"
      />
      <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
      <Button label="Envoyer" @click="createWebhook"/>
    </form>
  </div>


</template>
<script lang="ts" setup>

import { onMounted, reactive, ref } from 'vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';
import type { WebhookResponseDto } from '@/components/Admin/config/Boxtal/interface/webhook-response.dto.ts';
import { StatusWebhookEnum } from '@/enum/status-webhook-enum.ts';
import DateComponent from '@/components/Admin/Orders/dateComponent.vue';

const options = ['DOCUMENT_CREATED', 'TRACKING_CHANGED'];
const form = reactive({
  selectedType: 'DOCUMENT_CREATED',
  checked: false,
});
const toast = useToast();
const webhooks = ref<WebhookResponseDto[]>([]);

onMounted(() => {
  apiGet(api(env.boxtal.crud), 'GET', true).then(response => response.json())
      .then(data => {
        webhooks.value = data;
        console.warn(data);
      });
});

const createWebhook = async () => {
  apiPost(api(env.boxtal.crud), 'POST', form, false, true)
      .then(() => {
        toast.add({ severity: 'success', summary: 'Webhook créer', life: 3000 });
      })
      .catch(e => {
        toast.add({
          severity: 'error',
          summary: e,
          life: 3000
        });
      }).finally(() => {
  });
};

const getStatusColor = (status: StatusWebhookEnum) => {
  console.warn(status);
  switch (status) {
    case StatusWebhookEnum.ACTIVE:
      return 'bg-success';
    case StatusWebhookEnum.INACTIVE:
      return 'bg-warning';
    case StatusWebhookEnum.SUSPENDED:
      return 'bg-danger';
  }
};
</script>