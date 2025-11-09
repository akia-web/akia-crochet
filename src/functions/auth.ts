import type { UserDto } from '@/interfaces/user.dto.ts';

export const updatePinia = async (storeUser: any): Promise<void> => {

  if (!storeUser.user) {
    const connectedUser: Response = await fetch(
      'http://localhost:3001/auth/is-authenticated',
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
