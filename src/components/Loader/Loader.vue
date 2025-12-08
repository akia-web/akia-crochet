<template>
  <div class="flex justify-center align-center h-[calc(100vh-var(--height-nav))]">
    <img src="@/assets/logo.png" alt="" class="heartbeat">
  </div>

</template>
<script setup lang="ts"></script>
<style scoped>
.heartbeat {
  animation: heartbeat 1.2s ease-in-out infinite;
  display: inline-block;
}
@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1.05);
  }
}
</style>