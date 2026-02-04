<template>
  <div class="mb-4">
    <Card class="mt-4">
      <template #title>
        Option de livraison
      </template>
      <template #content>
        <div class="flex flex-wrap gap-2">
          <div class="flex items-center gap-2" v-for="(parcelPoint, index) in parcelPointsNetwork">
            <RadioButton v-model="livraisonOption"
                         :inputId="'parcel-'+index"
                         :name="parcelPoint.name"
                         :value="{name: parcelPoint.name, code: parcelPoint.code, supplement: parcelPoint.supplement}"/>
            <label :for="'parcel-'+index" class="mr-4">{{ parcelPoint.name }}
              <span v-if="parcelPoint.name === 'Domicile'"
                    class="text-xs italic">+(5 euros)</span>
            </label>
          </div>
        </div>
      </template>
    </Card>

    <div v-show="showRelayDetails">
      <Button label="Rechercher un relais"
              @click="search"
              :disabled="!validForm"
              class="w-full mt-1"/>

      <BoxMapComponent :livraisonOption="livraisonOption?.code"
                       country="fr"
                       v-model:selectedParcelPoint="selectedParcelPoint"
                       v-model:activeSearch="activeSearch"
                       :street="props.street"
                       :numberStreet="props.numberStreet"
                       :postalCode="props.postalCode"
                       :city="props.city"
                       operationType="DEPARTURE"
      />


    </div>
  </div>

</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import maplibregl, { Marker } from 'maplibre-gl';


import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { ParcelPointDtoBoxtal, ParcelPointWithDistanceDto } from '@/interfaces/parcel-point-dto.boxtal.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import BoxMapComponent from '@/components/BoxMap/BoxMapComponent.vue';

const token = ref();

const { updateLivraisonPrice } = useProductsCartStore();

const activeSearch = ref<boolean>(false);

const validForm = computed(() => {
  return props.street !== '' && props.city !== '' && props.postalCode !== '';
});

const props = defineProps({
  livraisonOption: Object,
  deliveryAddressCountry: Object,
  selectedParcelPoint: Object,
  street: String,
  numberStreet: String,
  postalCode: String,
  city: String,
  isSendTogether: Boolean,
});

const emit = defineEmits([
  'update:livraisonOption',
  'update:selectedParcelPoint',
]);

const livraisonOption = computed({
  get: () => props.livraisonOption,
  set: value => emit('update:livraisonOption', value)
});

const selectedParcelPoint = computed({
  get: () => props.selectedParcelPoint,
  set: value => emit('update:selectedParcelPoint', value)
});

const parcelPointsNetwork: { code: string, name: string, supplement: number }[] = [
  {
    name: 'Mondial Relais',
    code: 'MONR-CpourToi',
    supplement: 0
  },
  {
    code: 'CHRP-ChronoShoptoShop',
    name: 'Chronopost',
    supplement: 0
  },
  {
    code: 'POFR-ColissimoAccess',
    name: 'Domicile',
    supplement: 5
  },
];

const showRelayDetails = computed(() => {
  return (
      !!livraisonOption.value?.name &&
      livraisonOption.value.name !== 'Domicile'
  );
});

const search = () => {

  activeSearch.value = true;
}

watch(livraisonOption, async (newValue) => {
      if (newValue) {
        const priceLivraison = newValue.supplement;
        const priceTogether = !props.isSendTogether ? newValue.supplement : 0;
        updateLivraisonPrice(priceLivraison + priceTogether);
      }
    }
);

</script>