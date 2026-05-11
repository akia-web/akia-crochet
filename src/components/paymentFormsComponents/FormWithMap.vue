<template>
  <div class="mb-4" v-if="storeProductsCart.productsCart.length > 0">
    <Card class="mt-4">
      <template #title>
        Options de livraison
      </template>
      <template #content>
        <div class="flex flex-wrap gap-2">
          <div class="flex items-center gap-2" v-for="(parcelPoint, index) in parcelPointsNetwork">
            <RadioButton v-model="livraisonOption"
                         :inputId="'parcel-'+index"
                         :name="parcelPoint.name"
                         :value="parcelPoint"/>
            <label :for="'parcel-'+index" class="mr-4">{{ parcelPoint.name }}
              <span>{{calculatePriceParcelPoint(parcelPoint)}} €</span>
            </label>
          </div>
        </div>
      </template>
    </Card>

    <div v-show="showRelayDetails">
      <div class="mt-4 bg-gray-50 p-[10px]" v-if="activatedActiveSearch">
        <p>Vous pouvez choisir un relais dans une autre ville que celle précédemment saisie en renseignant les champs
          ci-dessous :</p>
        <div class="flex flex-wrap gap-2 mt-4">
          <LabelAndInputText v-model:property="city"
                             label="Ville"/>
          <LabelAndInputText v-model:property="postalCode"
                             label="Code postal"/>
        </div>

      </div>
      <Button label="Rechercher un relais"
              @click="search"
              :disabled="!validForm"
              class="w-full mt-4"/>


      <BoxMapComponent :livraisonOption="livraisonOption?.code"
                       country="fr"
                       v-model:selectedParcelPoint="selectedParcelPoint"
                       v-model:activeSearch="activeSearch"
                       :street="props.street"
                       :numberStreet="props.numberStreet"
                       :postalCode="getBoxtalPostalCode"
                       :city="getBoxtalCity"
                       operationType="DEPARTURE"
      />
    </div>
  </div>

</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import BoxMapComponent from '@/components/BoxMap/BoxMapComponent.vue';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import type { TransporterDto } from '@/interfaces/transporter.dto.ts';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { calculateLivraisonPrice } from '@/components/paymentFormsComponents/functions/calculate-livraison-price.ts';

const token = ref();

const storeProductsCart = useProductsCartStore();

const activeSearch = ref<boolean>(false);

const validForm = computed(() => {
  return props.street !== '' && props.city !== '' && props.postalCode !== '' && props.livraisonOption?.code;
});

const city = ref('');
const postalCode = ref('');

//if button is already pressed
const activatedActiveSearch = ref(false);

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

const getBoxtalPostalCode = computed(() => postalCode.value || props.postalCode);
const getBoxtalCity = computed(() => city.value || props.city);

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

const parcelPointsNetwork = ref<TransporterDto[]>([]);

onMounted(async () => {
  await apiGet(api(env.transporter.crud), 'GET', true).then(response => response.json())
      .then((data: TransporterDto[]) => {
        parcelPointsNetwork.value = data;
      });
});

const calculatePriceParcelPoint = (parcelPoint: TransporterDto) => {
  return calculateLivraisonPrice(storeProductsCart.productsCart, parcelPoint)
}


const showRelayDetails = computed(() => {
  return (
      !!livraisonOption.value?.code &&
      livraisonOption.value.code !== 'POFR-ColissimoAccess'
  );
});

const search = () => {
  activatedActiveSearch.value = true;
  activeSearch.value = true;
};

</script>