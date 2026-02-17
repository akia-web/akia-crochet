<template>
  <div class="flex flex-col md:flex-row gap-4 pb-4">
    <div class="hidden md:block">
      <div class="flex flex-col  min-h-[calc(100vh-200px)] bg-white w-[200px] p-4">
        <ProfilNavComponent :step="step" @newStep="updateStep($event)"></ProfilNavComponent>
      </div>
    </div>
    <div class="block md:hidden ">
      <Select v-model="getStep"
              :options="selectOptions"
              class="w-full">
      </Select>
    </div>
    <div>
      <GeneralInformation v-if="props.step === 'Informations'"></GeneralInformation>
      <ProfileOrderComponent v-if="props.step==='Commandes'"></ProfileOrderComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GeneralInformation from '@/components/Profile/generalInformations/GeneralInformation.vue';
import ProfilNavComponent from '@/components/Nav/ProfileNav/ProfilNavComponent.vue';
import { useRouter } from 'vue-router';
import { PROFILE_ROUTE } from '@/router/routes-name.ts';
import ProfileOrderComponent from '@/components/Profile/order/ProfileOrderComponent.vue';
import { computed } from 'vue';

const props = defineProps<{
  step: string,
}>();

const getStep = computed({
  get: () => props.step,
  set: (value) => {
    router.push({ name: PROFILE_ROUTE, params: { step: value }});
  }
});
const selectOptions = ['Informations', 'Commandes', 'Messages'];

const router = useRouter();

const updateStep = (stepSelected: string) => {
  router.push({ name: PROFILE_ROUTE, params: { step: stepSelected }});
};

</script>