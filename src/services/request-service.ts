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
    throw await res.json().catch(() => ({}));
  }

  return res;
};


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
    throw await res.json().catch(() => ({}));
  }

  return res.json().catch(() => ({}));

};

export const apiDelete = () => {

}
