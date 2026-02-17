<template>
  <div class="p-[20px] absolute">
    <h1>Création d'étiquettes</h1>
    <form>
      <div class="w-[100%]">
        <BoxMapComponent :livraisonOption="network"
                         country="fr"
                         v-model:selectedParcelPoint="form.selectedParcelPoint"
                         street="rue Jean Jaures"
                         numberStreet="21 bis"
                         postalCode="76500"
                         city="Elbeuf"
                         :activeSearch="true"
                         operationType="ARRIVAL"
                         v-show="!loading"
        />
      </div>

      <h2 class="mt-4 font-bold">Mesures</h2>
      <div class="flex flex-wrap gap-4 mt-2">
        <LabelAndInputNumber v-model:property="form.width"
                             label="2ème côté le plus long (cm)"
                             :propertyRules="v$.width"
                             errorMessage="supérieur à 0"
                             :minFractionDigits="0"
                             :maxFractionDigits="0"
        />

        <LabelAndInputNumber v-model:property="form.height"
                             label="Côté le plus court (cm)"
                             :propertyRules="v$.height"
                             errorMessage="supérieur à 0"
                             :minFractionDigits="0"
                             :maxFractionDigits="0"/>

        <LabelAndInputNumber v-model:property="form.length"
                             label="Côté le plus long (cm)"
                             :propertyRules="v$.length"
                             errorMessage="supérieur à 0"
                             :minFractionDigits="0"
                             :maxFractionDigits="0"/>

        <LabelAndInputNumber v-model:property="form.weight"
                             :propertyRules="v$.weight"
                             errorMessage="supérieur à 0.1"
                             label="Poids (kg)"
                             :minFractionDigits="2"
                             :maxFractionDigits="2"/>
      </div>

      <div class="flex mt-3 gap-4">
        <div>
          <p>Date de livraison</p>
          <DatePicker v-model="form.date" dateFormat="dd/mm/yy" :minDate="minDate"  />
        </div>

        <div class="flex items-center gap-2 ">
          <Checkbox v-model="form.isInsured" binary id="insured"/>
          <label for="insured">Assurance</label>
        </div>

      </div>


    </form>
    <div class="flex row-reverse gap-4 mt-6">
      <Button label="Valider" :disabled="v$.$invalid" @click="save"/>
      <Button label="Annuler" @click="close" severity="secondary"/>

    </div>
  </div>
  <div v-if="loading" class="w-50% bg-white h-[90vh] relative top-0 left-0">
    <div class="w-full flex flex-col justify-center items-center h-full">
      <img src="@/assets/icones/quokka-cookie.gif" class="w-[200px]" alt="">
      <p class="mt-4">Envois des données...</p>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import { checkInputIsNotNull } from '@/functions/check-forms.ts';
import { SocialMediaEnum } from '@/enum/social-media.ts';
import LabelAndInputText from '@/components/FormComponents/LabelAndInputText.vue';
import LabelAndInputNumber from '@/components/FormComponents/LabelAndInputNumber.vue';
import BoxMapComponent from '@/components/BoxMap/BoxMapComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { email, maxLength, minValue, required, requiredIf } from '@vuelidate/validators';
import { phoneByCountry } from '@/validators/phone-validators.ts';
import type { CountryCode } from 'libphonenumber-js';
import { useVuelidate } from '@vuelidate/core';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { ADMIN_ORDERS_ROUTE, ADMIN_PLUSHIES_ROUTE } from '@/router/routes-name.ts';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const toast = useToast();
const router = useRouter();
const id = route.params.id;
const network = route.params.network as string;
const loading = ref(false);
const minDate = new Date();

const form = reactive({
  id: 0,
  width: 0,
  height: 0,
  length: 0,
  weight: 0,
  selectedParcelPoint: {
    code: '',
    location: {
      city: '',
      country: '',
      position: { longitude: '', latitude: '' },
      street: '',
      postalCode: ''
    },
    name: '',
  },
  carrier: 'MONR-CpourToi',
  date: new Date(),
  isInsured: false,
  checked: false,
});

const rules = computed(() => ({
  id: { required },
  width: { required, minValue: minValue(1) },
  height: { required, minValue: minValue(1) },
  length: { required, minValue: minValue(1) },
  weight: { required, minValue: minValue(0.01) },
  selectedParcelPoint: {
    notEmptyObject: (value: any) => {
      return value && value.code && value.code !== '';
    }
  },
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });


onMounted(() => {
  form.id = Number(id);
});


const close = () => {

};

const save = () => {
  loading.value = true;

  const data = {
    id: form.id,
    width: form.width,
    height: form.height,
    length: form.length,
    weight: form.weight,
    parcelPoint: form.selectedParcelPoint.code,
    carrier: 'MONR-CpourToi',
    isInsured: form.isInsured,
    checked: form.checked,
    date: form.date

  };

  apiPost(api(env.boxtal.createEtiquette), 'POST', data, false, true)
      .then(() => {
        toast.add({ severity: 'success', summary: 'Étiquette créer', life: 3000 });
        router.push({ name: ADMIN_ORDERS_ROUTE });
      })
      .catch(e => {
        toast.add({
          severity: 'error',
          summary: e,
          life: 3000
        });
      }).finally(() => {
    loading.value = false;
  });


};

</script>