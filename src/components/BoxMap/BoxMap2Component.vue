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

      <div class="mt-2">
        <div v-show="stepMap === 'noSetUp'"
             class="h-[50vh] w-full flex justify-center items-center bg-[var(--light-grey)]">
          <div class="flex flex-col items-center">
            <img src="@/assets/icones/quokka-yeux-fermer-qui-souris.png"
                 alt="logo quokka qui souris"
                 class="w-[150px] mb-8">
            <p class="text-center p-[10px]"> Remplis ton adresse pour chercher un point relais !</p>

          </div>
        </div>

        <div v-show="stepMap === 'error'"
             class="h-[50vh] w-full flex justify-center items-center bg-[var(--light-grey)]">
          <div class="flex flex-col items-center">
            <img src="@/assets/icones/quokka-oh-no.png"
                 alt="logo quokka confus"
                 class="w-[150px] mb-8">
            <p class="text-center p-[10px]"> une erreur s'est produite ! <br> vérifie ton adresse !</p>

          </div>
        </div>


        <div v-show="stepMap === 'pending'"
             class="h-[50vh] w-full flex justify-center items-center bg-[var(--light-grey)]">
          <div class="flex flex-col items-center">
            <img src="@/assets/icones/quokka-cookie.gif"
                 alt="logo quokka qui mange un cookie"
                 class="w-[150px] mb-8">
            <p class="text-center"> En attente des données !</p>

          </div>
        </div>


        <div v-show="stepMap==='ok'">
          <div id="map"

               style="height: 50vh; width: 100%;"
               class="mt-4">
          </div>
          <div v-if="selectedParcelPoint && selectedParcelPoint.code !==''"
               class="mt-4">
            <p class="underline">point relais selectionné :</p>
            <p> {{ selectedParcelPoint.name }}</p>
            <p> {{ selectedParcelPoint.location.street }} - {{ selectedParcelPoint.location.postalCode }} -
              {{ selectedParcelPoint.location.city }} </p>
          </div>
        </div>
      </div>


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

const token = ref();

const { updateLivraisonPrice } = useProductsCartStore();

const markers: maplibregl.Marker[] = [];

let map = ref<maplibregl.Map | null>(null);

const form = reactive({
  street: '',
  postalCode: '',
  city: '',
});

const stepMap = ref<'pending' | 'ok' | 'error' | 'noSetUp'>('noSetUp');

const rules = computed(() => ({
  street: { required },
  postalCode: { required },
  city: { required },
}));

const v$ = useVuelidate(rules, form);

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

const deliveryAddressCountry = computed(() => props.deliveryAddressCountry);

const parcelPointList = ref<ParcelPointWithDistanceDto[]>([]);

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

onMounted(async () => {
  try {
    const response = await apiGet(api(env.boxtal.mapToken), 'GET');
    const responseJson = await response.json();
    token.value = responseJson.token;

    if (!livraisonOption.value?.code) {
      livraisonOption.value = { name: 'Mondial Relais', code: 'MONR-CpourToi' };
    }
  } catch (err) {
    console.error(err);
  }
});


