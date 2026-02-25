<template>
  <div class="p-[10px]">
    <h1>Adresses</h1>

    <div class="mt-8 w-full xl:w-1/2 mx-auto">
      <Tabs value="0">
        <TabList>
          <Tab value="0">Adresse d'expédition</Tab>
          <Tab value="1">Adresse de renvois</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div class="p-[20px]">
              <ExpeditionAddressComponent :type="TypeAdressEnum.ADMIN_EXPEDITEUR"></ExpeditionAddressComponent>
            </div>

          </TabPanel>
          <TabPanel value="1">
            <div class="p-[20px]">
              <ExpeditionAddressComponent :type="TypeAdressEnum.ADMIN_RESEND"></ExpeditionAddressComponent>
            </div>

          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>


  </div>

</template>
<script lang="ts" setup>
import ExpeditionAddressComponent from '@/components/Admin/config/address/expeditionAddressComponent.vue';
import { TypeAdressEnum } from '@/enum/type-address-enum.ts';
</script>