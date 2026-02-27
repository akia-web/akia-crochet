<template>
  <div class="p-[20px]">
    <div v-if="webhooks.length>0" class="flex gap-4">
      <Card v-for="hook in webhooks"
            :key="hook.id"
            class="mt-4">
        <template #title>
          <div class="flex gap-2 items-center">
            <p class="text-base" @click="update(hook)">{{ hook.eventType }}</p>
            <p class="w-[15px] h-[15px] rounded-full mb-[5px]" :class="[getStatusColor(hook.status)]"></p>
          </div>

        </template>
        <template #content>
          <DateComponent :date="hook.createdAt"/>
          <p class="text-xs">{{ hook.callbackUrl }}</p>
          <p class="text-xs">id: {{hook.id}}</p>
          <div class="flex flex-row-reverse">
            <span class="pi pi-times text-actionColor" @click="deleteHook(hook)"/>
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

  <DynamicDialog/>
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
import { useDialog } from 'primevue';
import EditPopupComponent from '@/components/Admin/config/Boxtal/popup/EditPopupComponent.vue';
import { configOpenDialog } from '@/config/openDialogConfig.ts';

const options = ref(['DOCUMENT_CREATED', 'TRACKING_CHANGED']);
const form = reactive({
  selectedType: 'DOCUMENT_CREATED',
  checked: false,
});
const toast = useToast();
const webhooks = ref<WebhookResponseDto[]>([]);
const dialog = useDialog();

onMounted(() => {
  apiGet(api(env.boxtal.crud), 'GET', true).then(response => response.json())
      .then((data: WebhookResponseDto[]) => {
        webhooks.value = data;
      });
});

const createWebhook = async () => {
  apiPost(api(env.boxtal.crud), 'POST', form, false, true)
      .then((data: WebhookResponseDto) => {
        webhooks.value.push(data);
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
  switch (status) {
    case StatusWebhookEnum.ACTIVE:
      return 'bg-success';
    case StatusWebhookEnum.INACTIVE:
      return 'bg-warning';
    case StatusWebhookEnum.SUSPENDED:
      return 'bg-danger';
  }
};

const update = async (hook: WebhookResponseDto) => {
  dialog.open(EditPopupComponent, {
    props: configOpenDialog(`Modifier l'event ${hook.eventType}`),
    data: hook,
  });
};

const deleteHook = async (hook: WebhookResponseDto) => {
  const url = `${api(env.boxtal.crud)}?id=${hook.id}`;
 await apiGet(url, 'DELETE', true)
      .then(response => response.json())
      .then(() => {
        webhooks.value = webhooks.value.filter((element: WebhookResponseDto) => element.id !== hook.id);
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
}
</script>