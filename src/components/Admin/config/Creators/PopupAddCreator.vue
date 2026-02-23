<template>
  <div>
    <div class="flex align-center justify-center column">
      <Select v-model="selectedType"
              :options="optionLink"
              optionLabel="name"
              placeholder="Plateforme"
              class="w-[20%]"
      />
      <br>

      <InputText
          class="w-[80%]"
          type="text"
          v-model="url"
          placeholder="Url"
      />
    </div>
    <div class="flex justify-between mt-6">
      <Button label="Annuler" @click="close" severity="secondary"/>
      <Button label="Valider" @click="save" :disabled="!formIsValid"/>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { inject, type Ref, ref, watch } from 'vue';
import { checkInputIsNotNull } from '@/functions/check-forms.ts';
import { SocialMediaEnum } from '@/enum/social-media.ts';
import type { Dialog } from 'primevue';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';

const dialogRef = inject('dialogRef') as any;
const selectedType = ref();
const url = ref('');
const urlIsValid = ref<boolean>(false);
const selectedTypeIsValid = ref<boolean>(false);
const formIsValid = ref<boolean>(false);

const optionLink = ref<{ name: string; code: string }[]>(Object.values(SocialMediaEnum).map(value => (
    {
      name: value.toLowerCase().replace(/_/g, ' '),
      code: value
    }
)));

watch([url, selectedType], ([newUrl, newSelectedType]) => {
  urlIsValid.value = checkInputIsNotNull(newUrl);
  selectedTypeIsValid.value = !!newSelectedType;
  formIsValid.value = urlIsValid.value && selectedTypeIsValid.value;
});

const save = () => {
  dialogRef.value.close({  type: selectedType.value.code, url: url.value  });
};

const close = () => {
  dialogRef.value.close({ result: null });

};

</script>