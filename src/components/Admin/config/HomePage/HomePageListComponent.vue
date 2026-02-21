<template>
  <div class="p-[10px]">
    <div class="flex w-100 row-reverse">
      <Button label="Ajouter"
              @click="goToAddHome(undefined)"
              class="p-button-action mr-2"
              icon="pi pi-plus">
      </Button>
    </div>
    <DataTable
        :value="homeConfig"
        dataKey="id"
        class="mt-4"
        filterDisplay="row"
        tableStyle="min-width:90%"
    >
      <template #header>
        <span class="text-xl font-bold">Home page liste</span>
      </template>
      <Column field="createdAt" header="Date">
        <template #body="{ data }">
          <DateComponent :date="data.createdAt"/>
        </template>
      </Column>

      <Column field="imageUrl" header="Image">
        <template #body="slotProps">
          <img :src="slotProps.data.imageUrl" class="w-[100px]" alt="">

        </template>
      </Column>

      <Column field="path" header="Path">
        <template #body="slotProps">
          <p class="text-xs">{{ slotProps.data.path }}</p>
        </template>
      </Column>

      <Column field="isActual" header="visible">
        <template #body="slotProps">
          <ToggleSwitch v-model="slotProps.data.isActual" @click="updateHomeConfig(slotProps.data)"/>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" @click="goToAddHome(slotProps.data.id)"></Button>
            <Button icon="pi pi-times" @click="deleteHomeConfig(slotProps.data)"></Button>
          </div>

        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ADMIN_HOME_ROUTE, ADMIN_UPDATE_HOME_ROUTE } from '@/router/routes-name.ts';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { HomeConfigDto } from '@/interfaces/home-config.dto.ts';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useToast } from 'primevue/usetoast';
import DateComponent from '@/components/Admin/Orders/dateComponent.vue';

const router = useRouter();
const goToAddHome = (id?: number | undefined) => {
  router.push({ name: ADMIN_UPDATE_HOME_ROUTE, query: { id } });
};

const homeConfig = ref<HomeConfigDto[]>([]);
const toast = useToast();
onMounted(() => {
  apiGet(api(env.homePage.crud), 'GET', true)
      .then(response => response.json())
      .then((data: HomeConfigDto[]) => {
        homeConfig.value = data;
      })
      .catch(e => {
        toast.add({
          severity: 'error',
          summary: e,
          life: 3000
        });
      });
});

const updateHomeConfig = async (data: HomeConfigDto) => {
  const dto = { ...data, checked: false };
  dto.isActual = !dto.isActual;
  apiPost(api(env.homePage.crud), 'PATCH', dto, false, true)
      .then(() => {
        toast.add({ severity: 'success', summary: 'Modification enregistrée', life: 3000 });
        if (data.isActual) {
          homeConfig.value.forEach((item: HomeConfigDto) => {
            item.isActual = item.id === data.id;
          });
        }
      })
      .catch(e => {
        toast.add({
          severity: 'error',
          summary: e,
          life: 3000
        });
      });

};

const deleteHomeConfig = async (data: HomeConfigDto) => {
  const url = `${api(env.homePage.crud)}?id=${data.id}`;
  apiGet(url, 'DELETE', true)
      .then(response => response.json())
      .then(() => {
        homeConfig.value = homeConfig.value.filter(
            (element: HomeConfigDto) => element.id !== data.id
        )
        toast.add({ severity: 'success', summary: 'Supression réussi', life: 3000 })
      })
      .catch(error => {
        console.error('Erreur :', error);
      });

};
</script>

