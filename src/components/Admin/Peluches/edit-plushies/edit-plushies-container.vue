<template class="flex column justify-center">
  <div class="relative w-full h-full">
    <Stepper value="1">
      <StepList>
        <Step value="1">Général</Step>
        <Step value="2">Vidéos</Step>
        <Step value="3">Variants</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="p-[10px]">
            <form1 v-model:name="name"
                   v-model:description="description"
                   v-model:selectedCreator="selectedCreator"
                   v-model:collection="collection"
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
            <form3 v-model:variants="variants">
            </form3>
            <div class="pt-6 flex justify-between">
              <Button label="Précédent"
                      severity="secondary"
                      icon="pi pi-arrow-left"
                      @click="activateCallback('2')"
              />
              <Button :label="id? 'Éditer':'Valider'"
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
    <!--    <div v-if="loading"-->
    <!--        class="bg-[var(&#45;&#45;color-grey-transparent)] absolute w-[100%] h-[100%] top-0 left-0  z-[9999]" >-->
    <!--      <div class="bg-white absolute w-[50%] h-[50vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">-->
    <!--        loading-->
    <!--      </div>-->

    <!--    </div>-->
  </div>

</template>

<script setup lang="ts">
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Form1 from '@/components/Admin/Peluches/edit-plushies/form-1.vue';
import { onMounted, ref, watch } from 'vue';
import Form2 from '@/components/Admin/Peluches/edit-plushies/form-2.vue';
import type { LinkDto } from '@/interfaces/link.dto.ts';
import Form3 from '@/components/Admin/Peluches/edit-plushies/form-3.vue';
import { checkInputIsNotNull, checkInputIsNotNullAndANumber } from '@/functions/check-forms.ts';
import { usePlushieEditStore } from '@/stores/edit-peluche.ts';
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { getImageName, getMimeType, urlToFile } from '@/functions/images.ts';
import { useToast } from 'primevue';
import { useRouter } from 'vue-router';
import { ADMIN_PLUSHIES_ROUTE } from '@/router/routes-name.ts';
import type { PlushieCreatorDto } from '@/interfaces/plushie-creator.dto.ts';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';

const variants = ref<PlushieVariantDto[]>([{
  name: '',
  color: '#000000',
  materials: [],
  imagesFiles: [],
  stock: 0,
  randomId: crypto.randomUUID(),
  images: [],
  price: 0,
  width: 0,
  height: 0,
  weight: 0,
  depth: 0
}]);

const storeEditPeluche = usePlushieEditStore();
const name = ref<string>('');
const description = ref<string>('');
const collection = ref<boolean>(false);
const videoLinks = ref<LinkDto[]>([]);
const isValidName = ref<boolean>(true);
const isValidDescription = ref<boolean>(true);
const isValidPrice = ref<boolean>(true);
const form1IsValid = ref<boolean>(false);
const form3IsValid = ref<boolean>(true);
const toast = useToast();
const router = useRouter();
const selectedCreator = ref<PlushieCreatorDto>();
const loading = ref<boolean>(false);

const id = ref<number | undefined>(undefined);

watch([name, description], ([newName, newDescription]) => {
  const nameIsValid = checkInputIsNotNull(newName);
  const descriptionIsValid = checkInputIsNotNull(newDescription);
  form1IsValid.value = nameIsValid && descriptionIsValid;
  isValidName.value = nameIsValid;
  isValidDescription.value = descriptionIsValid;
});

watch(variants, (newVariant) => {
  form3IsValid.value = newVariant.length > 0 && (newVariant[0].name !== undefined || newVariant[0].name !== '');

});


onMounted(async () => {

  if (storeEditPeluche.peluche) {
    const plushie: PlushieDto = storeEditPeluche.peluche;
    name.value = plushie.name!;
    description.value = plushie.description!;
    videoLinks.value = plushie.links!;
    collection.value = plushie.collection;


    if (plushie.plushieCreator) {
      selectedCreator.value = plushie.plushieCreator;
    }

    if (plushie.plushieVariants) {
      variants.value = plushie.plushieVariants;


      for (const variant of variants.value) {
        const images = [];
        for (const image of variant.images) {
          const newImage = await urlToFile(image.url, getImageName(image.url), getMimeType(image.url));
          images.push({ file: newImage, row: image.row });
        }
        variant.imagesFiles = images;
      }
    }

    storeEditPeluche.updatePeluche(null);
    id.value = plushie.id;
  }

});


const send = async () => {
  const allImage: File[] = [];
  const formData = new FormData();

  for (const variant of variants.value) {
    if (variant.imagesFiles) {
      for (const file of variant.imagesFiles) {
        const isAlreadyPresent = variant.images.some(img => {
          const filename = img.url.split('/images/')[1];
          return (filename === file.file.name) || file.file.name === img.url;
        });

        if (!isAlreadyPresent) {
          allImage.push(file.file);
          variant.images.push({ url: file.file.name, row: file.row });
        }
      }
    }

  }


  allImage.forEach((file) => {
    formData.append('images', file as File);
  });

  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('collection', collection.value.toString());

  if (id.value) {
    formData.append('id', id.value.toString());
  }


  if (videoLinks.value && videoLinks.value.length > 0) {
    formData.append(`links`, JSON.stringify(videoLinks.value));
  }

  if (selectedCreator.value) {
    formData.append('plushieCreator', JSON.stringify(selectedCreator.value));
  }

  formData.append('plushieVariants', JSON.stringify(variants.value));

  const method: 'PATCH' | 'POST' = id.value ? 'PATCH' : 'POST';
  loading.value = true;
  apiPost(api(env.plushies.crud), method, formData, false, true)
      .then(() => {
        toast.add({ severity: 'success', summary: 'Peluche enregistrée', life: 3000 });
        router.push({ name: ADMIN_PLUSHIES_ROUTE });
      })
      .catch(e => {
        toast.add({
          severity: 'error',
          summary: e,
          life: 3000
        });
      });

};
</script>