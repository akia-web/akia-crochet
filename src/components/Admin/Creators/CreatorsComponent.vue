<template>
  <div class="p-[10px]">
    <div class="flex w-100 row-reverse">
      <Button label="Ajouter"
              @click="goToAddCreator"
              class="p-button-action mr-2"
              icon="pi pi-plus">
      </Button>

    </div>

    <div class="flex">
      <Card v-for="(creator, index) in creators" :key="creator.id">
        <template #title>
          <div class="flex align-center">
            <h2>{{ creator.name }}</h2>
            <Button variant="text"
                    rounded
                    type="button"
                    icon="pi pi-ellipsis-v"
                    class="menu"
                    @click="(event) => toggle(event, index, creator)"
                    aria-haspopup="true"
                    :aria-controls="`overlay_menu_${index}`"
            />
            <Menu
                :ref="el => menuRefs[index] = el"
                :id="`overlay_menu_${index}`"
                :model="menuItems"
                :popup="true"
            />
          </div>
        </template>
        <template #content>
          <ul>
            <li v-for="socialMedia in creator.socialMedia">
              <a :href="socialMedia.url" target="_blank">
                <span class="pi" :class="getMedialSocialIcon(socialMedia.type)"></span>
              </a>
            </li>
          </ul>
        </template>
      </Card>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ADMIN_ADD_CREATOR_ROUTE, ADMIN_ADD_PLUSHIES_ROUTE } from '@/router/routes-name.ts';
import { onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { PlushieCreatorDto } from '@/interfaces/plushie-creator.dto.ts';
import { getMedialSocialIcon } from '@/functions/social-media-icon.ts';
import { useCreatorEditStore } from '@/stores/edit-creator.ts';
import type { MenuItem } from 'primevue/menuitem';

const router = useRouter();
const menuRefs = ref([]);
const menuItems = ref<MenuItem[]>([]);
const storeEditCreator = useCreatorEditStore();
const creators = ref<PlushieCreatorDto[]>([]);

const goToAddCreator = (): void => {
  router.push({ name: ADMIN_ADD_CREATOR_ROUTE });
};

onMounted(async (): Promise<void> => {
  await apiGet(api(env.plushieCreator.crud), 'GET').then(response => response.json())
      .then(data => {
        creators.value = data;
      });
});

const toggle = (event: any, index: number, creator: PlushieCreatorDto): void => {
  menuItems.value = [
    {
      label: 'Éditer',
      icon: 'pi pi-file-edit',
      command: () => editCreator(creator)
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => editCreator(creator)
    }
  ];

  menuRefs.value[index]?.toggle(event);
};

const editCreator = (creator: PlushieCreatorDto): void => {
  storeEditCreator.updateCreator(creator);
  router.push({ name: ADMIN_ADD_CREATOR_ROUTE });
};
</script>