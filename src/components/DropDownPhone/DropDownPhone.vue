<template>
  <div>
    <div class="flex">
      <label for="deliveryForm" class="text-xs font-bold mb-1">Numéro du destinataire *</label>
      <p v-if="propertyRules?.$error"
         class="text-actionColor text-xs font-bold">
        {{errorMessage }}
      </p>
    </div>

      <div class="flex flex-wrap">
        <Select
            v-if="countryList.length > 0"
            v-model="selectedCountry"
            :options="countryList"
            optionLabel="name"
            placeholder="Select a country"
            class="w-full md:w-[30%]"
            filter>
          <template #option="slotProps">
            <div v-if="slotProps.option" class="flex items-center">
              <img
                  :src="`https://flagcdn.com/16x12/${slotProps.option.code.toLowerCase()}.png`"
                  :alt="slotProps.option.name"
                  class="mr-2"
              />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>

          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <img
                  :src="`https://flagcdn.com/16x12/${slotProps.value.code.toLowerCase()}.png`"
                  :alt="slotProps.value.name"
                  class="mr-2"
              />
              <div>{{ slotProps.value.name }}</div>
            </div>
          </template>

        </Select>
        <InputText
            placeholder="Numéro de téléphone"
            inputId="phone"
            v-model="phone"
            class="w-full md:w-[70%]"
            @blur="normalizePhoneNumber()"
        />
      </div>

  </div>

</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import countries from 'world-countries';

export type CountryItem = {
  code: string;
  name: string;
  phone: string;
};

const countryList = ref<CountryItem[]>([]);

const selectedCountry = ref<CountryItem | null>(null);

const selectedPhoneCode = computed(() =>
    selectedCountry.value?.phone ?? ''
);

onMounted(() => {
  countryList.value = countries
      .filter(c => c.idd?.root)
      .map(c => ({
        code: c.cca2,
        name: c.name.common,
        phone: c.idd.root + (c.idd.suffixes?.[0] ?? '')
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

  selectedCountry.value = countryList.value.find(c => c.code === 'FR') || null;
});

const props = defineProps({
  phone: String,
  propertyRules: Object,
  errorMessage: String,
})

const emit = defineEmits([
  'update:phone',
])

const phone = computed({
  get: () => props.phone,
  set: value => emit('update:phone', value)
});


watch(selectedCountry, () => {
  phone.value = '';
})

function normalizePhoneNumber() {
  if (!phone.value) return '';

  let digits = phone.value.replace(/\D/g, '');

  if (digits.startsWith('0')) digits = digits.slice(1);

  const prefix = selectedPhoneCode.value.replace(/\D/g, ''); // juste chiffres
  if (!digits.startsWith(prefix)) {
    digits = prefix + digits;
  }

  phone.value = `+${digits}`;
}
</script>
