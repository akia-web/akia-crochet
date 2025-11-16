<template>
  lala {{ pelucheName }}
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { PeluchesDto } from '@/interfaces/peluchesDto.ts';

defineProps({
  pelucheName: String
})

// const props = defineProps({
//   pelucheName: String
// });

// const plushie = ref<PeluchesDto>()

// onMounted(async() => {
//  await apiGet(api(`${env.plushies.byName}?name:${props.pelucheName}`),'GET').then(response => response.json())
//       .then(data => {
//         console.warn(data)
//         plushie.value = data;
//       });
// });
</script>
