<template>
  <div class="w-full bg-white p-[10px] rounded-lg">
    <H1 class="text-xl">Mes dernières vidéos</H1>

    <div class="flex flex-wrap gap-1 justify-between ">

      <div
          v-for="(bloc, index) in videos"
          :key="index">
        <iframe :src="bloc.url"
            class="mt-4"
                width="280px"
                height="500px"
        ></iframe>
      </div>


    </div>

  </div>

</template>

<script setup lang="ts">
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';

const toast = useToast();

const videos = ref<any>([]);

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
  }
  const url = `${import.meta.env.VITE_BASE_URL_BACK}videos`;
  await apiGet(url, 'GET').then(response => response.json())
      .then(data => {
        videos.value = data;
      });
  console.warn(videos.value);

});


</script>