<template>
  <div class="flex gap-2">
    <div v-if="peluches && peluches.length > 0">
      <div v-for="peluche in peluches" :key="peluche.id">
              <RouterLink :to="{ name: PLUSHIES_DETAIL_ROUTE, params: { pelucheName: peluche.name } }" v-if="peluche.name">
                <PelucheCardComponent :plushie="peluche"/>
              </RouterLink>
      </div>
    </div>

    <div v-else>
      <p>Pas de produits pour le moments</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PeluchesDto } from '@/interfaces/peluchesDto.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import PelucheCardComponent from '@/components/Peluches/PelucheCardComponent.vue';
import { PLUSHIES_DETAIL_ROUTE } from '@/router/routes-name.ts';

const peluches = ref<PeluchesDto[]>([]);

onMounted(async () => {
  await getPeluches('tous les produits');
  console.log(peluches.value);
});

const getPeluches = async (category: string): Promise<any> => {
  fetch(api(env.plushies.crud))
      .then(response => response.json())
      .then(data => {
        console.warn(data);
        peluches.value = data;
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
};

</script>

