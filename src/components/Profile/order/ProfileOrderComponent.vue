<template>
  <h1 class="mt-4">Commandes</h1>
    <div class="flex flex-wrap w-full gap-4 mt-4 justify-center items-center flex-col xl:justify-start md:flex-row" v-if="orders.length > 0">
      <div v-for="order in orders"
           :key="order.id">
        <OrderCard :order="order"></OrderCard>
      </div>
    </div>



</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import OrderCard from '@/components/Profile/order/OrderCard.vue';
import type { AllOrdersDto } from '@/components/Profile/order/interfaces/all-orders.dto.ts';

const orders = ref<AllOrdersDto[]>([]);

onMounted(async () => {
  await apiGet(api(env.order.crud), 'GET', true).then(response => response.json())
      .then(data => {
        orders.value = data;
      });
});
</script>