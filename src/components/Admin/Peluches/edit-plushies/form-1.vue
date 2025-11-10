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
      <Editor
          :modelValue="description"
          @update:modelValue="val => emit('update:description', val)"
          editorStyle="height: 320px"
      />
    </div>

    <div class="flex align-center mb-6 mt-4 flex-wrap">
      <div class="flex column mr-4 ">
        <label class="font-size-0_8em italic">Créateur</label>
        <Select v-model="selectedCreatorProxyProxy"
                :options="creators"
                optionLabel="name"
                showClear
                class="min-w-[300px]"
                placeholder="Sélectionner un créateur"/>
      </div>

      <div class="flex column">
        <label class="font-size-0_8em italic">Prix (en centimes)
          <span v-if="!isValidPrice"
                class="text-red ml-2">
          Renseignez le prix
        </span>
        </label>
        <InputNumber
            v-model="priceProxy"
            placeholder="prix"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { PlushieCreatorDto } from '@/interfaces/plushie-creator.dto.ts';

const creators = ref<PlushieCreatorDto[]>([]);

onMounted(async () => {
  await apiGet(api(env.plushieCreator.crud), 'GET').then(response => response.json())
      .then(data => {
        creators.value = data;
      });
});

const props = defineProps({
  name: String,
  price: Number,
  description: String,
  isValidName: Boolean,
  isValidDescription: Boolean,
  isValidPrice: Boolean,
  selectedCreator: Object,
});

const emit = defineEmits([
  'update:name',
  'update:description',
  'update:price',
  'update:selectedCreator',
]);

const priceProxy = computed({
  get: () => props.price,
  set: value => emit('update:price', value? value:0)
});

const selectedCreatorProxyProxy = computed({
  get: () => props.selectedCreator,
  set: value => emit('update:selectedCreator', value)
});
</script>