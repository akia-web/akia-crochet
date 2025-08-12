<template>
  <div class="flex">
    <Card v-for="peluche in peluches" :key="peluche.id">
      <template #content>
        <p class="m-0 bg-fuchsia-300">
          {{ peluche.name }}
        </p>

        <img v-if="peluche.presentationImage"
             :src="peluche.presentationImage"
             alt="illustration"
             class="w-200px"
        />
      </template>
    </Card>

  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {PeluchesDto} from "@/interfaces/peluchesDto.ts";
import {Card} from "primevue";
const peluches = ref<PeluchesDto[]>([]);

onMounted(async () => {
  await getPeluches('tous les produits');
  console.log(peluches.value)
})

const getPeluches = async (category: string):Promise<any>=> {
  fetch('http://localhost:3001/peluches')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        peluches.value = data
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
};

</script>

