<template>
  <div class="w-full bg-white p-[10px] rounded-lg">
    <h1 class="text-xl">Mes dernières réalisations</h1>

    <div class="flex flex-col justify-center align-center mt-6 ">
      <div class="flex m-0-auto justify-center gap-1">
        <div v-for="(video, index) in videos" class="crop">
          <img :src="video.picture"
               alt=""
               @click="selectedVideo = video.url; selectedVideoName= video.picture"
               :class="[selectedVideoName === video.picture? 'grayscale-0': 'grayscale',
                        'hover:grayscale-0',
                        'transition-transform',
                        'duration-300',
                        'ease-in-out',
                        'hover:scale-110',
                        'hover:brightness-110',
                        'cursor-pointer'
                        ]"
          >
        </div>
      </div>

      <iframe :src="selectedVideo" class="youtube-video mt-2"/>
    </div>

  </div>

</template>

<script setup lang="ts">
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';

const toast = useToast();
const videos = ref<any>([]);
const selectedVideo = ref<string>('');
const selectedVideoName = ref<string>('');

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
  await apiGet(url, 'GET')
      .then(response => response.json())
      .then(data => {
        videos.value = data;
        selectedVideo.value = data[0].url;
        selectedVideoName.value = data[0].picture;
      });
});
</script>

<style scoped src="./style.css"></style>