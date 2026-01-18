<template>
  <div class=" xl:w-[80%] m-auto">
    <h1 class="text-xl mb-2 pt-4">Page de paiement</h1>
    <div class="flex w-full flex-wrap lg:flex-row-reverse justify-between items-start pt-4">
      <div
          class="w-full md:w-[90%] lg:w-auto lg:sticky top-[95px] ml-auto mr-auto bg-white p-[20px] rounded-lg mb-8 self-start min-w-[25%]">
        <h2 class="font-bold text-center mb-2">Récapitulatif panier</h2>
        <RecapCartView :isRecapPage="false"></RecapCartView>
      </div>

      <div class="w-full md:w-[90%] lg:w-[60%] m-auto bg-white mb-8 p-[10px] md:p-[20px] rounded-lg">
        <Stepper value="1">
          <StepList>
            <Step value="1">Livraison</Step>
            <Step value="2" :disabled="!canGoToStep2">Facturation</Step>
            <Step value="3" :disabled="!canGoToStep3">Paiement</Step>
          </StepList>
          <StepPanels>
            <StepPanel v-slot="{ activateCallback }"
                       value="1"
                       class="rounded-md md:p-[20px]">
              <div class="flex flex-col gap-4">
                <DeliveryFormComponent v-model:deliveryAddressLastName="form.deliveryAddress.lastName"
                                       v-model:deliveryAddressFirstName="form.deliveryAddress.firstName"
                                       v-model:deliveryAddressCountry="form.deliveryAddress.country"
                                       v-model:phone="form.deliveryAddress.phone"
                                       v-model:email="form.deliveryAddress.email"
                                       v-model:company="form.deliveryAddress.company"
                                       :isInvoiceAddress="false"
                                       :v$="v$.deliveryAddress"
                                       v-model:livraisonOption="form.deliveryAddress.livraisonOption"
                                       v-model:selectedParcelPoint="form.deliveryAddress.selectedParcelPoint"
                                       v-model:street="form.deliveryAddress.street"
                                       v-model:numberStreet="form.deliveryAddress.numberStreet"
                                       v-model:postalCode="form.deliveryAddress.postalCode"
                                       v-model:city="form.deliveryAddress.city">
                </DeliveryFormComponent>
                <div class="flex pt-6 justify-end">
                  <Button label="Suivant"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          :disabled="!canGoToStep2"
                          @click="activateCallback('2');"/>
                </div>
              </div>

            </StepPanel>
            <StepPanel v-slot="{ activateCallback }"
                       value="2"
                       class="rounded-md p-[20px]">
              <InvoiceAddressFormComponent
                  v-model:sameAddressForDeliveryAndInvoice="form.sameAddressForDeliveryAndInvoice"
                  v-model:invoiceAddressLastName="form.invoiceAddress.lastName"
                  v-model:invoiceAddressFirstName="form.invoiceAddress.firstName"
                  v-model:invoiceAddressCountry="form.invoiceAddress.country.name"
                  v-model:invoiceAddressEmail="form.invoiceAddress.email"
                  v-model:invoiceAddressCompany="form.invoiceAddress.company"
                  :isInvoiceAddress="true"
                  :livraisonOption="form.deliveryAddress.livraisonOption"
                  :v$="v$.invoiceAddress"
                  v-model:invoiceAddressStreet="form.invoiceAddress.street"
                  v-model:invoiceAddressNumberStreet="form.invoiceAddress.numberStreet"
                  v-model:invoiceAddressPostalCode="form.invoiceAddress.postalCode"
                  v-model:invoiceAddressCity="form.invoiceAddress.city"
              />

              <div class="flex pt-6 justify-end">
                <Button label="Suivant"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        :disabled="!canGoToStep3"
                        @click="activateCallback('3');"/>
              </div>

            </StepPanel>
            <StepPanel v-slot="{ activateCallback }"
                       value="3"
                       class="rounded-md p-[20px]">
              <div class="flex justify-between">
                <h2 class="font-bold">Adresse de livraison</h2>
                <Button label="Modifier"
                        icon="pi pi-pencil"
                        icon-pos="right"
                        @click="activateCallback('1')"
                ></Button>
              </div>

              <RecapDeliveryAddress :form="form.deliveryAddress"></RecapDeliveryAddress>

              <Textarea v-if="form.deliveryAddress.livraisonOption.code === 'domicile'"
                        v-model="form.deliveryAddress.additionalInformation"
                        class="w-full mt-4"
                        placeholder="Ajouter une information pour le livreur"></Textarea>

              <hr class="mt-4 border-actionColor">

              <div class="flex justify-between mt-4">
                <h2 class="font-bold">Adresse de facturation</h2>
                <Button label="Modifier"
                        icon="pi pi-pencil"
                        icon-pos="right"
                        @click="activateCallback('2')"
                ></Button>
              </div>

              <RecapInvoiceAddress :form="form"
                                   v-model:tips="form.tips"></RecapInvoiceAddress>

              <div class="flex gap-1 mt-8">
                <Checkbox v-model="form.cguAccepted" binary id="cgu"/>
                <label for="cgu">J'accepte les conditions de ventes</label>
              </div>


              <input type="checkbox" id="checkbox" class="hidden" v-model="form.checked"/>

              <div class="flex flex-row-reverse">
                <Button class="p-button-white-border-action-color"
                        :disabled="!canPayed"
                        @click="finalizePayment">
                  <p>Payer</p>
                  <img src="@/assets/icones/QuokkaMoney.png" class="w-[50px]" alt="">
                </Button>
              </div>

            </StepPanel>
          </StepPanels>
        </Stepper>
      </div>
    </div>
    <DynamicDialog/>
  </div>
