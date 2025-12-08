<template>
  <RouterLink :to="{ name: 'peluches' }"
              class="mr-1 text-decoration-none font-spartan"
              @click="close">
        <span class="text-black font-bold">
          Nouveautés
        </span>
  </RouterLink>

  <RouterLink :to="{ name: 'peluches' }"
              class="mr-1 text-decoration-none font-spartan"
              @click="close">
        <span class="text-black font-bold">
          Peluches
        </span>
  </RouterLink>

  <RouterLink to="/"
              class="text-decoration-none font-spartan"
              @click="close">
        <span class="text-black font-bold">
          Patrons
        </span>
  </RouterLink>

  <RouterLink :to="{ name: SIMULATOR_ROUTE  }"
              class="text-decoration-none font-spartan"
              @click="close">
    <span class="text-black font-bold">
      Simulateur
    </span>
  </RouterLink>

  <RouterLink :to="{ name: 'peluches' }"
              @click="close"
              class="mr-1 text-decoration-none font-spartan">
        <span class="text-black font-bold">
         Contact
        </span>
  </RouterLink>
</template>
<script setup lang="ts">
import { SIMULATOR_ROUTE } from '@/router/routes-name.ts';

const emit = defineEmits(['closeDrawer']);

function close() {
  emit('closeDrawer');
}
</script>