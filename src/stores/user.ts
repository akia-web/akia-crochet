import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserDto } from '@/interfaces/user.dto.ts';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserDto | null>(null);

  function updateUser(value: UserDto | null) {
    user.value = value;
  }

  return { user, updateUser };
});
