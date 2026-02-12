<template>
  <Card class="max-w-[250px] min-w-[250px] min-h-[423px]">
    <template #title>
      <div class="flex justify-between items-center">
        <Tag :value="traductOrderStatusEnum(order.status)"
        :severity="getSeverityOrderStatus(order.status)"></Tag>
        <p class="text-right text-sm">Commande # {{ order.id }}</p>
      </div>
      <p class="text-xs mt-1 ml-[5px]">{{formattedDate}}</p>
    </template>
    <template #content>
      <div class="flex justify-center">
        <div class="flex flex-wrap min-h-[200px] max-h-[200px] max-w-[200px]"
             v-if="order.imageItem.length !== 3">
          <div v-for="(image, index) in order.imageItem" :key="image">

            <img :src="image"
                 v-if="index <= 2"
                 alt=""
                 :class="getSizeImage(index)"
            >

            <div class="w-[100px] h-[100px] bg-bgSite flex justify-center items-center"
                 v-if="index>=3">
              <p>+ {{ order.imageItem.length - 3 }}</p>
            </div>
          </div>
        </div>

        <div v-if="order.imageItem.length === 3">
          <div class="flex">
            <div class="flex flex-col">
              <img :src="order.imageItem[0]"
                   alt=""
                   class="w-[100px]"
              >
              <img :src="order.imageItem[2]"
                   alt=""
                   class="w-[100px]"
              >
            </div>
            <img :src="order.imageItem[1]"
                 class="w-[100px] h-[200px] object-cover"
                 alt="">
          </div>

        </div>

      </div>
      <div class="flex justify-between mb-4 mt-1">
        <p class="mt-2 text-sm">{{ order.imageItem.length }} article{{ order.imageItem.length > 1 ? 's' : '' }}</p>
        <p class="mt-2 font-bold">{{ order.totalAmount / 100 }} €</p>
      </div>

      <div class="flex justify-center flex-col gap-1">
        <div v-for="shipment in order.package"
             :key="shipment.name">
          <div class="flex items-center gap-8">
            <p class="w-[50px] text-sm">{{ shipment.name }}</p>
            <Tag :value="traductShipmentStateEnum(shipment.status)"
            :severity="getSeverityShipmentStatus(shipment.status)"></Tag>
          </div>
        </div>
      </div>

    </template>
  </Card>

</template>

<script lang="ts" setup>
import type { AllOrdersDto } from '@/components/Profile/order/interfaces/all-orders.dto.ts';
import { computed } from 'vue';
import {
  getSeverityShipmentStatus,
  traductOrderStatusEnum,
  traductShipmentStateEnum
} from '@/functions/enum-to-francais.ts';
import { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';
import { OrderStatusEnum } from '@/enum/orders-status-enum.ts';

const props = defineProps({
  order: {
    type: Object as () => AllOrdersDto,
    default: () => ({}),
  },
});

const formattedDate = computed(() =>
    new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(props.order.createdAt)),
);

const getSizeImage = (index: number): string => {
  if (index === 0 && order.value.imageItem.length === 1) {
    return `w-[200px]`;
  } else if (order.value.imageItem.length == 2) {
    return `w-[90px] h-[200px] object-cover ${index === 0 ? 'mr-1' : ''}`;
  } else {
    return `w-[100px]`;
  }
};
const getSeverityOrderStatus=(status: OrderStatusEnum) => {
  switch (status) {
    case OrderStatusEnum.PAID:
      return 'success';
    case OrderStatusEnum.FAILED:
      return 'danger';
    default:
      return 'info';
  }

}

const order = computed(() => props.order);
</script>