<template>
  <div class="flex items-center cursor-pointer"  @click="clicked = !clicked" >
    <div class="flex items-center gap-2">
      <img src="@/assets/icones/bulb.svg" alt="">
      <h2 class="underline">Conseils d'entretien</h2>
    </div>

    <Button :icon="iconButton" class="p-button-transparent text-black"/>
  </div>

  <Transition @enter="enterTransition"
              @leave="leaveTransition">
    <div v-if="clicked" ref="content" class="pl-8">
      <p class="text-xs">Nos peluches amigurumi sont réalisées à la main en coton, acrylique ou laine chenille, et
        rembourrées avec un garnissage doux.
        <br>
        Afin de préserver leur qualité, leur douceur et leur forme, nous vous recommandons de suivre les conseils
        d’entretien ci-dessous.
        <br>
        Les couleurs peuvent légèrement varier avec le temps et les lavages. <br>
      </p>
      <div class="mt-2">
        <span class="text-xs font-bold">Lavage :</span>
        <ul class="text-xs">
          <li>- À la main avec de l'eau froide (30°C maximum) recommandé</li>
          <li>- Lavage en machine possible occasionnellement : programme délicat, dans un filet</li>
          <li>- Lessive ou savon doux</li>
          <li>- Nettoyer délicatement sans frotter ni tordre</li>
        </ul>
      </div>


      <div class="mt-2">
        <span class="text-xs font-bold">Séchage :</span>
        <ul class="text-xs">
          <li>- À l'air libre uniquement</li>
          <li>- Presser doucement pour retirer l’excédent d’eau et remodeler la peluche si nécessaire</li>
          <li>- Éviter toute source de chaleur directe (radiateur, soleil)</li>
        </ul>
      </div>

      <div class="mt-2">
        <span class="text-xs font-bold">ּÀ éviter</span>
        <ul class="text-xs">
          <li>- Eau chaude</li>
          <li>- Produits blanchissants ou javel</li>
        </ul>
      </div>
    </div>
  </Transition>

</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { enterTransition, leaveTransition } from '@/functions/transitions.ts';

const clicked = ref(false);
const iconButton = computed(() => clicked.value ? 'pi pi-chevron-down' : 'pi pi-chevron-right');
</script>
