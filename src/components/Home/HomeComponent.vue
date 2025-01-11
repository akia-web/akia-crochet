<template>
  <PeluchesComponent/>
</template>

<script setup lang="ts">
import PeluchesComponent from "@/components/Peluches/PeluchesComponent.vue";
import {useToast} from 'primevue';
import {onMounted} from 'vue';

const toast = useToast();

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');

  if (status === 'error') {
    toast.add({
      severity: 'error',
      summary: 'Connexion',
      detail: `Une erreur s'est produite lors de la connexion`,
      life: 3000
    });
  }else{

  }

})



</script>