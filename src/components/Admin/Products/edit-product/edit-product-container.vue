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
            <form1 v-model:name="form1.name"
                   v-model:description="form1.description"
                   v-model:creator="form1.creator"
                   v-model:collection="form1.collection"
                   v-model:isVisible="form1.isVisible"
                   :v$="v1$"
            >
            </form1>
            <div class="flex pt-6 justify-end">
              <Button label="Suivant"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      :disabled="v1$.$invalid"
                      @click="activateCallback('2')"/>
            </div>
          </div>

        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="p-[10px]">
            <form2 v-model:links="form2.links"></form2>
            <div class="flex pt-6 justify-between">
              <Button label="Précédent" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')"/>
              <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')"/>
            </div>
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="p-[10px]">
            <form3 v-model:variants="form3.variants">
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
import Form1 from '@/components/Admin/Products/edit-product/form-1.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Form2 from '@/components/Admin/Products/edit-product/form-2.vue';
import type { LinkDto } from '@/interfaces/link.dto.ts';
import Form3 from '@/components/Admin/Products/edit-product/form-3.vue';
import { usePlushieEditStore } from '@/stores/edit-product.ts';
import type { ProductDto } from '@/interfaces/product.dto.ts';
import { getImageName, getMimeType, urlToFile } from '@/functions/images.ts';
import { useToast } from 'primevue';
import { useRoute, useRouter } from 'vue-router';
import { ADMIN_PLUSHIES_ROUTE } from '@/router/routes-name.ts';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto.ts';
import type {
  Form1EditProductDto
} from '@/components/Admin/Products/edit-product/interfaces/form1-edit-product.dto.ts';
import { minLength, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import type { HomeConfigDto } from '@/interfaces/home-config.dto.ts';

// const variants = ref<ProductVariantDto[]>([{
//   name: '',
//   color: '#000000',
//   materials: [],
//   imagesFiles: [],
//   stock: 0,
//   randomId: crypto.randomUUID(),
//   images: [],
//   price: 0,
//   width: 0,
//   height: 0,
//   weight: 0,
//   depth: 0
// }]);

const storeEditPeluche = usePlushieEditStore();
// const videoLinks = ref<LinkDto[]>([]);
// const isValidPrice = ref<boolean>(true);
// const form1IsValid = ref<boolean>(false);
const form3IsValid = ref<boolean>(true);
const toast = useToast();
const router = useRouter();
const loading = ref<boolean>(false);
const id = ref<number | undefined>(undefined);

const route = useRoute();

const form1 = reactive<Form1EditProductDto>({
  name: '',
  description: '',
  creator: undefined,
  collection: false,
  isVisible: true,
});

const rules = computed(() => ({
  name: { required, minLength: minLength(4) },
  description: { required, minLength: minLength(4) },
}));

const form2 = reactive<{ links: LinkDto[] }>({
  links: [],
});

const form3 = reactive<{ variants: ProductVariantDto[] }>({
  variants: [],
});

watch(form3.variants, (newVariant) => {
  form3IsValid.value = newVariant.length > 0 && (newVariant[0].name !== undefined || newVariant[0].name !== '');

});

const v1$ = useVuelidate(rules, form1, { $autoDirty: true });

onMounted(async () => {
  if (route.query && route.query.id) {
    await apiGet(`${api(env.products.byId)}?id=${route.query.id}`, 'GET', true)
        .then(response => response.json())
        .then(async (data: ProductDto) => {
          id.value = data.id;
          form1.name = data.name ? data.name : '';
          form1.description = data.description ? data.description : '';
          form1.creator = data.creator;
          form1.collection = data.collection;
          form1.isVisible = data.isVisible;
          form2.links = data.links ? data.links : [];

          if (data.productVariants) {
            form3.variants = data.productVariants;
            for (const variant of form3.variants) {
              const images: { file: File, row: number }[] = [];
              for (const image of variant.images) {
                const newImage = await urlToFile(image.url, getImageName(image.url), getMimeType(image.url));
                images.push({ file: newImage, row: image.row });
              }
              variant.imagesFiles = images;
            }
          }
        })
        .catch(e => {
          toast.add({
            severity: 'error',
            summary: e,
            life: 3000
          });
        });
  }


  // if (storeEditPeluche.product) {
  //   const product: ProductDto = storeEditPeluche.product;
  //   form1.name = product.name!;
  //   form1.description = product.description!;
  //   videoLinks.value = product.links!;
  //   form1.collection = product.collection;
  //
  //
  //   if (product.creator) {
  //     form1.creator = product.creator;
  //   }
  //
  //   if (product.productVariants) {
  //     variants.value = product.productVariants;
  //
  //
  //     for (const variant of variants.value) {
  //       const images = [];
  //       for (const image of variant.images) {
  //         const newImage = await urlToFile(image.url, getImageName(image.url), getMimeType(image.url));
  //         images.push({ file: newImage, row: image.row });
  //       }
  //       variant.imagesFiles = images;
  //     }
  //   }
  //
  //   storeEditPeluche.updatePeluche(null);
  //   id.value = product.id;
  // }

})
;


const send = async () => {
  const allImage: File[] = [];
  const formData = new FormData();

  for (const variant of form3.variants) {
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

  formData.append('name', form1.name);
  formData.append('description', form1.description);
  formData.append('collection', form1.collection.toString());
  formData.append('isVisible', form1.isVisible.toString());

  if (id.value) {
    formData.append('id', id.value.toString());
  }


  if (form2.links.length > 0) {
    formData.append(`links`, JSON.stringify(form2.links));
  }

  if (form1.creator) {
    formData.append('creator', JSON.stringify(form1.creator));
  }

  formData.append('productVariants', JSON.stringify(form3.variants));

  const method: 'PATCH' | 'POST' = id.value ? 'PATCH' : 'POST';
  loading.value = true;
  apiPost(api(env.products.crud), method, formData, false, true)
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