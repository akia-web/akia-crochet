<template>
  <div v-if="props.form">
    <div v-if="props.form.sameAddressForDeliveryAndInvoice && props.form.deliveryAddress.livraisonOption.code === 'domicile'">
      <p>Même adresse que celle de la livraison</p>
    </div>

    <div v-if="!props.form.sameAddressForDeliveryAndInvoice ||(props.form.sameAddressForDeliveryAndInvoice && props.form.deliveryAddress.livraisonOption.code !== 'domicile') ">
      <p>Email: {{ props.form.invoiceAddress.email }}</p>
      <div class="inline-block border border-actionColor rounded-md p-[10px] shadow-md">
        <p class="font-bold" v-if="props.form.invoiceAddress.company">{{ props.form.invoiceAddress.company}}</p>
        <p class="font-bold" v-else>{{ props.form.invoiceAddress.firstName}} {{props.form.invoiceAddress.lastName}}</p>
        <p>{{ props.form.invoiceAddress.numberStreet}} {{props.form.invoiceAddress.street}}</p>
        <p>{{ props.form.invoiceAddress.zipCode }} -
          {{ props.form.invoiceAddress.city }}</p>
        <p>{{ props.form.invoiceAddress.country }}</p>
      </div>
    </div>
  </div>


</template>
<script lang="ts" setup>
const props = defineProps({
  form: Object,
});

</script>