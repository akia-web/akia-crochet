<template>
  <div class="flex bg-dark-pink w-100 justify-between align-center">
    <RouterLink to="/">
      <img class="logo ml-0_5"
           alt="logo Akia"
           src="@/assets/logo.png">
    </RouterLink>
    <div class="flex align-center gap-4">
      <RouterLink :to="{ name: 'peluches' }"
                  class="mr-1 text-decoration-none font-spartan font-size-1_5em">
        <span class="text-black bold">
          Nouveautés
        </span>
      </RouterLink>
      <RouterLink :to="{ name: 'peluches' }"
                  class="mr-1 text-decoration-none font-spartan font-size-1_5em">
        <span class="text-black bold">
          Peluches
        </span>
      </RouterLink>

      <RouterLink :to="{ name: 'peluches' }"
                  class="mr-1 text-decoration-none font-spartan font-size-1_5em">
        <span class="text-black bold">
          Pré-commander
        </span>
      </RouterLink>

      <RouterLink to="/" class="text-decoration-none font-spartan font-size-1_5em">
        <span class="text-black bold">
          Patrons
        </span>
      </RouterLink>
    </div>

    <div class="flex align-center">
      <Button label="Profile"
              class="mr-1 p-button-transparent text-black"
              icon="pi pi-user"
              @click="goTo('/profile')"
              v-if="storeUser.user"></Button>
      <Button label="Se connecter"
              class="mr-1 p-button-action"
              icon="pi pi-google"
              v-if="!storeUser.user"
              @click="loginWithGoogle"></Button>
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

  const storeUser = useUserStore();
  const user = ref<UserDto | undefined>();
  const router = useRouter();


  const loginWithGoogle = async (): Promise<void> => {
    window.location.href =api(env.auth.google);
  };

  onMounted(async () => {
  });

  const goTo = (url:string) => {
    router.push(url);
  };
</script>