</template>
<script lang="ts" setup>

import { computed, onMounted, reactive, ref, watch } from 'vue';
import BoxMapComponent from '@/components/BoxMap/BoxMapComponent.vue';
import { useUserStore } from '@/stores/user.ts';
import { useRouter } from 'vue-router';
import { useDialog } from 'primevue';
import { useVuelidate } from '@vuelidate/core';
import { email, maxLength, required, requiredIf } from '@vuelidate/validators';
import RecapCardList from '@/components/paymentFormsComponents/recapCart/recapCardList.vue';
import ContactInfo from '@/components/paymentFormsComponents/contactInfo.vue';
import AddressComponent from '@/components/paymentFormsComponents/AddressComponent.vue';
import { phoneByCountry } from '@/validators/phone-validators.ts';
import parsePhoneNumberFromString, { type CountryCode } from 'libphonenumber-js';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import Stepper from 'primevue/stepper';
import StepPanel from 'primevue/steppanel';
import StepList from 'primevue/steplist';
import DeliveryFormComponent from '@/components/paymentFormsComponents/DeliveryFormComponent.vue';
import InvoiceAddressFormComponent from '@/components/paymentFormsComponents/InvoiceAddressFormComponent.vue';
import RecapDeliveryAddress from '@/components/paymentFormsComponents/RecapDeliveryAddress.vue';
import RecapInvoiceAddress from '@/components/paymentFormsComponents/recapInvoiceAddress.vue';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import RecapCartView from '@/components/paymentFormsComponents/recapCart/recapCartView.vue';
import { apiPost } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { ADMIN_DASHBORD_ROUTE } from '@/router/routes-name.ts';
import type { CheckoutFormDto } from '@/components/paymentFormsComponents/interfaces/checkoutForm.dto.ts';

const storeUser = useUserStore();
const router = useRouter();
const dialog = useDialog();

const storeProductsCart = useProductsCartStore();

onMounted(() => {
  if (storeProductsCart.openSlider) {
    storeProductsCart.updateVisibility(false);
  }
});

