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
  </form>
</template>

<script lang="ts" setup>
  const props = defineProps({
    name: String,
    description: String,
    isValidName: Boolean,
    isValidDescription: Boolean,
  });

  const emit = defineEmits([
    'update:name',
    'update:description'
  ]);
</script>