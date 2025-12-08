<template>

  <div class="p-[10px]">
    <div class="flex w-100 row-reverse">
      <Button label="Ajouter"
              @click="goToAddPeluche"
              class="p-button-action mr-2"
              icon="pi pi-plus">
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <div v-for="item in plushies" :key="item.id" class="">
        <PlushieDetailComponent :plushie="item"
                                @edit="editPeluche"
                                @delete="deletePlushie">
        </PlushieDetailComponent>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user.ts';
import { usePlushieEditStore } from '@/stores/edit-peluche.ts';
import { apiGet } from '@/services/request-service.ts';
import { ADMIN_ADD_PLUSHIES_ROUTE } from '@/router/routes-name.ts';
import PelucheDetailsComponent from '@/components/Peluches/PelucheDetailsComponent.vue';
import PlushieDetailComponent from '@/components/Admin/Peluches/AdminPlushieDetailComponent.vue';

const storeEditPeluche = usePlushieEditStore();

const router = useRouter();

const plushies = ref<PlushieDto[]>([]);

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

const editPeluche = (peluche: PlushieDto) => {
  console.warn('editPeluche')
  console.warn(peluche)
  storeEditPeluche.updatePeluche(peluche);
  goToAddPeluche();
};

const deletePlushie = (peluche: PlushieDto) => {
  const url = `${import.meta.env.VITE_BASE_URL_BACK}peluches?id=${peluche.id}`;
  apiGet(url, 'DELETE', true)
      .then(response => response.json())
      .then(plushies.value = plushies.value.filter((element) => element.id !== peluche.id))
      .catch(error => {
        console.error('Erreur :', error);
      });
};


</script>

<style src="./style.css" scoped></style>