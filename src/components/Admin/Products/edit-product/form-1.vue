<template>
  <h1 class="text-center mb-6 text-xl mt-2"> Informations générales</h1>
  <form>
    <div class="flex column mb-6">
      <label class="font-size-0_8em italic">Titre
        <span v-if="!isValidName"
              class="text-red ml-2">
          Renseignez le nom
        </span>
      </label>
      <InputText
          :value="name"
          @input="emit('update:name', $event.target.value)"
          type="text"
          placeholder="nom"
      />
    </div>

    <div class="mb-1 flex column">
      <label class="font-size-0_8em italic">Description
        <span v-if="!isValidDescription"
              class="text-red ml-2">Renseignez la description
        </span>
      </label>
      <ToggleSwitch v-model="activeEditorHtml"/>
      <Editor
          v-if="!activeEditorHtml"
          :modelValue="description"
          @update:modelValue="val => emit('update:description', val)"
          :modules="modules"
          :formats="formats"
          class="admin-editor"
          editorStyle="height: 320px"
      />

      <div v-if="activeEditorHtml" class="w-full">
        <Textarea :modelValue="description"
                  @update:modelValue="val => emit('update:description', val)"
                  class="w-full"
                  rows="5"
                  ref="textarea"
        />
      </div>

    </div>

    <div class="flex items-center  mb-6 mt-4 flex-wrap w-full">
      <div class="flex column md:w-[250px]">
        <label class="font-size-0_8em italic">Créateur</label>
        <div>
          <Select v-model="selectedCreatorProxyProxy"
                  :options="creators"
                  optionLabel="name"
                  showClear
                  placeholder="Sélectionner un créateur"/>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-3">
        <Checkbox v-model="collection" binary id="collection"/>
        <label for="collection">Collection</label>
      </div>
    </div>

  </form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { creatorDto } from '@/interfaces/creator.dto.ts';

const creators = ref<creatorDto[]>([]);
const activeEditorHtml = ref(false);

onMounted(async () => {
  await apiGet(api(env.creator.crud), 'GET').then(response => response.json())
      .then(data => {
        creators.value = data;
      });
});

const props = defineProps({
  name: String,
  description: String,
  isValidName: Boolean,
  isValidDescription: Boolean,
  selectedCreator: Object,
  collection: Boolean,
});

const root = document.documentElement;
const actionColor = getComputedStyle(root).getPropertyValue('--action-color').trim();


const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': ['#000000', actionColor] }],
    ['clean']
  ]
};

const formats = [
  'bold', 'italic', 'underline', 'strike',
  'color'
];
const emit = defineEmits([
  'update:name',
  'update:description',
  'update:selectedCreator',
  'update:collection'
]);

const selectedCreatorProxyProxy = computed({
  get: () => props.selectedCreator,
  set: value => emit('update:selectedCreator', value)
});

const collection = computed({
  get: () => props.collection,
  set: value => emit('update:collection', value)
});

</script>