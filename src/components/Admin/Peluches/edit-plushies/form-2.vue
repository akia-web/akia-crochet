<template>
  <h1 class="text-center mb-6 text-xl mt-2"> Vidéos</h1>
  <form>
    <div class="mb-1 flex column">
      <label class="font-size-0_8em italic">Lien Vidéos</label>
      <div>
        <div class="flex items-center">
          <InputText name="name"
                     v-model="newName"
                     type="text"
                     class="w-[30%]"
                     placeholder="Nom de la vidéo"/>

          <InputText name="vidéo"
                     v-model="newVideoLinkUrl"
                     type="text"
                     class="w-[40%]"
                     placeholder="vidéo"/>

          <Select v-model="selectedType"
                  :options="optionLink"
                  optionLabel="name"
                  placeholder="Sélectionner le type de video"
                  class="w-[20%]"
          />
          <Button v-if="selectedType && newVideoLinkUrl"
                  label="valider"
                  class="ml-[1em]"
                  icon="pi pi-check"
                  @click="addNewVideo"
          />
        </div>

        <div class="flex justify-center">
          <iframe v-if="iframeNewLink"
                  :src="iframeNewLink"
                  width="500"
                  height="300"
                  class="mt-4"
          ></iframe>
        </div>

        <Divider/>

      </div>
      <div>
        <div v-for="video in videoLinks">
          <div class="flex items-center">
            <div @click="openDialog(video)">
                 <span v-if="video.type === 'SHORT' || video.type==='VIDEO_YOUTUBE'"
                       class="pi pi-youtube text-red">
            </span>
              <span v-if="video.type === 'TIKTOK'" class="pi pi-tiktok"></span>
              <span class="pl-2"> {{ video.url }}</span>
            </div>
            <div>
              <span>- {{ video.name }}</span>
            </div>
            <Button class="button-action-transparent ml-2"
                    icon="pi pi-trash"
                    @click="deleteVideo(video)"
            ></Button>
          </div>

        </div>
      </div>
    </div>
  </form>
  <DynamicDialog/>
</template>

<script lang="ts" setup>
import type { LinkDto } from '@/interfaces/link.dto.ts';
import { computed, onMounted, ref, watch } from 'vue';
import { TypeLinkEnum } from '@/enum/type-link-enum.ts';
import { useDialog } from 'primevue';
import DialogModal from '@/components/dialog-modal/dialog-modal.vue';


const dialog = useDialog();

const optionLink = ref<{ name: string; code: string }[]>(Object.values(TypeLinkEnum).map(value => (
    {
      name: value.toLowerCase().replace(/_/g, ' '),
      code: value
    }
)));
const selectedType = ref();
const newVideoLinkUrl = ref();
const newName = ref();
const nextRow = ref<number>(0);

const iframeNewLink = computed(() => {
  if (!newVideoLinkUrl.value || !selectedType.value) {
    return undefined;
  }
  return newVideoLinkUrl.value;
});

const props = defineProps({
  videoLinks: {
    type: Array as () => LinkDto[],
    default: () => []
  },
  description: String
});

const emit = defineEmits([
  'update:videoLinks',
]);

function transformUrl(url: string, typeCode: TypeLinkEnum) {
  if (!url) return '';
  if (typeCode === TypeLinkEnum.SHORT) {
    return url.replace('shorts', 'embed');
  }
  return url;
}

watch([selectedType, newVideoLinkUrl], ([newType, newUrl]) => {
  if (newType && newUrl) {
    const transformed = transformUrl(newUrl, newType.code);
    if (transformed !== newVideoLinkUrl.value) {
      newVideoLinkUrl.value = transformed;
    }
  }
});

watch(props.videoLinks, (newValue) => {

});

const addNewVideo = () => {
  if (!newVideoLinkUrl.value || !selectedType.value) return;

  const newLink: LinkDto = {
    url: newVideoLinkUrl.value,
    type: selectedType.value.code,
    name: newName.value,
    row: nextRow.value
  };

  emit('update:videoLinks', [...props.videoLinks, newLink]);
  updateNextRow();
  newVideoLinkUrl.value = '';
  selectedType.value = null;
  newName.value = '';
};


const deleteVideo = (video: LinkDto) => {
  const filteredVideos = props.videoLinks.filter((e => e.url !== video.url));

  emit('update:videoLinks', filteredVideos);

};

const updateNextRow = () => {
  getNextRow();
  nextRow.value = nextRow.value + 1;
};

const openDialog = (video: LinkDto) => {
  dialog.open(DialogModal, {
    props: {
      header: video.name,
      modal: true
    },
    data: {
      message: `<iframe src=${video.url} width="600" height="400"></iframe>`
    },
  });
};

const getNextRow = () => {
  if (props.videoLinks.length === 0) {
    nextRow.value = 0;
  } else {
    const maxObjet = props.videoLinks.reduce((prev, current) => {
      return (current.row > prev.row) ? current : prev;
    });
    nextRow.value = maxObjet.row + 1;
  }
};

onMounted(() => {

});
</script>