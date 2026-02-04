<template>
  <h1 class="ml-8 mt-4 mb-12">Récap des colis</h1>
  <div class="w-full md:w-[80%] mx-auto shadow-sm">
    <DataTable
        :value="orders"
        dataKey="id"
        v-model:filters="filters"
        v-model:expandedRows="expandedRows"
        v-model:selection="selectedRow"
        selectionMode="single"
        @row-click="onRowClick"
        filterDisplay="row"
        tableStyle="min-width:90%"

    >
      <template #header>
        <span class="text-xl font-bold">Colis</span>
      </template>

      <Column expander style="width: 3rem"/>
      <Column field="createdAt" header="Date">
        <template #body="{ data }">
          <DateComponent :date="data.createdAt"/>
        </template>
      </Column>

      <Column field="status" header="Statut" filterField="status" :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }">
          <div @click.stop
               @mousedown.stop
               @pointerdown.stop>
            <Select
                v-model="filterModel.value"
                :options="optionStateEnum"
                placeholder="Statut"
                class="select-font-10px"
                showClear
                @change="filterCallback()"
            >
              <template #option="slotProps">
                <Tag :value="traductShipmentStateEnum(slotProps.option)"
                     :severity="getSeverityShipmentStatus(slotProps.option)"
                     class="font-size-12px"/>
              </template>
              <template #value="slotProps">
            <span v-if="slotProps.value" class="text-[10px]">
              {{ traductShipmentStateEnum(slotProps.value) }}
            </span>
                <span v-else class="text-[10px]">{{ slotProps.placeholder }}</span>

              </template>
            </Select>
          </div>

        </template>

        <template #body="slotProps">
          <div>
            <Tag class="font-size-12px" :value="traductShipmentStateEnum(slotProps.data.status)"
                 :severity="getSeverityShipmentStatus(slotProps.data.status)" @click="toggle($event, slotProps.data)"/>
            <Popover ref="op">
              <div class="flex flex-col gap-4">
                <div>
                  <p v-for="state in optionStateEnum"
                     @click="selectState(state, slotProps.data)"
                     class="cursor-pointer p-[10px] hover:bg-bgSite hover:text-actionColor"
                     :class="[activeOrder?.status === state? 'bg-actionColor text-white': 'bg-white text-actionColor']">
                    {{ traductShipmentStateEnum(state) }}
                  </p>
                </div>
              </div>
            </Popover>
          </div>

        </template>
      </Column>

      <Column field="carrier"
              header="Transporteur"
              filterField="carrier"
              :showFilterMenu="false">
        <template #body="slotProps">
          <p class="text-xs">{{ slotProps.data.carrier }}</p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value"
                  @change="filterCallback()"
                  :options="transporters"
                  class="select-font-10px"
                  placeholder="Transporteur"
                  :showClear="true">
            <template #option="slotProps">
              <span class="text-[10px]">{{ slotProps.option }}</span>
            </template>
            <template #value="slotProps">
            <span v-if="slotProps.value" class="text-[10px]">
              {{ slotProps.value }}
            </span>
              <span v-else class="text-[10px]">{{ slotProps.placeholder }}</span>

            </template>
          </Select>
        </template>
      </Column>

      <Column header="Nb d'item">
        <template #body="{ data }">
          <p class="text-xs">{{ data.items.length }}</p>
        </template>
      </Column>

      <Column
          field="deliveryAddress.firstName"
          header="Client"
          filterField="deliveryAddress.firstName"
          :showFilterMenu="false"
      >
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              placeholder="Nom client"
              class="inputText-font-10px"
              @input="filterCallback()"
          />
        </template>
        <template #body="{ data }">
          <p class="text-xs">
            {{ data.deliveryAddress.firstName }} - {{ data.deliveryAddress.lastName }}
          </p>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <Button
              label="Annuler"
              class="font-size-12px"
              @click="payTicket(data)"
              v-if="data.shippingLabel !== null"
          />


          <Button
              label="Acheter étiquette"
              class="font-size-12px"
              @click="payTicket(data)"
              v-if="data.shippingLabel === null"
          />
        </template>
      </Column>

      <!-- EXPANDED ROW -->
      <template #expansion="{ data }">
        <div class="w-[80%] mx-auto bg-bgLightGrey">
          <h5 class="font-semibold mb-2">Produits</h5>
          <DataTable :value="data.items">
            <Column header="Image">
              <template #body="slotProps">
                <img :src="slotProps.data.plushieVariant.images[0].url" class="w-[100px]" alt="">
              </template>
            </Column>
            <Column field="name" header="Nom">
              <template #body="slotProps">
                <p class="text-[10px]">{{ slotProps.data.name }}</p>
              </template>
            </Column>
            <Column field="price" header="Prix">
              <template #body="slotProps">
                <p class="text-[10px]">{{ slotProps.data.price / 100 }} €</p>
              </template>
            </Column>
            <Column field="quantity" header="Quantité">
              <template #body="slotProps">
                <p class="text-[10px]">{{ slotProps.data.quantity }}</p>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>

