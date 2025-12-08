<template>
  <div class="flex bg-dark-pink w-100 justify-between align-center p-[10px]">
    <RouterLink to="/">
      <img class="logo ml-0_5"
           alt="logo Akia"
           src="@/assets/logo.png">
    </RouterLink>

    <div class="hidden md:block">
      <div class="flex align-center gap-4">
        <LinkComponent/>
      </div>
    </div>


    <div class="flex align-center">
      <Button label="Profile"
              class="mr-1 p-button-transparent text-black font-spartan"
              icon="pi pi-user"
              @click="goTo('/profile')"
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
          <div class="flex justify-center column mt-4">
            <LinkComponent @closeDrawer="visible=false"/>
          </div>

        </Drawer>
        <Button icon="pi pi-bars" class="p-button-transparent text-black" @click="visible = true" />
      </div>

    </div>

  </div>

</template>

<style scoped>
.logo {
  width: 80px;
}
</style>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import type { UserDto } from '@/interfaces/user.dto.ts';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user.ts';
  import { api } from '@/functions/api.ts';
  import { env } from '@/environnement.ts';
  import ShopCard from '@/components/ShopCard/ShopCardComponent.vue';
  import LinkComponent from '@/components/Nav/linkComponent.vue';


  const storeUser = useUserStore();
  const user = ref<UserDto | undefined>();
  const router = useRouter();

  const visible = ref<boolean>(false)


  onMounted(async () => {
  });

  const goTo = (url:string) => {
    router.push(url);
  };
</script>