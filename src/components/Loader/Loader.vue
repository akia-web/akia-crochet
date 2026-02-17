<template>
  <div class="flex w-full h-full"
       :class="[
          props.flexDirection? `props.flexDirection` : 'column',
          alignItems? alignItems : 'items-center',
          justifyContent? justifyContent : 'justify-center',
  ]">
    <img src="../../assets/icones/quokka-cookie.gif" :style="[
        props.height? `height:${props.height}` : 'height:200px'
    ]" alt="" class="heartbeat">
    <p class="mt-8">En attente des données...</p>
  </div>

</template>
<script setup lang="ts">

const props = defineProps({
  height: {
    type: String,
    required: false,
  },
  flexDirection: {
    type: String,
    required: false,
  },
  alignItems: {
    type: String,
    required: false,
  },
  justifyContent: {
    type: String,
    required: false,
  }
});

</script>
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