const form = reactive<CheckoutFormDto>({
  deliveryAddress: {
    firstName: '',
    lastName: '',
    numberStreet: '',
    company: '',
    street: '',
    city: '',
    country: { name: 'France', code: 'FR' },
    postalCode: '',
    phone: '',
    email: '',
    additionalInformation: '',
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
    livraisonOption: {
      code: 'MONR_NETWORK',
      name: 'Mondial Relais'
    },
  },
  invoiceAddress: {
    firstName: '',
    lastName: '',
    numberStreet: '',
    company: '',
    street: '',
    city: '',
    country: { name: 'France' },
    postalCode: '',
    email: '',
  },
  sameAddressForDeliveryAndInvoice: true,
  cguAccepted: false,
  checked: false,
  tips: { name: 'Aucun', value: 0 },
  products: [],
  user: storeUser.user ? storeUser.user : undefined,
});

const rules = computed(() => ({
  deliveryAddress: {
    firstName: { required },
    lastName: { required },
    numberStreet: { required, maxLength: maxLength(12) },
    street: { required },
    city: { required },
    postalCode: { maxLength: maxLength(10), required },
    phone: {
      required,
      phoneByCountry: phoneByCountry(
          () => form.deliveryAddress.country?.code as CountryCode
      ),
    },

    email: { required, email },
    selectedParcelPoint: {
      isRequired: requiredIf(() => form.deliveryAddress.livraisonOption.code !== 'domicile'),
      notEmptyObject: (value: any) => {
        if (form.deliveryAddress.livraisonOption.code === 'domicile') return true; // pas requis
        return value && value.code && value.code !== '';
      }
    },
    livraisonOption: { code: { required } }
  },
  invoiceAddress: {
    firstName: {
      required: requiredIf(() => !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile')),
    },
    lastName: {
      required: requiredIf(() => !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile'))
    },
    numberStreet: {
      required: requiredIf(() => !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile')),
      maxLength: maxLength(12)
    },
    street: {
      required: requiredIf(() => !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile'))
    },
    city: {
      required: requiredIf(() => !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile'))
    },
    postalCode: {
      required: requiredIf(() => !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile')),
      maxLength: maxLength(10)
    },
    email: {
      required: requiredIf(() =>
          !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile')
      ),
      email
    },
    country: {
      required: requiredIf(() => !form.sameAddressForDeliveryAndInvoice || (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code !== 'domicile'))
    },

  }
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

const finalizePayment = () => {

  form.products = storeProductsCart.productsCart;

  if (form.sameAddressForDeliveryAndInvoice && form.deliveryAddress.livraisonOption.code === 'domicile') {
    form.invoiceAddress.numberStreet = form.deliveryAddress.numberStreet;
    form.invoiceAddress.country.name = form.deliveryAddress.country.name;
    form.invoiceAddress.street = form.deliveryAddress.street;
    form.invoiceAddress.postalCode = form.deliveryAddress.postalCode;
    form.invoiceAddress.city = form.deliveryAddress.city;
    form.invoiceAddress.company = form.deliveryAddress.company;
    form.invoiceAddress.email = form.deliveryAddress.email;
    form.invoiceAddress.firstName = form.deliveryAddress.firstName;
    form.invoiceAddress.lastName = form.deliveryAddress.lastName;
  }
  console.warn(form);


  apiPost(api(env.stripe.checkout), 'POST', form, false, !!storeUser.user).then((data: any) => {
    window.location.href = data.url;

  }).catch(async e => {
        if (e.message === 'Produits non validé pour précommande') {
          console.error('erreur');
          await storeProductsCart.getLocalStorageCart()
          console.warn(storeProductsCart.listOutOfStocks)
        }
      }
  );
};


const canGoToStep2 = computed(() => !v$.value.deliveryAddress.$invalid);
const canGoToStep3 = computed(() => !v$.value.deliveryAddress.$invalid && !v$.value.invoiceAddress.$invalid);
const canPayed = computed(() => !v$.value.deliveryAddress.$invalid && !v$.value.invoiceAddress.$invalid && form.cguAccepted);


</script>