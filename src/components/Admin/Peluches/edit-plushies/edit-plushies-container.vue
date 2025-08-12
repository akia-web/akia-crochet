<template class="flex column justify-center">
  <Stepper value="1">
    <StepList>
      <Step value="1">Général</Step>
      <Step value="2">Vidéos</Step>
      <Step value="3">Photos</Step>
    </StepList>
    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <div class="p-[10px]">
          <form1 v-model:name="name"
                 v-model:description="description"
                 :isValidName="isValidName"
                 :isValidDescription="isValidDescription"
          >
          </form1>
          <div class="flex pt-6 justify-end">
            <Button label="Suivant"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    :disabled="!form1IsValid"
                    @click="activateCallback('2')"/>
          </div>
        </div>

      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <div class="p-[10px]">
          <form2 v-model:videoLinks="videoLinks"></form2>
          <div class="flex pt-6 justify-between">
            <Button label="Précédent" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')"/>
            <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')"/>
          </div>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="3">
        <div class="p-[10px]">
          <form3 v-model:imagesFiles="imagesFiles"
                 v-model:filePresentation="filePresentation"
                 v-model:presentationImage="presentationImage">
          </form3>
          <div class="pt-6 flex justify-between">
            <Button label="Précédent"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    @click="activateCallback('2')"
            />
            <Button label="Valider"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    :disabled="!form3IsValid"
                    @click="send"
            />
          </div>
        </div>

      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<script setup lang="ts">
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Form1 from '@/components/Admin/Peluches/edit-plushies/form-1.vue';
import { ref, watch } from 'vue';
import Form2 from '@/components/Admin/Peluches/edit-plushies/form-2.vue';
import type { LinkDto } from '@/interfaces/link.dto.ts';
import Form3 from '@/components/Admin/Peluches/edit-plushies/form-3.vue';
import { checkInputIsNotNull } from '@/functions/check-forms.ts';

const name = ref<string>('');
const description = ref<string>('');
const videoLinks = ref<LinkDto[]>([]);
const imagesFiles = ref<File[]>([]);
const filePresentation = ref<File>();
const presentationImage = ref<string>('');

const isValidName = ref<boolean>(true);
const isValidDescription = ref<boolean>(true);

const form1IsValid = ref<boolean>(false);
const form3IsValid = ref<boolean>(false);

watch([name, description], ([newName, newDescription]) => {
  const nameIsValid = checkInputIsNotNull(newName)
  const descriptionIsValid = checkInputIsNotNull(newDescription)
  form1IsValid.value = nameIsValid && descriptionIsValid
  isValidName.value = nameIsValid;
  isValidDescription.value = descriptionIsValid;
});


watch(filePresentation, (newFile) => {
  form3IsValid.value = newFile !== undefined

});

const send = async () => {
  const allImage = [...imagesFiles.value, filePresentation.value];
  const formData = new FormData();
  allImage.forEach((file) => {
    formData.append('images', file as File);
  });
  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('realisationTime', '0');
  formData.append('presentationImage', presentationImage.value);

  if (videoLinks.value && videoLinks.value.length > 0) {
    formData.append(`links`, JSON.stringify(videoLinks.value));
  }

  await fetch('http://localhost:3001/peluches', {
    method: 'POST',
    body: formData,
  });

};
</script>