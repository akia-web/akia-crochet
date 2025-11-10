<template>
  <div class="flex gap-2">
    <div v-for="peluche in peluches" :key="peluche.id">
      <PelucheCardComponent :plushie="peluche"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {PeluchesDto} from "@/interfaces/peluchesDto.ts";
import {Card} from "primevue";
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import PelucheCardComponent from '@/components/Peluches/PelucheCardComponent.vue';
const peluches = ref<PeluchesDto[]>([]);

onMounted(async () => {
  await getPeluches('tous les produits');
  console.log(peluches.value)
})

const getPeluches = async (category: string):Promise<any>=> {
  fetch(api(env.plushies.crud))
      .then(response => response.json())
      .then(data => {
        console.warn(data);
        peluches.value = data
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
};

</script>

