<template>
  <form class="w-[80%] m-0-auto bg-white p-[10px]">
    <div class="flex column">
      <label class="font-size-0_8em italic">Nom de l'auteur
        <span v-if="!isValidName"
              class="text-red ml-2">
          Renseignez le nom
        </span>
      </label>
      <InputText
          type="text"
          placeholder="nom"
          v-model="name"
      />
    </div>
    <br>

    <ul class="mb-4">
      <li v-for="mediaUrl in mediaUrls"
          :key="mediaUrl.type"
          class="flex items-center"
      >
        <a :href="mediaUrl.url" target="_blank">
          <span class="pi"
                :class="getMedialSocialIcon(mediaUrl.type)">
          </span>
          <span class="ml-2">
          {{ mediaUrl.url }}
        </span>
        </a>

        <span class="pi pi-trash text-red-600 ml-4"
              @click="deleteUrl(mediaUrl)">
        </span>
      </li>
    </ul>


    <Button @click="openDialog"
            severity="secondary"
            label="Ajouter un lien"/>


    <div class="flex justify-end">
      <Button @click="save"
              label="Enregistrer"/>
    </div>
  </form>
  <DynamicDialog/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDialog, useToast } from 'primevue';
import PopupAddCreator from '@/components/Admin/Creators/PopupAddCreator.vue';
import type { PlushieCreatorDto } from '@/interfaces/plushie-creator.dto.ts';
import type { SocialMediaDto } from '@/interfaces/social-media.dto.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useRouter } from 'vue-router';
import { configOpenDialog } from '@/config/openDialogConfig.ts';
import { apiPost } from '@/services/request-service.ts';
import { ADMIN_CREATOR_ROUTE } from '@/router/routes-name.ts';
import { getMedialSocialIcon } from '@/functions/social-media-icon.ts';
import { useCreatorEditStore } from '@/stores/edit-creator.ts';

const dialog = useDialog();
const isValidName = ref<boolean>(true);
const mediaUrls = ref<SocialMediaDto[]>([]);
const name = ref<string>();
const toast = useToast();
const router = useRouter();
const storeEditCreator = useCreatorEditStore();
const creatorId = ref<number>();

const openDialog = () => {
  dialog.open(PopupAddCreator, {
    props: configOpenDialog('Ajouter les liens du créateur'),
    onClose: (options: { data: SocialMediaDto }) => {
      if (options?.data) {
        mediaUrls.value.push({ type: options.data.type, url: options.data.url });
      }
    }
  });
};

onMounted(() => {
  if (storeEditCreator.creator) {
    const creator: PlushieCreatorDto = storeEditCreator.creator;
    creatorId.value = creator.id;
    name.value = creator.name;
    if (creator.socialMedia) {
      mediaUrls.value = creator.socialMedia;
    }

  }
});

const deleteUrl = (item: SocialMediaDto) => {
  mediaUrls.value = mediaUrls.value.filter(element => element.url != item.url);
};

const save = () => {
  const newCreator: PlushieCreatorDto = {
    id: creatorId.value ? creatorId.value : undefined,
    name: name.value,
    socialMedia: mediaUrls.value
  };

  apiPost(api(env.plushieCreator.crud), creatorId ? 'PATCH' : 'POST', JSON.stringify(newCreator))
      .then(() => {
        toast.add({
          severity: 'success',
          summary: `${creatorId ? 'Créateur modifié' : 'Créateur enregistrée'}`,
          life: 3000
        });
        storeEditCreator.updateCreator(null);
        router.push({ name: ADMIN_CREATOR_ROUTE });
      })
      .catch(e => toast.add({
        severity: 'error',
        summary: `Erreur lors de l'enregistrement du créateur`,
        life: 3000
      }));
};
</script>
