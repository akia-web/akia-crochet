<template>
  <div v-if="props.form">
    <div
        v-if="props.form.sameAddressForDeliveryAndInvoice && props.form.deliveryAddress.livraisonOption.code === 'domicile'">
      <p>Même adresse que celle de la livraison</p>
    </div>

    <div
        v-if="!props.form.sameAddressForDeliveryAndInvoice ||(props.form.sameAddressForDeliveryAndInvoice && props.form.deliveryAddress.livraisonOption.code !== 'domicile') ">
      <p>Email: {{ props.form.invoiceAddress.email }}</p>
      <div class="inline-block border border-actionColor rounded-md p-[10px] shadow-md">
        <p class="font-bold" v-if="props.form.invoiceAddress.company">{{ props.form.invoiceAddress.company }}</p>
        <p class="font-bold" v-else>{{ props.form.invoiceAddress.firstName }}
          {{ props.form.invoiceAddress.lastName }}</p>
        <p>{{ props.form.invoiceAddress.numberStreet }} {{ props.form.invoiceAddress.street }}</p>
        <p>{{ props.form.invoiceAddress.postalCode }} -
          {{ props.form.invoiceAddress.city }}</p>
        <p>{{ props.form.invoiceAddress.country.name }}</p>
      </div>
    </div>

    <hr class="mt-4 border-actionColor">

    <div class="mt-4">
      <h2 class="font-bold">Pourboire</h2>
      <p class="italic text-sm">Le pourboire est entièrement facultatif et n’influence pas le traitement de votre
        commande.</p>
      <SelectButton v-model="tips"
                    :options="options"
                    optionLabel="name"
                    class="mt-4"/>
    </div>
  </div>


</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useProductsCartStore } from '@/stores/productsCart.ts';

const { updateTips } = useProductsCartStore();

const options = ref([
  { name: '1€', value: 1 },
  { name: '3€', value: 3 },
  { name: '5€', value: 5 },
  { name: 'Aucun', value: 0 }
]);
const props = defineProps({
  form: Object,
  tips: Object
});

const emit = defineEmits([
  'update:tips'
]);

const tips = computed({
  get: () => props.tips,
  set: value => emit('update:tips', value)
});

watch(tips, (newVal) => {
  if(newVal) {
    updateTips(newVal.value)
  }
});

</script>