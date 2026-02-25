<template>
  <HomePresentationImage/>


    <div class="flex gap-4 lg:gap-8 2xl:gap-16 flex-wrap rounded-lg bg-otherPink mb-8 p-[20px] justify-center">

      <div class="bg-white p-[10px] rounded-lg  lg:max-w-[48%] flex items-center" >
        <img src="@/assets/images/presentation.jpg"
             alt=""
             class="w-full md:w-[300px]  lg:w-[500px] rounded-lg "
        >
      </div>
      <div class="bg-white p-[20px] rounded-lg lg:max-w-[48%] flex items-center">
        <div>
          <h1 class="text-xl text-center mb-[50px]">Comment sont fait nos amigurumis ?</h1>
          <ol>
            <li>1. Un peu de fil (laine, coton ou acrylique)</li>
            <li>2. Du rembourrage</li>
            <li>3. Quelques accessoires (yeux de sécurités ou en feutrine, fil de fer ...)</li>
            <li>4. Un bon coup de crochet et du savoir faire</li>

          </ol>
          <p class="mt-4 text-actionColor font-bold">TADAM une nouvelle création apparait !</p>
          <p class="mt-4">Chaque amigurumi est fabriqué à la main avec un crochet et demande plusieurs heures de travail minutieux. <br>
            Ils peuvent être câlinés doucement ou simplement décorer un coin de vie. <br>
            Leur confection à la main les rend uniques, mais aussi fragiles : ils ne sont pas conçus comme des jouets. <br>
            Offrir une de nos créations, c’est transmettre chaleur, réconfort et un charme irrésistiblement artisanal.</p>
        </div>
        </div>


    </div>



  <LastVideosComponent/>
</template>

<script lang="ts" setup>
import LastVideosComponent from '@/pages/Home/components/last-videos/LastVideosComponent.vue';
import HomePresentationImage from '@/pages/Home/components/HomePresentationImage.vue';


</script>