const fetchParcelPoints = async () => {
  stepMap.value = 'pending';
  if (props.street && props.city && props.postalCode) {
    const params = new URLSearchParams({
      street: `${props.numberStreet ? props.numberStreet : ''} ${props.street}`,
      city: props.city,
      postalCode: props.postalCode,
      countryIsoCode: 'FR',
      operationType: 'DEPARTURE',
      shippingOfferCode: livraisonOption.value?.code
    });

    const url = `https://api.boxtal.build/shipping/v3.2/parcel-point-by-shipping-offer?${params}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        stepMap.value = 'error';
      }

      const data = await response.json();
      parcelPointList.value = data.content;
      selectedParcelPoint.value = parcelPointList.value[0].parcelPoint;
      stepMap.value = 'ok';
    } catch (err) {
      stepMap.value = 'error';
    }
  }


};


const search = async () => {
  await fetchParcelPoints();
  if (!map.value) {
    map.value = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      zoom: 14,
      center: [
        parcelPointList.value[0].parcelPoint.location.position.longitude,
        parcelPointList.value[0].parcelPoint.location.position.latitude
      ]
    });

    map.value.on('load', () => {

      addMarkers();
    });
  } else {
    addMarkers();
  }
};

const clearMarkers = () => {
  markers.forEach(m => m.remove());
  markers.length = 0;
};

const recenterOnFirstParcelPoint = () => {
  if (!map.value || parcelPointList.value.length === 0) return;

  const p: ParcelPointDtoBoxtal = parcelPointList.value[0].parcelPoint;

  map.value.flyTo({
    center: [
      p.location.position.longitude,
      p.location.position.latitude
    ],
    zoom: 14,
    duration: 2000
  });
};

const addMarkers = () => {
  clearMarkers();

  parcelPointList.value.forEach((p: ParcelPointWithDistanceDto) => {
    const lngLat: [number, number] = [
      p.parcelPoint.location.position.longitude,
      p.parcelPoint.location.position.latitude
    ];
    const popup = createPopup(p);

    const marker = new maplibregl.Marker()
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map.value!);

    if (selectedParcelPoint.value && selectedParcelPoint.value.code === p.parcelPoint.code) {
      marker.addClassName('marker-actif');
      popup.addTo(map.value!);
    } else {
      marker.addClassName('marker-inactif');
    }

    markers.push(marker);

    marker.getElement().addEventListener('click', () => {
      selectedParcelPoint.value = p.parcelPoint;
      const currentRed = markers.find(m =>
          m.getElement().classList.contains('marker-actif')
      );
      if (currentRed) {
        currentRed.getElement().classList.remove('marker-actif');
        currentRed.getElement().classList.add('marker-inactif');
      }

      marker.getElement().classList.remove('marker-inactif');
      marker.getElement().classList.add('marker-actif');

      map.value!.flyTo({ center: lngLat, zoom: 14 });
    });
  });

  recenterOnFirstParcelPoint();
};

const createPopup = (p: any) => {
  const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
      .setLngLat([
        p.parcelPoint.location.position.longitude,
        p.parcelPoint.location.position.latitude
      ])
      .setHTML(`
        <div style="
          background:white;
          padding:12px;
          border-radius:8px;
          position: relative;
          min-width: 120px;
          max-width: 130px;
        ">
          <strong>${p.parcelPoint.name}</strong><br/>
          ${p.parcelPoint.location.street} - ${p.parcelPoint.location.postalCode} ${p.parcelPoint.location.city}
          <button class="popup-close" style="
            position: absolute;
            top: -12px;
            right: -6px;
            border:none;
            background:#803256;
            color:white;
            font-weight:bold;
            font-size:15px;
            width:24px;
            height:24px;
            border-radius:50%;
            cursor:pointer;
          ">&times;</button>
        </div>
      `);

  popup.on('open', () => {
    const btn = popup.getElement().querySelector('.popup-close') as HTMLButtonElement;
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.remove();
    });
  });


  return popup;
};

const showRelayDetails = computed(() => {
  return (
      !!livraisonOption.value?.name &&
      livraisonOption.value.name !== 'Domicile'
  );
});

watch(deliveryAddressCountry, (newValue) => {
  form.street = '';
  form.city = '';
  form.postalCode = '';
  selectedParcelPoint.value = {};
});

watch(livraisonOption, async (newValue) => {
      if (newValue) {
        const priceLivraison = newValue.supplement;
        const priceTogether = !props.isSendTogether ? newValue.supplement : 0;
        updateLivraisonPrice(priceLivraison + priceTogether);
      }

      if (newValue && newValue.name === 'Domicile' && selectedParcelPoint.value) {
        selectedParcelPoint.value.code = '';
      } else {
        if (props.street !== '' && props.city !== '' && props.postalCode !== '') {
          return await search();
        }
      }
    }
);

</script>