import type { UserDto } from '@/interfaces/user.dto.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

export const updatePinia = async (storeUser: any): Promise<void> => {
  let connectedUser;

  try {
    connectedUser = await fetch(
      api(env.auth.isAuthenticated),
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  } catch (error: any) {
    console.warn('pas ok');
    console.warn(error.message);
    if (error.message === 'Failed to fetch') {
      window.location.href = '/error-page';
      return;
    }
  }

  if (connectedUser === undefined) {
    return;
  }

  const data: { isAuthenticated: boolean; user?: UserDto; jwt?: string } = await connectedUser.json();

  if (data.isAuthenticated && data.user) {
    storeUser.updateUser(data.user);

    const jwtSaved: string | null = localStorage.getItem('akia-crochet-auth');
    if (!jwtSaved && data.jwt) {
      localStorage.setItem('akia-crochet-auth', data.jwt);
    }
  }
};
