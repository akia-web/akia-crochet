<template>
  <div class="inline-block border border-actionColor rounded-md p-[10px] shadow-md">
    <div v-if="props.parcelPoint === undefined || props.parcelPoint === null"
    class="min-h-[130px]">
      <p class="font-bold" v-if="props.company">{{ props.company }}</p>
      <p class="font-bold" v-else>{{ props.firstName }} {{ props.lastName }}</p>
      <p>{{ props.numberStreet }} {{ props.street }}</p>
      <p>{{ props.postalCode }} -
        {{ props.city }}</p>
      <p>{{ props.country }}</p>
    </div>
    <div v-else class="min-h-[130px]">
      <p class="font-bold">{{props.firstName}} {{props.lastName}}</p>
      <p >{{ props.parcelPoint.name }}</p>
      <p>{{ props.parcelPoint.street }}</p>
      <p>{{ props.parcelPoint.postalCode }} -
        {{ props.parcelPoint.city }}</p>
      <p>{{ props.parcelPoint.country }}</p>
    </div>
      <p v-if="isRecapOrder">E-mail: {{props.email}}</p>
      <p v-if="isRecapOrder">Téléphone: {{props.phone}}</p>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ParcelPointDto } from '@/interfaces/parcel-point.dto.ts';

const props = defineProps({
  parcelPoint: {
    type: Object as PropType<ParcelPointDto>,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  firstName: String,
  lastName: String,
  numberStreet: String,
  street: String,
  postalCode: String,
  city: String,
  country: String,
  isRecapOrder: Boolean,
  email: String,
  phone: String,
});
</script>