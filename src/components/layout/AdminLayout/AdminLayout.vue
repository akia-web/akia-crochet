<template>

  <div class="bg-site min-h-100vh">
    <div class=" hidden md:block">
      <div class="flex p-1">
        <div class="card menu-width relative">
          <LeftBarComponent @disconnect="disconnect"
                            @naviate="navigateTo($event)">
          </LeftBarComponent>
        </div>
        <div class="ml-2 mr-2 mt-8 w-100">
          <Toast></Toast>
          <RouterView/>
        </div>
      </div>

    </div>
    <!--Menu mobile-->
    <div class="block md:hidden">
      <Drawer v-model:visible="visible" header="Menu" position="full">
        <PopUpAdminMenuComponent @naviate="navigateTo($event)"
                                 @disconnect="disconnect">
        </PopUpAdminMenuComponent>
      </Drawer>
      <Button icon="pi pi-bars" class="p-button-transparent text-black" @click="visible = true"/>
      <div class="mt-8 w-100">
        <Toast></Toast>
        <RouterView/>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import LeftBarComponent from '@/components/Admin/LeftBar/LeftBarComponent.vue';
import { ref } from 'vue';
import PopUpAdminMenuComponent from '@/components/Admin/LeftBar/PopUpAdminMenuComponent.vue';
import { useUserStore } from '@/stores/user.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

const visible = ref<boolean>(false);

const router = useRouter();
const useUser = useUserStore();


const navigateTo = (url: string) => {
  router.push(`/admin${url}`);
  visible.value = false;
};

const disconnect = async () => {
  await fetch(
      api(env.auth.revoque),
      {
        method: 'GET',
        credentials: 'include',
      }
  ).then(() => {
    useUser.updateUser(null);
    localStorage.removeItem(import.meta.env.VITE_AUTH_STORAGE);
    router.push('/');
  });
};

</script>