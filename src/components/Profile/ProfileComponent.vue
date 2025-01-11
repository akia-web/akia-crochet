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

onMounted(async () => {
})

const disconnect = async () => {
  const disconnectUser = await fetch(
      'http://localhost:3001/auth/revoke-google',
      {
        method: 'GET',
        credentials: 'include',
      }
  ).then(() => {
    useUser.updateUser(null);
    console.log(import.meta.env.VITE_AUTH_STORAGE)
    localStorage.removeItem(import.meta.env.VITE_AUTH_STORAGE)
    router.push('/')
  })
}

</script>