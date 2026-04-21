<template>

    <div v-if="nextVisible">
        <p>Quels variants mettre en ligne?</p>
        <div v-for="variant in variantList"
            :key="variant.name"
            class="mt-4">
            <div class="flex items-center mb-1" >
                <img :src="findRow1(variant)"
                class="w-[40px]"/>
                <p class="ml-4 w-[200px]">{{ variant.name }}</p>
                <ToggleSwitch v-model="variant.isVisible"/>

            </div>
            
        </div>
    </div>

    <div v-else>
        <p>La désactivation du produit mets aussi tous les variants en mode hors ligne</p>      
    </div>

    <div class="flex justify-between">
            <Button @click="close" class="button-action-transparent" label="Annuler"></Button>
            <Button @click="accept" label="Valider"></Button>
    </div>
    
</template>
<script lang="ts" setup>
import type { ImagesDto } from '@/interfaces/images.dto';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto';
import { inject, ref } from 'vue';

const dialogRef = inject<any>('dialogRef');
const variantList = ref<ProductVariantDto[]>([]);
const nextVisible = ref<boolean>(false)


if (dialogRef?.value?.data) {
  variantList.value = dialogRef.value.data.variants;
  nextVisible.value = dialogRef.value.data.nextVisible 
}

const close = () => {
    dialogRef.value.close();
}

const findRow1 = (variant : ProductVariantDto) : string => {
   const row1 : ImagesDto[]= variant.images.filter((element: ImagesDto)=> element.row === 0)
   return row1[0].url
}

const accept = () => {
    if(!nextVisible.value){
        variantList.value.forEach((element: ProductVariantDto )=> element.isVisible = false)
    }

    dialogRef.value.close({  variants: variantList.value  });
}
</script>