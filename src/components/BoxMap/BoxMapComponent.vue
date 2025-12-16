<template>
  Je suis la carte
  <p @click="">Selectionnez un transporteur</p>
  <div class="flex flex-col gap-4">
    <Card v-for="parcelPoint in parcelPointsNetwork"
          :key="parcelPoint.name"
          :class="[selectedParcelPointNetwork.name === parcelPoint.name? 'border border-[var(--action-color)]': 'border-transparent']"
          @click="updateConfig(parcelPoint)">
      <template #title>
        {{ parcelPoint.name }}
      </template>
    </Card>
  </div>

  <input v-model="street" placeholder="Rue"/>
  <input v-model="zip" placeholder="Code postal"/>
  <input v-model="city" placeholder="Ville"/>
  <button @click="searchNewAddress">Rechercher</button>
  <div id="boxtal-map" style="height: 80vh; width: 100%;" v-if="street && zip && city"></div>

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { BoxtalParcelPointMap } from '@boxtal/parcel-point-map';

const token = ref();
let map: BoxtalParcelPointMap;
const street = ref('');
const zip = ref('');
const city = ref('');

const parcelPointsNetwork: { code: string, name: string }[] = [
  {
    code: 'CHRP_NETWORK',
    name: 'Chronopost'
  },
  {
    code: 'MONR_NETWORK',
    name: 'MondialeRelais'
  }
];

const selectedParcelPointNetwork = ref<{ code: string, name: string }>(parcelPointsNetwork[0]);

onMounted(async () => {
  try {
    const response = await apiGet(api(env.boxtal.mapToken), 'GET');
    const responseJson = await  response.json()
    // console.warn( responseJson)
    token.value = responseJson.token;

    initMap();
  } catch (err) {
    console.error(err);
  }
});

const initMap = () => {
  map = new BoxtalParcelPointMap({
    debug: true,
    domToLoadMap: '#boxtal-map',
    accessToken: token.value,
    config: {
      parcelPointNetworks: [
        { code: selectedParcelPointNetwork.value.code }
      ],
      options: {
        autoSelectNearestParcelPoint: true,
        primaryColor: '#d52e8c',
      }
    },
    onMapLoaded: () => {
      console.warn(map)
      map.searchParcelPoints(
          { country: 'FR', zipCode: zip.value, city: city.value, street: street.value },
          (parcelPoint: any) => {
            console.log('Point sélectionné', parcelPoint);
          }
      );
    }
  });
};
const searchNewAddress = () => {
  if (!map) return;
  if(!map.iframeElm){
    initMap()
  }else{
    map.searchParcelPoints(
        { country: 'FR', zipCode: zip.value, city: city.value, street: street.value },
        (parcelPoint: any) => {
          console.log('Point sélectionné', parcelPoint);
        }
    );
  }


};

const updateConfig = (parcelPoint: { code: string, name: string }) => {
  selectedParcelPointNetwork.value = parcelPoint;
  map.updateConfig({
    locale: 'fr',
    parcelPointNetworks: [
      { code: selectedParcelPointNetwork.value.code }
    ],
    options: {
      autoSelectNearestParcelPoint: true,
      primaryColor: '#d52e8c',
    }
  });
};


</script>