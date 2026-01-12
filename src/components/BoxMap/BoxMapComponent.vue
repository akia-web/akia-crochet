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
                         :value="{name: parcelPoint.name, code: parcelPoint.code}"
                         @click="updateConfig(parcelPoint.code)"/>
            <label :for="'parcel-'+index" class="mr-4">{{ parcelPoint.name }}</label>
          </div>

          <div class="flex items-center gap-2">
            <RadioButton v-model="livraisonOption"
                         inputId="domicile"
                         name="domicile"
                         :value="{name: 'domicile', code: 'domicile'}"
                         @click="updateConfig('domicile')"/>
            <label for="domicile" class="mr-4">Domicile</label>
          </div>

        </div>
      </template>
    </Card>

    <div v-show="showRelayDetails"
         class="mt-4 flex flex-col md:flex-row md:flex-wrap mb-4">
      <InputText
          v-model="form.street"
          class="md:w-[25%]"
          placeholder="Rue"/>
      <InputText
          v-model="form.zipCode"
          class="md:w-[25%]"
          placeholder="Code postal"/>

      <InputText
          v-model="form.city"
          class="md:w-[25%]"
          placeholder="Ville"/>

      <Button label="Rechercher un relais"
              @click="search"
              :disabled="v$.$invalid"
              class="md:w-[25%]"/>

      <div id="boxtal-map"
           style="height: 50vh; width: 100%;"
           class="mt-4">
      </div>
      <div v-if="selectedParcelPoint && selectedParcelPoint.code !==''"
      class="mt-4">
        <p class="underline">point relais selectionné :</p>
        <p> {{ selectedParcelPoint.name }}</p>
        <p> {{ selectedParcelPoint.location.street }} - {{ selectedParcelPoint.location.zipCode }} -
          {{ selectedParcelPoint.location.city }} </p>
      </div>

    </div>
  </div>

</template>
<script lang="ts" setup>
import { computed, onMounted, type PropType, reactive, ref, watch } from 'vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { BoxtalParcelPointMap, type ParcelPoint } from '@boxtal/parcel-point-map';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { ParcelPointDto } from '@/interfaces/parcel-point.dto.ts';

const token = ref();
let map: BoxtalParcelPointMap;

const form = reactive({
  street: '',
  zipCode: '',
  city: '',
});

const rules = computed(() => ({
  street: { required },
  zipCode: { required },
  city: { required },
}));

const v$ = useVuelidate(rules, form);

const props = defineProps({
  livraisonOption: Object,
  deliveryAddressCountry: Object,
  selectedParcelPoint: Object
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

const deliveryAddressCountry = computed(() => props.deliveryAddressCountry);


//FIXME allemagne pas de mondial relais mais chronopte oui
const parcelPointsNetwork: { code: string, name: string }[] = [
  {
    code: 'MONR_NETWORK',
    name: 'Mondial Relais'
  },
  {
    code: 'CHRP_NETWORK',
    name: 'Chronopost'
  },

];

onMounted(async () => {
  try {
    const response = await apiGet(api(env.boxtal.mapToken), 'GET');
    const responseJson = await response.json();
    token.value = responseJson.token;
    if (!livraisonOption.value?.code) {
      livraisonOption.value = { name: 'Mondial Relais', code: 'MONR_NETWORK' };
    }
    initMap();
  } catch (err) {
    console.error(err);
  }
});


const initMap = () => {
  const parcelPointNetwork = [{ code: livraisonOption.value?.code }];
  map = new BoxtalParcelPointMap({
    debug: false,
    domToLoadMap: '#boxtal-map',
    accessToken: token.value,
    config: {
      locale: 'fr',
      parcelPointNetworks: parcelPointNetwork,
      options: {
        autoSelectNearestParcelPoint: true,
        primaryColor: '#d52e8c',
      }
    },
  });
};


const search = () => {
  map.searchParcelPoints(
      { country: deliveryAddressCountry.value?.code, zipCode: form.zipCode, city: form.city, street: form.street },
      (parcelPoint: any) => {
        selectedParcelPoint.value = parcelPoint;
        console.warn(parcelPoint);
        zoomOnParcelPoint(parcelPoint);
      }
  );

};

const zoomOnParcelPoint = (point: any) => {
  console.warn('lala')
  if (!map.map) return;

  const lngLat = [point.position.longitude, point.position.latitude];

  map.map.flyTo({
    center: lngLat,
    zoom: 20,       // niveau de zoom désiré
    speed: 1.2,     // vitesse de l’animation
    curve: 1,       // fluidité de l’animation
  });

  // Ouvrir la popup si elle existe
  if (point.popup) {
    point.popup.addTo(map.map);
  }
};

const updateConfig = (code: string) => {
  console.log('update config', code);

  if (code !== 'domicile') {
    map.updateConfig({
      locale: 'fr',
      parcelPointNetworks: [
        { code }
      ],
      options: {
        autoSelectNearestParcelPoint: true,
        primaryColor: '#d52e8c',
      }
    });
  }
};

const showRelayDetails = computed(() => {
  return (
      !!livraisonOption.value?.name &&
      livraisonOption.value.name !== 'domicile'
  );
});

watch(deliveryAddressCountry, (newValue) => {
  form.street = '';
  form.city = '';
  form.zipCode = '';
  selectedParcelPoint.value = {};
  map.clearParcelPoints();
});

</script>