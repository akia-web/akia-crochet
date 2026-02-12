<template>
  <div v-if="props.form">
    <div v-if="props.form.sameAddressForDeliveryAndInvoice && props.form.deliveryAddress.livraisonOption.name === 'Domicile'">
      <p>Même adresse que celle de la livraison</p>
    </div>

    <div
        v-if="!props.form.sameAddressForDeliveryAndInvoice ||(props.form.sameAddressForDeliveryAndInvoice && props.form.deliveryAddress.livraisonOption.name !== 'Domicile') ">
      <p>Email: {{ props.form.invoiceAddress.email }}</p>
      <RecapAddressComponent :company="props.form.invoiceAddress.company"
                             :firstName="props.form.invoiceAddress.firstName"
                             :lastName="props.form.invoiceAddress.lastName"
                             :numberStreet="props.form.invoiceAddress.numberStreet"
                             :street="props.form.invoiceAddress.street"
                             :postalCode="props.form.invoiceAddress.postalCode"
                             :city="props.form.invoiceAddress.city"
                             :country="props.form.invoiceAddress.country.name"/>

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
import RecapAddressComponent from '@/components/RecapAddress/RecapAddressComponent.vue';

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