<template>
  <div class="bg-white p-[20px] rounded-lg w-full mt-[20px] md:mt-0 md:max-w-[250px]">
    <h2 class="text-lg font-semibold mb-4">Commande #{{orderId}}</h2>
    <div class="flex flex-col justify-between h-[calc(100%-30px)]">
      <div v-for="item in itemsList" :key="item.id">
        <div class="flex gap-4 items-center">
          <div class="relative w-[70px] ">
            <img :src="item.imageItemUrl"
                 alt=""
                 class="w-[70px] h-[70px] object-cover"/>

            <div class="absolute -top-1 -right-2 min-w-[25px] min-h-[25px]
            px-1 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center border border-white">
              <p>{{ item.quantity }}</p>
            </div>
          </div>
          <p>{{ item.name }}</p>
          <p>{{ (item.price * item.quantity) / 100 }}€</p>
        </div>
      </div>
      <div class="w-full flex flex-col border-t border-actionColor pt-[10px]">
          <p v-if="addingLivraisonPrice">Supplément de livraison : {{ addingLivraisonPrice / 100 }}€</p>
          <p v-if="tips">Pourboires : {{ tips / 100 }}€</p>
          <p>Total : {{ totalAmount / 100 }}€</p>
      </div>
    </div>

  </div>

</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ItemsPackageBoxtalDto } from '@/interfaces/order-detail.dto.ts';
import type { ItemsOrderDTO } from '@/interfaces/items-order.dto.ts';

const props = defineProps({
  itemsList: {
    type: Object as PropType<ItemsOrderDTO[]>,
    required: true,
  },
  tips: Number,
  orderId: Number,
  addingLivraisonPrice: Number,
  totalAmount: {
    required: true,
    type: Number,
  }
});
</script>