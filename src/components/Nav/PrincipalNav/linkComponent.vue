<template>
  <!--  <RouterLink :to="{ name: 'peluches' }"-->
  <!--              class="mr-1 text-decoration-none font-spartan"-->
  <!--              @click="close">-->
  <!--        <span class="text-black font-bold">-->
  <!--          Nouveautés-->
  <!--        </span>-->
  <!--  </RouterLink>-->

  <RouterLink :to="{ name: 'peluches' }"
              class="mr-1 text-decoration-none"
              :class="[selectedRoute === `/${PLUSHIES_ROUTE}`? 'border-b border-[var(--action-color)]': 'border-transparent']"
              @click="updateSelectedRoute(PLUSHIES_ROUTE)">
        <span class="text-black font-bold">
          Peluches
        </span>
  </RouterLink>

  <!--  <RouterLink to="/"-->
  <!--              class="text-decoration-none font-spartan"-->
  <!--              @click="close">-->
  <!--        <span class="text-black font-bold">-->
  <!--          Patrons-->
  <!--        </span>-->
  <!--  </RouterLink>-->

  <!--  <RouterLink :to="{ name: SIMULATOR_ROUTE  }"-->
  <!--              class="text-decoration-none font-spartan"-->
  <!--              @click="close">-->
  <!--    <span class="text-black font-bold">-->
  <!--      Simulateur-->
  <!--    </span>-->
  <!--  </RouterLink>-->

  <RouterLink :to="{ name: CONTACT_ROUTE }"
              @click="updateSelectedRoute(CONTACT_ROUTE)"
              class="mr-1 text-decoration-none"
              :class="[selectedRoute === `/${CONTACT_ROUTE}`? 'border-b border-[var(--action-color)]': 'border-transparent']">
        <span class="text-black font-bold">
         Contact
        </span>
  </RouterLink>

  <!--  <RouterLink :to="{ name: 'carte'  }"-->
  <!--              class="text-decoration-none font-spartan"-->
  <!--              @click="close">-->
  <!--    <span class="text-black font-bold">-->
  <!--      Carte-->
  <!--    </span>-->
  <!--  </RouterLink>-->
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { CONTACT_ROUTE, PLUSHIES_ROUTE } from '@/router/routes-name.ts';

const emit = defineEmits(['closeDrawer']);
const route = useRoute();
const selectedRoute = ref<string>('peluches');

const updateSelectedRoute = (url?: string) => {
  close()

  if(url){
    selectedRoute.value = `/${url}`;
  }else{
    selectedRoute.value = route.path;
  }
};


function close() {
  emit('closeDrawer');
}
</script>