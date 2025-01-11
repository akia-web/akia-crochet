<template>
  <div class="flex w-100 row-reverse">
    <Button label="Ajouter"
            @click="goToAddPeluche"
            class="p-button-action mr-2"

    icon="pi pi-plus"></Button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const goToAddPeluche = () => {
  router.push('/admin/add-peluches')
}
</script>