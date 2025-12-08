<template>
  <div>
    Profile
    <Button label="se deconnecter"
            @click="disconnect"></Button>
  </div>
</template>

<script lang="ts" setup>
import {useUserStore} from '@/stores/user.ts';

const useUser = useUserStore()
const router = useRouter()

import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

onMounted(async () => {
})

const disconnect = async () => {
  const disconnectUser = await fetch(
      api(env.auth.revoque),
      {
        method: 'GET',
        credentials: 'include',
      }
  ).then(() => {
    useUser.updateUser(null);
    localStorage.removeItem(import.meta.env.VITE_AUTH_STORAGE)
    router.push('/')
  })
}

</script>