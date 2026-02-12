import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';

export const apiGet = async (url: string, method: 'GET' | 'DELETE', auth?: boolean) => {
  const headers: { 'Content-Type': string, 'Authorization'?: string } = { 'Content-Type': 'application/json', };

  if (auth) {
    const token: string | null = localStorage.getItem('akia-crochet-auth');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  const res: Response = await fetch(url, {
    method: method,
    headers
  });

  if (!res.ok) {
    if (res.status === 403) {
      await removeAuthToken();
    }
    throw await res.json().catch(() => ({}));
  }

  return res;
};

/**
 *
 * @param url
 * @param method
 * @param body
 * @param credentials si on veut recevoir un cookie
 * @param auth si on veut envoyer le token
 */
export const apiPost = async (url: string, method: 'POST' | 'PATCH' | 'PUT', body: any, credentials: boolean = false, auth?: boolean) => {
  const headers: { 'Content-Type'?: string, 'Authorization'?: string } = {};

  if (auth) {
    const token: string | null = localStorage.getItem('akia-crochet-auth');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }


  const res: Response = await fetch(url, {
    method,
    headers,
    body,
    credentials: credentials ? 'include' : undefined,
  });

  if (!res.ok) {
    if (res.status === 403) {
      await removeAuthToken();
    }
    throw await res.json().catch(() => ({}));
  }

  return res.json().catch(() => ({}));

};

export const apiDelete = () => {

};

export const removeAuthToken = async () => {
  await fetch(
    api(env.auth.revoque),
    {
      method: 'GET',
      credentials: 'include',
    });

  localStorage.removeItem(import.meta.env.VITE_AUTH_STORAGE);
  window.location.href = '/connexion';
};
