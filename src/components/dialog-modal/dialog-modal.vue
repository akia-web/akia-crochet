<template>
  <div class="p-4">
    <div v-if="message" v-html="message">
    </div>

  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject<any>('dialogRef');
const message = ref();
onMounted(() => {
  if (dialogRef?.value?.data) {
    message.value = dialogRef.value.data.message;
  }
});
</script>

<style scoped>
h2 {
  margin-bottom: 1em;
}
</style>