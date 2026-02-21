<template>
  <HomePresentationImage/>


    <div class="flex gap-4 lg:gap-8 2xl:gap-16 flex-wrap rounded-lg bg-otherPink mb-8 p-[20px] justify-center">

      <div class="bg-white p-[10px] rounded-lg  lg:max-w-[48%] flex items-center" >
        <img src="@/assets/images/presentation.jpg"
             alt=""
             class="w-full md:w-[300px]  lg:w-[500px] rounded-lg "
        >
      </div>
      <div class="bg-white p-[20px] rounded-lg lg:max-w-[48%]">
        <h1 class="text-xl text-center mb-[50px] mt-4 ">Comment sont fait nos amigurumis ?</h1>
        <p>Chaque amigurumi est fabriqué à la main avec un crochet. <br>
          Avec du fil, du rembourrage et de petits accessoires, chaque création demande plusieurs heures de travail minutieux.<br>
          Ils peuvent être câlinés doucement ou simplement décorer un coin de vie. <br>
          Leur confection délicate les rend uniques, mais aussi fragiles : ils ne sont pas conçus comme des jouets. <br>
          Offrir une de nos créations, c’est transmettre chaleur, réconfort et un charme irrésistiblement artisanal.</p>
      </div>

    </div>



  <LastVideosComponent/>
</template>

<script lang="ts" setup>
import LastVideosComponent from '@/pages/Home/components/last-videos/LastVideosComponent.vue';
import HomePresentationImage from '@/pages/Home/components/HomePresentationImage.vue';


</script>