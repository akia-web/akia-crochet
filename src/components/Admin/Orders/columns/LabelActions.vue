<template>
  <div v-if="data">
    <p v-if="data.shippingLabel === null" class="text-xs">Pas d'étiquette</p>
    <p v-if="data.shippingLabel !== null" class="text-xs">Status étiquette : {{ data.shippingLabel.status }}</p>
    <div v-if="data.shippingLabel !== null" class="flex gap-2">
      <p class="text-xs">date d'expédition :</p>
      <DateComponent :date="data.shippingLabel.expectedTakingOverDate"/>
    </div>

    <div v-if="data.shippingLabel !== null" class="flex gap-2">
      <p class="text-xs">date de livraion :</p>
      <DateComponent :date=" data.shippingLabel.estimatedDeliveryDate"/>
    </div>

    <div class="flex gap-2">
      <Button
          icon="pi pi-download"
          class="font-size-12px"
          v-tooltip.bottom="'Télécharger'"
          @click="download(data.shippingLabel.orderBoxtalId)"
          v-if="data.shippingLabel !== null"
      />
      <Button
          icon="pi pi-replay"
          class="font-size-12px"
          @click="payTicket(data)"
          v-tooltip.bottom="'Annuler'"
          v-if="data.shippingLabel !== null"
      />

      <Button
          icon="pi pi-info-circle"
          class="font-size-12px"
          @click="payTicket(data)"
          v-tooltip.bottom="'informations'"
          v-if="data.shippingLabel !== null"
      />


      <Button
          icon="pi pi-globe"
          class="font-size-12px"
          v-tooltip.bottom="'lien suivi'"
          @click="payTicket(data)"
          v-if="data.shippingLabel !== null && data.status === ShipmentStatusEnum.SHIPPED"
      />
      <Button
          icon="pi pi-clipboard"
          class="font-size-12px"
          v-tooltip.bottom="'Acheter une étiquette'"
          @click="payTicket(data)"
          v-if="data.shippingLabel === null"
      />
    </div>
  </div>

</template>
<script lang="ts" setup>

import type { ShipmentDto } from '@/interfaces/shipment.dto.ts';
import { ADMIN_ETIQUETTES_ROUTE, ADMIN_ORDERS_ROUTE } from '@/router/routes-name.ts';
import { type PropType } from 'vue';
import { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';
import { useRouter } from 'vue-router';
import DateComponent from '@/components/Admin/Orders/dateComponent.vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const payTicket = (order: ShipmentDto) => {
  router.push({
    name: ADMIN_ETIQUETTES_ROUTE,
    params: { id: order.id, network: order.carrier }
  });
};


const props = defineProps({
  data: {
    type: Object as PropType<ShipmentDto>,
    required: true,
  },
});

const download = async (boxtalId: string) => {
  await apiGet(`${api(env.boxtal.getDocuments)}?id=${boxtalId}`, 'GET', true)
      .then(response => response.json())
      .then((data: any) => {
        window.open(data.url, '_blank');
      })
      .catch(e => {
        toast.add({
          severity: 'error',
          summary: e,
          life: 3000
        });
      });
};
</script>