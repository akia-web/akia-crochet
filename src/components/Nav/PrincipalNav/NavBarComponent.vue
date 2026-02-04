<template>
  <div class="flex bg-white w-100 justify-between align-center p-[10px] shadow-md">
    <RouterLink to="/">
      <img class="logo ml-0_5"
           alt="logo Akia"
           src="../../../assets/logo-base-line.png">
    </RouterLink>

    <div class="hidden md:block">
      <div class="flex align-center gap-4">
        <LinkComponent/>
      </div>
    </div>


    <div class="flex align-center">
      <Button icon="pi pi-lock" v-if="storeUser.user && storeUser.user.role === RoleEnum.ADMIN"
              @click="goTo(ADMIN_PLUSHIES_ROUTE)"></Button>

      <Button label="Profile"
              class="mr-1 p-button-transparent text-black font-spartan"
              icon="pi pi-user"
              @click="goTo(PROFILE_ROUTE)"
              v-if="storeUser.user">
      </Button>


      <RouterLink :to="{ name: 'connexion' }"
                  v-if="!storeUser.user"
                  class="mr-1 text-decoration-none font-spartan">
        <span class="text-black font-bold">
          Connexion
        </span>
      </RouterLink>
      <ShopCard></ShopCard>
      <!--Menu mobile-->
      <div class="block md:hidden">
        <Drawer v-model:visible="visible" header="Menu" position="full">
          <div class="flex justify-center items-center column mt-4 w-full h-full">
            <LinkComponent @closeDrawer="visible=false"/>
          </div>
        </Drawer>
        <Button icon="pi pi-bars" class="p-button-transparent text-black" @click="openDrawer"/>
      </div>

    </div>

  </div>


</template>

<style scoped>
.logo {
  width: 130px;
}
</style>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { UserDto } from '@/interfaces/user.dto.ts';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import ShopCard from '@/components/ShopCard/ShopCardComponent.vue';
import LinkComponent from '@/components/Nav/PrincipalNav/linkComponent.vue';
import { ADMIN_PLUSHIES_ROUTE, PROFILE_ROUTE } from '@/router/routes-name.ts';
import { RoleEnum } from '@/enum/role.enum.ts';


const storeUser = useUserStore();
const user = ref<UserDto | undefined>();
const router = useRouter();

const visible = ref<boolean>(false);


onMounted(async () => {
});

const openDrawer = () => {
  visible.value = true;
};

const goTo = (url: string) => {
  router.push({ name: url, params: { step: 'Informations' }});
}
  ;;
</script>