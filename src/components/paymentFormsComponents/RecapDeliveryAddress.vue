<template>
  <div v-if="props.form">
    <p>Nom: {{ props.form.lastName }}</p>
    <p> Prenom: {{ props.form.firstName }}</p>
    <p>Email: {{ props.form.email }}</p>
    <p>Téléphone: {{ props.form.phone }}</p>
    <p v-if="props.form.company">Entreprise: {{ props.form.company }}</p>
    <p>Mode de livraison :
      {{ props.form.livraisonOption.code === 'domicile' ? 'À domicile' : 'Relais' }}
      <span class="pi"
            :class="[props.form.livraisonOption.code === 'domicile'? 'pi-home': 'pi-shop']"></span>
    </p>
    <div v-if="props.form.livraisonOption.code !== 'domicile'"
         class="inline-block border border-actionColor rounded-md p-[10px] shadow-md">
      <p class="font-bold text-actionColor">{{ props.form.selectedParcelPoint.name }}</p>
      <p>{{ props.form.selectedParcelPoint.location.street }}</p>
      <p>{{ props.form.selectedParcelPoint.location.zipCode }} -
        {{ props.form.selectedParcelPoint.location.city }}</p>
      <p>{{ props.form.selectedParcelPoint.location.country }}</p>
    </div>

    <div v-else  class="inline-block border border-actionColor rounded-md p-[10px] shadow-md">
      <p class="font-bold">{{ props.form.firstName}} {{props.form.lastName}}</p>
      <p>{{ props.form.numberStreet}} {{props.form.street}}</p>
      <p>{{ props.form.zipCode }} -
        {{ props.form.city }}</p>
      <p>{{props.form.country.name }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

const props = defineProps({
  form: Object,
});
</script>