<template>
  <div class="bg-white p-[20px] rounded-lg">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold" v-if="index">Historique de livraison colis {{ index + 1 }} </h2>
      <a :href="props.trackingUrl" target="_blank" class="text-actionColor underline">Suivre le colis</a>
    </div>
    <p class="mb-4">Numéro de suivi chez le transporteur : {{ props.refBoxtal }} </p>
    <p v-if="props.estimateDeliveryDate" class="text-actionColor mb-4 font-semibold">Date de livraison estimée :
      {{ formattedDate(props.estimateDeliveryDate, false) }}</p>
    <Timeline :value="data" class="customized-timeline">
      <template #marker="slotProps">
                <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm"
                      :style="{ backgroundColor: slotProps.item.color }">
                    <i :class="slotProps.item.icon"></i>
                </span>
      </template>
      <template #content="slotProps">
        <Card class="mt-4">
          <template #title>
            <p class="text-sm">{{ formattedDate(slotProps.item.date) }}</p>
          </template>
          <template #content>
            <p class="text-xs">
              {{ slotProps.item.message }}
            </p>
          </template>
        </Card>
      </template>
    </Timeline>
    <p class="mt-8"> Articles contenus dans le colis:</p>
    <div class="flex gap-4 items-center">
      <div class="relative w-[70px] " v-for="item in items " :key="item.id">
        <img :src="item.image"
             alt=""
             class="w-[70px] h-[70px] object-cover"/>

        <div class="absolute -top-1 -right-2 min-w-[25px] min-h-[25px]
            px-1 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center border border-white">
          <p>{{ item.quantity }}</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { type PropType } from 'vue';
import type { ItemsPackageBoxtalDto } from '@/interfaces/order-detail.dto.ts';

class HistoryTrackingDto {
}

const props = defineProps({
  data: {
    type: Object as PropType<HistoryTrackingDto[]>,
    required: true,
  },
  name: String,
  trackingUrl: String,
  refBoxtal: String,
  items: {
    type: Array as PropType<ItemsPackageBoxtalDto[]>,
    required: true,
  },
  index: Number,
  estimateDeliveryDate: Date
});

const formattedDate = (date: string | Date, hours: boolean = true) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: hours ? '2-digit' : undefined,
    minute: hours ? '2-digit' : undefined,
    hourCycle: hours ? 'h23' : undefined,
  }).format(new Date(date));
};

</script>
<style scoped>
</style>