<template>
  <h1 class="text-center mb-6 text-xl mt-2"> Informations générales</h1>
  <form>
    <div class="flex column mb-6">
      <LabelAndInputText v-model:property="name"
                         inputId="title"
                         label="Titre"
                         required
                         placeholder="titre"
                         :propertyRules="props.v$?.name"
                         errorMessage="Titre requis"
                         class="mt-4"/>
    </div>

    <div class="mb-1 flex column">
      <div>
        <label class="font-size-0_8em italic">Description</label>
        <p v-if="v$?.description.$error"
           class="text-actionColor text-xs font-bold">
          Description requise
        </p>
      </div>

      <ToggleSwitch v-model="activeEditorHtml"/>
      <Editor
          v-if="!activeEditorHtml"
          v-model="description"
          :modules="modules"
          :formats="formats"
          class="admin-editor"
          editorStyle="height: 320px"
          @blur="props.v$!.description?.$touch()"
      />

      <div v-if="activeEditorHtml" class="w-full">
        <Textarea :modelValue="description"
                  @update:modelValue="val => emit('update:description', val)"
                  class="w-full"
                  rows="5"
                  ref="textarea"
                  @blur="props.v$!.description?.$touch()"
        />
      </div>

    </div>

    <div class="flex items-center  mb-6 mt-4 flex-wrap w-full gap-6">
      <div class="flex column md:w-[250px]">
        <label class="font-size-0_8em italic">Créateur</label>
        <div>
          <Select v-model="creator"
                  :options="creatorsList"
                  optionLabel="name"
                  showClear
                  placeholder="Sélectionner un créateur"/>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-3">
        <Checkbox v-model="collection" binary id="collection"/>
        <label for="collection">Collection</label>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <Checkbox :modelValue="isVisible"  binary id="isVisible" @click.prevent="updateVisibility($event)"/>
        <label for="isVisible" @click="updateVisibility($event)">En ligne</label>
      </div>
    </div>

  </form>
    <DynamicDialog/>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { CreatorDto } from '@/interfaces/creator.dto.ts';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import { useDialog } from 'primevue';
import VisibilityProductDialog from './visibility-product-dialog.vue';
import { configOpenDialog } from '@/config/openDialogConfig';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto';

const creatorsList = ref<CreatorDto[]>([]);
const activeEditorHtml = ref(false);

onMounted(async () => {
  await apiGet(api(env.creator.crud), 'GET').then(response => response.json())
      .then(data => {
        creatorsList.value = data;
      });
});

const props = defineProps({
  name: String,
  description: String,
  creator: Object,
  collection: Boolean,
  isVisible: Boolean,
  variants: Object,
  v$: Object,
});

const root = document.documentElement;
const actionColor = getComputedStyle(root).getPropertyValue('--action-color').trim();
const dialog = useDialog()

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
  'update:creator',
  'update:collection',
  'update:isVisible',
  'update:variants'
  
]);

const creator = computed({
  get: () => props.creator,
  set: value => emit('update:creator', value)
});

const isVisible =computed(() => props.isVisible);

const name = computed({
  get: () => props.name,
  set: value => emit('update:name', value)
});

const variantsComputed = computed(() => props.variants);

const description = computed({
  get: () => props.description,
  set: value => emit('update:description', value)
})

const collection = computed({
  get: () => props.collection,
  set: value => emit('update:collection', value)
});


const updateVisibility = (event:any) => {
    dialog.open(VisibilityProductDialog, {
    props: configOpenDialog('Liste des variants', true, "90%"),
    data: {
      variants: variantsComputed,
      nextVisible: !props.isVisible
    },
    onClose: (options?: { data?: { variants: ProductVariantDto[] } }) => {
      if (options?.data?.variants) {
        let oneVariantIsVisible : boolean = false;
       emit('update:variants', options.data.variants)
        options.data.variants.forEach((element)=>{
          if(element.isVisible){
            oneVariantIsVisible=true
            return
          }
        })
        emit('update:isVisible', oneVariantIsVisible)
      }
    },
  });
}

</script>