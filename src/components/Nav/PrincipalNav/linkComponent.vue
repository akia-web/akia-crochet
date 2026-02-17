<template>
  <RouterLink :to="{ name: PRODUCTS_ROUTE }"
              class="mr-1 text-decoration-none"
              :class="[selectedRoute === `/${PRODUCTS_ROUTE}`? 'border-b border-[var(--action-color)]': 'border-transparent']"
              @click="updateSelectedRoute(PRODUCTS_ROUTE)">
        <span class="text-black font-bold">
          Peluches
        </span>
  </RouterLink>

  <RouterLink :to="{ name: CONTACT_ROUTE }"
              @click="updateSelectedRoute(CONTACT_ROUTE)"
              class="mr-1 text-decoration-none"
              :class="[selectedRoute === `/${CONTACT_ROUTE}`? 'border-b border-[var(--action-color)]': 'border-transparent']">
        <span class="text-black font-bold">
         Contact
        </span>
  </RouterLink>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { CONTACT_ROUTE, PRODUCTS_ROUTE } from '@/router/routes-name.ts';

const emit = defineEmits(['closeDrawer']);
const route = useRoute();
const selectedRoute = ref<string>(PRODUCTS_ROUTE);

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