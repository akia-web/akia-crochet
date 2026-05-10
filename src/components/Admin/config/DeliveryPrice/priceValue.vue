<template>

  <div v-if="!isEditing">
    <p @click="isEditing=true">{{ price }} €</p>
  </div>

  <div v-else class="max-w-[150px]">
    <InputGroup >
      <InputNumber
          v-model="price"
          :minFractionDigits="1"
          :maxFractionDigits="2"/>
      <input type="checkbox" id="checkbox" class="hidden" v-model="checked"/>
      <Button icon="pi pi-times" severity="secondary" @click="cancel"/>
      <Button icon="pi pi-check" :disabled="price<1" @click="send"/>
    </InputGroup>

  </div>


</template>
<script lang="ts" setup>
import { onMounted, type PropType, ref } from 'vue';
import type { WeightPriceDto } from '@/interfaces/weight-price.dto.ts';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';

const checked = ref(false);
const price = ref(0);
const toast = useToast();

const isEditing = ref(false);
const props = defineProps({
  data: {
    type: Object as PropType<WeightPriceDto>,
    required: true,
  },
});

onMounted(() => {
  price.value = props.data?.price / 100;
});

const cancel = () => {
  isEditing.value = false;
  price.value = props.data?.price / 100;
};

const send = async () => {
  if (price.value > 1 && props.data) {
    const newPrice = props.data;
    newPrice.checked = checked.value;
    newPrice.price = Math.round(price.value * 100);

    await apiPost(api(env.transporter.price), 'PATCH', newPrice, false, true)
        .then(() => {
          toast.add({
            severity: 'success',
            summary: `Prix modifié`,
            life: 3000
          });
          isEditing.value = false;
        }).catch((err) => {
          toast.add({
            severity: 'error',
            summary: err,
            life: 3000
          });
        });
  }
};


</script>