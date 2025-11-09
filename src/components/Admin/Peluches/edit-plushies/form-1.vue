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
      class="text-red ml-2">Renseignez la description</span>
      </label>
      <Editor
          :modelValue="description"
          @update:modelValue="val => emit('update:description', val)"
          editorStyle="height: 320px"
      />
    </div>

    <div class="flex column mb-6">
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
  </form>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    name: String,
    price: Number,
    description: String,
    isValidName: Boolean,
    isValidDescription: Boolean,
    isValidPrice: Boolean,
  });

  const emit = defineEmits([
    'update:name',
    'update:description',
    'update:price'
  ]);

  const priceProxy = computed({
    get: () => props.price,
    set: value => emit('update:price', value!.toString())
  })
</script>