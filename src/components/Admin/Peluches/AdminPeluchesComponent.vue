<template>

  <div class="p-[10px]">
    <div class="flex w-100 row-reverse">
      <Button label="Ajouter"
              @click="goToAddPeluche"
              class="p-button-action mr-2"
              icon="pi pi-plus">
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <Card v-for="item in plushies" :key="item.id" class="">
        <template #title>
          <div class="flex justify-between align-center">
            <p> {{ item.name }}</p>
            <div>
              <span class="pi pi-file-edit" @click="editPeluche(item)"></span>
              <span class="pi pi-trash ml-4" @click="deletePlushie(item)"></span>
            </div>

          </div>

        </template>
        <template #content>
          <img :src="item.presentationImage" class="image-card" alt="">
        </template>
      </Card>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { PeluchesDto } from '@/interfaces/peluchesDto.ts';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user.ts';
import { usePlushieEditStore } from '@/stores/edit-peluche.ts';
import { apiGet } from '@/services/request-service.ts';
import { ADMIN_ADD_PLUSHIES_ROUTE } from '@/router/routes-name.ts';

const storeEditPeluche = usePlushieEditStore();

const router = useRouter();

const plushies = ref<PeluchesDto[]>([]);

const goToAddPeluche = () => {
  router.push({ name: ADMIN_ADD_PLUSHIES_ROUTE });
};

onMounted(async () => {
  await getPeluches('tous les produits');
});

const getPeluches = async (category: string): Promise<any> => {
  const url = `${import.meta.env.VITE_BASE_URL_BACK}peluches`;

  apiGet(url, 'GET')
      .then(response => response.json())
      .then(data => {
        plushies.value = data;
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
};

const editPeluche = (peluche: PeluchesDto) => {
  storeEditPeluche.updatePeluche(peluche);
  goToAddPeluche();
};

const deletePlushie = (peluche: PeluchesDto) => {
  const url = `${import.meta.env.VITE_BASE_URL_BACK}peluches?id=${peluche.id}`;
  apiGet(url, 'DELETE', true)
      .then(response => response.json())
      .then(data => {
        plushies.value = data;
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
};


</script>

<style src="./style.css" scoped></style>