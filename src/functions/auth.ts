import type { UserDto } from '@/interfaces/user.dto.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

export const updatePinia = async (storeUser: any): Promise<void> => {

  if (!storeUser.user) {
    const connectedUser: Response = await fetch(
      api(env.auth.isAuthenticated),
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data: { isAuthenticated: boolean; user?: UserDto; jwt?: string } = await connectedUser.json();

    if (data.isAuthenticated && data.user) {
      storeUser.updateUser(data.user);

      const jwtSaved: string | null = localStorage.getItem('akia-crochet-auth');
      if (!jwtSaved && data.jwt) {
        localStorage.setItem('akia-crochet-auth', data.jwt);
      }
    }

  }
};
