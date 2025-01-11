<template>
  <div class="flex">
    <Card v-for="peluche in peluches" :key="peluche.id">
      <template #content>
        <p class="m-0">
          {{ peluche.name }}
        </p>
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
  peluches.value = await getPeluches('tous les produits');
})

const getPeluches = async (category: string): Promise<PeluchesDto[]> => {
  return [
    {
      id: 1,
      name: 'Lapin',
      images: ['lala', 'lolo', 'lili'],
      realisationTime: 120,
      colors: ['lala', 'lolo', 'lili'],
      creationDate: new Date()
    },
    {
      id: 2,
      name: 'Chien',
      images: ['lala', 'lolo', 'lili'],
      realisationTime: 120,
      colors: ['lala', 'lolo', 'lili'],
      creationDate: new Date()
    },
    {
      id: 3,
      name: 'Chat',
      images: ['lala', 'lolo', 'lili'],
      realisationTime: 120,
      colors: ['lala', 'lolo', 'lili'],
      creationDate: new Date(),
    },
    {
      id: 1,
      name: 'Éléphant',
      images: ['lala', 'lolo', 'lili'],
      realisationTime: 120,
      colors: ['lala', 'lolo', 'lili'],
      creationDate: new Date()
    },
    {
      id: 1,
      name: 'Pingouin',
      images: ['lala', 'lolo', 'lili'],
      realisationTime: 120,
      colors: ['lala', 'lolo', 'lili'],
      creationDate: new Date(),
    }
  ]
};

</script>

