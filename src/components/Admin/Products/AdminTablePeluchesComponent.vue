<template>

  <div class="p-[10px]">
    <div class="flex w-100 row-reverse">
      <Button label="Ajouter"
              @click="goToAddPeluche"
              class="p-button-action mr-2"
              icon="pi pi-plus">
      </Button>
    </div>

    <div class="flex flex-wrap justify-center md:justify-normal gap-6 mt-6">
      <div v-for="item in products" :key="item.id" class="">
        <PlushieDetailComponent :product="item"
                                @edit="editProduct"
                                @delete="deletePlushie">
        </PlushieDetailComponent>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { ProductDto } from '@/interfaces/product.dto.ts';
import { onMounted, ref } from 'vue';
import { usePlushieEditStore } from '@/stores/edit-product.ts';
import { apiGet } from '@/services/request-service.ts';
import { ADMIN_ADD_PLUSHIES_ROUTE } from '@/router/routes-name.ts';
import PlushieDetailComponent from '@/components/Admin/Products/AdminPlushieDetailComponent.vue';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

const storeEditPeluche = usePlushieEditStore();

const router = useRouter();

const products = ref<ProductDto[]>([]);

const goToAddPeluche = () => {
  router.push({ name: ADMIN_ADD_PLUSHIES_ROUTE });
};

onMounted(async () => {
  await getPeluches('tous les produits');
});

const getPeluches = async (category: string): Promise<any> => {
  apiGet(api(env.products.crud), 'GET')
      .then(response => response.json())
      .then(data => {
        products.value = data;
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
};

const editProduct = (product: ProductDto) => {
  storeEditPeluche.updatePeluche(product);
  goToAddPeluche();
};

const deletePlushie = (product: ProductDto) => {
  apiGet(`${api(env.products.crud)}?id=${product.id}`, 'DELETE', true)
      .then(response => response.json())
      .then(products.value = products.value.filter((element) => element.id !== product.id))
      .catch(error => {
        console.error('Erreur :', error);
      });
};


</script>

<style src="./style.css" scoped></style>