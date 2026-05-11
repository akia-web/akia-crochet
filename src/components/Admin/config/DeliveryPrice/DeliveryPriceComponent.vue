<template>
  <div class="p-[10px]">
    <div class="flex justify-between">
      <h1 class="text-xl">Points de livraison</h1>
      <div>
        <Button label="Ajouter un transporteur"
                @click="addTransporter(undefined)"/>
      </div>
    </div>


    <Tabs v-if="transporters.length > 0" value="0" class="mt-4">
      <TabList>
        <Tab v-for="transporter in transporters" :key="transporter.id" :value="transporter.value">
          <div class="flex items-center gap-2">
            <h2> {{ transporter.name }}</h2>
            <Button icon="pi pi-pencil" class="h-[25px] p-button-text-action-color-bg-white"
                    @click="addTransporter(transporter)"></Button>
          </div>

        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="transporter in transporters" :key="transporter.id" :value="transporter.value">
          <div class="p-[10px]">
            <form class="flex gap-2 items-center">
              <LabelAndInputNumber v-model:property="form.weight"
                                   label="Poids en grammes"
                                   :propertyRules="v$.weight"
                                   errorMessage="supérieur à 0"
                                   :minFractionDigits="0"
                                   :maxFractionDigits="0"
              />

              <LabelAndInputNumber v-model:property="form.price"
                                   label="Prix en €"
                                   :propertyRules="v$.price"
                                   errorMessage="supérieur à 0"
                                   :minFractionDigits="1"
                                   :maxFractionDigits="2"
              />
              <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>
              <Button :label="`Ajouter`"
                      :disabled="v$.$invalid"
                      class="h-[50px] self-end"
                      @click="addPrice(transporter)"
              />
            </form>

            <DataTable :value="transporter.weightPrice" tableStyle="max-width: 500px"
                       v-if="transporter.weightPrice.length > 0">
              <Column field="weight" header="Poids">
                <template #body="{ data }">
                  <p>{{ data.weight }} g</p>
                </template>
              </Column>
              <Column field="price" header="prix">
                <template #body="{ data }">
                  <PriceValue :data="data"/>
                </template>
              </Column>

              <Column header="Actions">
                <template #body="{ data }">
                  <Button icon="pi pi-trash"
                          @click="deletePrice(data.id, transporter)"
                          class="p-button-white"
                          rounded
                  />
                </template>
              </Column>
            </DataTable>

          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
  <DynamicDialog/>
</template>


<script lang="ts" setup>

import { useDialog } from 'primevue';
import { configOpenDialog } from '@/config/openDialogConfig.ts';
import PopupUpdateTransporter from '@/components/Admin/config/DeliveryPrice/popup/PopupUpdateTransporter.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { TransporterDto } from '@/interfaces/transporter.dto.ts';
import type { DynamicDialogCloseOptions } from 'primevue/dynamicdialogoptions';
import { minValue, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import LabelAndInputNumber from '@/components/FormComponents/LabelAndInputNumber.vue';
import type { WeightPriceDto } from '@/interfaces/weight-price.dto.ts';
import { useToast } from 'primevue/usetoast';
import PriceValue from '@/components/Admin/config/DeliveryPrice/priceValue.vue';

const dialog = useDialog();
const toast = useToast();
const transporters = ref<TransporterDto[]>([]);
const form = reactive({
  weight: 0,
  price: 0,
  checked: false,
});

const rules = computed(() => ({
  weight: { required, minValue: minValue(1) },
  price: { required, minValue: minValue(1) },

}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

const addTransporter = (transporter: TransporterDto | undefined) => {
  dialog.open(PopupUpdateTransporter, {
    props: configOpenDialog(`Ajouter un nouveau transporteur`, true, '50%'),
    data: transporter,
    onClose: async (options?: DynamicDialogCloseOptions) => {
      if (options?.data) {
        if (options.data.action === 'recharge') {
          await getPrice();
        }
      }
    }
  });
};

onMounted(async () => {
  await getPrice();
});


const getPrice = async () => {
  await apiGet(api(env.transporter.crud), 'GET', true).then(response => response.json())
      .then((data: TransporterDto[]) => {
        if (data) {
          transporters.value = data.map((t, index) => ({
            ...t,
            value: index.toString()
          }));
        }
      });
};
const addPrice = async (transporter: TransporterDto) => {
  const newPrice: WeightPriceDto = {
    weight: form.weight,
    price: Math.round(form.price * 100),
    checked: form.checked,
    transporter: transporter.id
  };
  await apiPost(api(env.transporter.price), 'POST', newPrice, false, true)
      .then(async () => {
        toast.add({
          severity: 'success',
          summary: `Prix ajouté`,
          life: 3000
        });
        await getPrice();
      }).catch((err) => {
        toast.add({
          severity: 'error',
          summary: err,
          life: 3000
        });
      });
};

const deletePrice = async (priceId: number, transporter: TransporterDto) => {

  await apiGet(`${api(env.transporter.price)}?id=${priceId}`, 'DELETE', true)
      .then(response => response.json())
      .then((e: WeightPriceDto[]) => {
        toast.add({
          severity: 'success',
          summary: `Prix supprimé`,
          life: 3000
        });
        const findTransporterIndex = transporters.value.findIndex((element) => element.id === transporter.id);
        if (findTransporterIndex >= 0) {
          transporters.value[findTransporterIndex].weightPrice = e;
        }
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
};

</script>