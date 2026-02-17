<template>
  <div class="p-[10px]">
    <div class="flex w-100 row-reverse">
      <Button label="Ajouter"
              @click="goToAddCreator"
              class="p-button-action mr-2"
              icon="pi pi-plus">
      </Button>

    </div>

    <div class="flex gap-2">
      <Card v-for="(creator, index) in creators" :key="creator.id" class="min-w-[250px]">
        <template #title>
          <div class="flex align-center justify-between">
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
          <ul class="flex gap-2">
            <li v-for="socialMedia in creator.socialMedia">
              <a :href="socialMedia.url" target="_blank" class="hover:text-actionColor">
                <span
                    class="pi border border-transparent rounded p-[5px] hover:text-white hover:bg-[var(--action-color-hover)] hover:border-[var(--action-color-hover)] transition ease-in-out duration-100"
                    :class="getMedialSocialIcon(socialMedia.type)">
                </span>
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
import type { creatorDto } from '@/interfaces/creator.dto.ts';
import { getMedialSocialIcon } from '@/functions/social-media-icon.ts';
import { useCreatorEditStore } from '@/stores/edit-creator.ts';
import type { MenuItem } from 'primevue/menuitem';

const router = useRouter();
const menuRefs = ref([]);
const menuItems = ref<MenuItem[]>([]);
const storeEditCreator = useCreatorEditStore();
const creators = ref<creatorDto[]>([]);

const goToAddCreator = (): void => {
  router.push({ name: ADMIN_ADD_CREATOR_ROUTE });
};

onMounted(async (): Promise<void> => {
  await apiGet(api(env.creator.crud), 'GET').then(response => response.json())
      .then(data => {
        creators.value = data;
      });
});

const toggle = (event: any, index: number, creator: creatorDto): void => {
  menuItems.value = [
    {
      label: 'Éditer',
      icon: 'pi pi-file-edit',
      command: () => editCreator(creator)
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => deleteCreator(creator)
    }
  ];

  menuRefs.value[index]?.toggle(event);
};

const editCreator = (creator: creatorDto): void => {
  storeEditCreator.updateCreator(creator);
  router.push({ name: ADMIN_ADD_CREATOR_ROUTE });
};

const deleteCreator = (creator: creatorDto) => {
  const url = `${api(env.creator.crud)}?id=${creator.id}`;
  apiGet(url, 'DELETE', true)
      .then(response => response.json())
      .then(creators.value = creators.value.filter((element: creatorDto) => element.id !== creator.id))
      .catch(error => {
        console.error('Erreur :', error);
      });
};
</script>