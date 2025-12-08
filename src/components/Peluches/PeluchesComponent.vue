<template>
  <div class="flex gap-2">
    <div v-if="peluches && peluches.length > 0" class="flex gap-2">
      <div v-for="peluche in peluches" :key="peluche.id" >
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
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import PelucheCardComponent from '@/components/Peluches/PelucheCardComponent.vue';
import { PLUSHIES_DETAIL_ROUTE } from '@/router/routes-name.ts';

const peluches = ref<PlushieDto[]>([]);

onMounted(async () => {
  await getPeluches('tous les produits');
});

const getPeluches = async (category: string): Promise<any> => {
  fetch(api(env.plushies.crud))
      .then(response => response.json())
      .then(data => {
        peluches.value = data;
      })
      .catch(error => {
      });
};

</script>

