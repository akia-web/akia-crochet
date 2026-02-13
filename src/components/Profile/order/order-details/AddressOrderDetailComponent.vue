<template>
  <div class="bg-white mt-4 p-[20px] rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Adresses</h2>
    <div v-if="!isGuest && deliveryAddress !== null && billingAddress !== null"
    class="flex flex-wrap gap-4">
      <div>
        <h2>Livraison</h2>
        <RecapAddressComponent
            :company="deliveryAddress.company? deliveryAddress.company:undefined"
            :firstName="deliveryAddress.firstName"
            :lastName="deliveryAddress.lastName"
            :numberStreet="deliveryAddress.numberStreet"
            :street="deliveryAddress.street"
            :postalCode="deliveryAddress.postalCode"
            :city="deliveryAddress.city"
            :country="deliveryAddress.country"
            :parcelPoint="deliveryAddress.parcelPoint"
            :isRecapOrder="true"
            :phone="deliveryAddress.phone"
            :email="deliveryAddress.email"
        />
      </div>

      <div>
        <h2>Facturation</h2>
        <RecapAddressComponent
            :company="billingAddress.company? deliveryAddress.company:undefined"
            :firstName="billingAddress.firstName"
            :lastName="billingAddress.lastName"
            :numberStreet="billingAddress.numberStreet"
            :street="billingAddress.street"
            :postalCode="billingAddress.postalCode"
            :city="billingAddress.city"
            :country="billingAddress.country"
            :isRecapOrder="true"
            :phone="deliveryAddress.phone"
            :email="deliveryAddress.email"
        />
      </div>
    </div>

    <div v-else>
      <p>Pour afficher l'adresse de livraison, merci de bien vouloir saisir le code reçu par e-mail</p>
      <InputOtp v-model="form.code" :length="5" class="mt-4"/>
      <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
      <Button class="mt-4" @click="sendCode">Envoyer</Button>
    </div>

  </div>
</template>
<script lang="ts" setup>

import RecapAddressComponent from '@/components/RecapAddress/RecapAddressComponent.vue';
import { type PropType, reactive } from 'vue';
import type { AddressDto } from '@/interfaces/Address.dto.ts';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';
import type { OrderDto } from '@/interfaces/order.dto.ts';

const toast = useToast();

const props = defineProps({
  deliveryAddress: {
    type: Object as PropType<AddressDto>,
    required: true,
  },
  billingAddress: {
    type: Object as PropType<AddressDto>,
    required: true,
  },
  isGuest: {
    type: Boolean,
    required: true,
  },
  orderId: Number,
});

const form = reactive<{ code: string, checked: boolean }>({
  code: '',
  checked: false
});

const emit = defineEmits([
  'update:isGuest',
  'update:deliveryAddress',
  'update:billingAddress',
]);

const sendCode = async () => {
  await apiPost(api(env.order.updateGuest), 'POST', {
    code: form.code,
    checked: form.checked,
    orderId: props.orderId,
  }, false, true).then((data: OrderDto) => {
    toast.add({
      severity: 'success',
      summary: `Code validé`,
      life: 3000
    });
    emit('update:isGuest', false);
    emit('update:billingAddress', data.billingAddress);
    emit('update:deliveryAddress', data.deliveryAddress);
  })
      .catch(e => toast.add({
        severity: 'error',
        summary: e.message,
        life: 3000
      }));
};

</script>