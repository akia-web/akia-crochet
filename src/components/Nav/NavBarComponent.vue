<template>
  <div class="flex bg-dark-pink w-100 justify-between align-center">
    <RouterLink to="/">
      <img class="logo ml-0_5" src="@/assets/logo.png">
    </RouterLink>
    <div class="flex align-center">
      <RouterLink to="/peluches"
                  class="mr-1 text-decoration-none font-spartan font-size-1_5em">
        <span class="text-black bold">
          Peluches
        </span>
      </RouterLink>

      <RouterLink class="text-decoration-none font-spartan font-size-1_5em">
        <span class="text-black bold">
          Patrons
        </span>
      </RouterLink>
    </div>

    <div class="flex align-center">
      <Button label="Profile"
              class="mr-1 p-button-transparent text-black"
              icon="pi pi-user"
              @click="goToProfile"
              v-if="storeUser.user"></Button>
      <Button label="Se connecter"
              class="mr-1 p-button-action"
              icon="pi pi-google"
              v-if="!storeUser.user"
              @click="loginWithGoogle"></Button>
      <span class="pi pi-youtube text-red font-size-1_5em mr-0_5"></span>
      <span class="pi pi-tiktok font-size-1_5em mr-0_5"></span>
      <span class="pi pi-instagram font-size-1_5em mr-0_5"></span>
    </div>

  </div>

</template>

<style>
.logo {
  width: 80px;
}
</style>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import type { UserDto } from '@/interfaces/user.dto.ts';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user.ts';

  const storeUser = useUserStore();
  const user = ref<UserDto | undefined>();
  const router = useRouter();


  const loginWithGoogle = async (): Promise<void> => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  onMounted(async () => {
  });

  const goToProfile = () => {
    router.push('/profile');
  };
</script>