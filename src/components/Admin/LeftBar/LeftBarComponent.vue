<template>
  <div class="card menu-width min-h-full">
    <Menu :model="items"/>
  </div>


</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const items = ref([
  { label: 'Dashboard', icon: 'pi pi-chart-line', command: () => navigateTo('/Dashboard') },
  { label: 'Peluches', icon: 'pi pi-camera', command: () => navigateTo('/Peluches') },
  { label: 'Patrons', icon: 'pi pi-file-edit', command: () => navigateTo('/Patrons') },
]);

const navigateTo = (url:string) => {
  router.push(`/admin${url}`)
}

</script>

<style scoped src="./style.css"></style>