</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import DateComponent from '@/components/Admin/Orders/dateComponent.vue';
import { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';
import { traductShipmentStateEnum } from '@/functions/enum-to-francais.ts';
import { apiGet, apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { ADMIN_ETIQUETTES_ROUTE } from '@/router/routes-name.ts';
import type { ShipmentDto } from '@/interfaces/shipment.dto.ts';

/* STATE */
const orders = ref<ShipmentDto[]>([]);
const expandedRows = ref<Record<string, boolean>>({});
const activeOrder = ref<ShipmentDto | null>(null);
const op = ref();

const selectedRow = ref();

const router = useRouter();
const toast = useToast();

const optionStateEnum = Object.values(ShipmentStatusEnum);
const transporters = [
  'MONR-CpourToi',
  'CHRP-ChronoShoptoShop',
  'POFR-ColissimoAccess'
];

/* FILTERS */
const filters = ref({
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  carrier: { value: null, matchMode: FilterMatchMode.EQUALS },
  'deliveryAddress.firstName': {
    value: null,
    matchMode: FilterMatchMode.CONTAINS
  }
});

/* FETCH */
onMounted(async () => {
  await apiGet(api(env.shipment.crud), 'GET', true).then(response => response.json())
      .then(data => {
        orders.value = data;
        console.warn(data);
      });
});
const getSeverityShipmentStatus = (status: ShipmentStatusEnum) => {
  switch (status) {
    case ShipmentStatusEnum.INPREPARATION:
    case ShipmentStatusEnum.SHIPPED:
      return 'warn';
    case ShipmentStatusEnum.DELIVERED:
      return 'success';
    case ShipmentStatusEnum.LOSED:
    case ShipmentStatusEnum.ERROR:
      return 'danger';
    default:
      return 'warn';
  }
};

/* ACTIONS */
const payTicket = (order: ShipmentDto) => {
  router.push({
    name: ADMIN_ETIQUETTES_ROUTE,
    params: { id: order.id, network: order.carrier }
  });
};

/* STATUS POPOVER */
const toggle = (event: Event, order: ShipmentDto) => {
  activeOrder.value = order;
  op.value.toggle(event);
};

const selectState = async (state: ShipmentStatusEnum, slotprops: any) => {
  if (!activeOrder.value) return;

  activeOrder.value.status = state;

  apiPost(api(env.shipment.updateStatus), 'PATCH', {
    shipmentId: activeOrder.value.id,
    status: state
  }, false, true).then(() => {
    toast.add({
      severity: 'success',
      summary: `Status colis modifié`,
      life: 3000
    });
  })
      .catch(e => toast.add({
        severity: 'error',
        summary: e.message,
        life: 3000
      }));
  op.value.hide();
};


const onRowClick = (event: { data: ShipmentDto }) => {
  const id = event.data.id;
  expandedRows.value = {
    [id]: !expandedRows.value[id]
  };
};

</script>
