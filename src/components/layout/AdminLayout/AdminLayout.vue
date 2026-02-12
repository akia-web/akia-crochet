<template>

  <div class="bg-site min-h-100vh">
    <div v-if="isDesktop">
      <div class="flex p-1">
        <div class="card menu-width relative w-[241px]">
          <LeftBarComponent @disconnect="disconnect"
                            @naviate="navigateTo($event)">
          </LeftBarComponent>
        </div>
        <div class="w-[calc(100%-241px)]">
          <Toast></Toast>
          <RouterView/>
        </div>
      </div>

    </div>
    <!--Menu mobile-->
    <div v-if="!isDesktop">
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
import { onMounted, onUnmounted, ref } from 'vue';
import PopUpAdminMenuComponent from '@/components/Admin/LeftBar/PopUpAdminMenuComponent.vue';
import { useUserStore } from '@/stores/user.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

const visible = ref<boolean>(false);

const router = useRouter();
const useUser = useUserStore();

// reactive pour détecter si on est desktop ou mobile
const isDesktop = ref(window.innerWidth >= 768);

const updateIsDesktop = () => {
  isDesktop.value = window.innerWidth >= 768;
};

// mettre à jour à l'ouverture et sur resize
window.addEventListener('resize', updateIsDesktop);
onMounted(() => {
  updateIsDesktop();
});
onUnmounted(() => {
  window.removeEventListener('resize', updateIsDesktop);
});


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