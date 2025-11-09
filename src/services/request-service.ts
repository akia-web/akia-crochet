export const apiGet = (url: string, method: 'GET' | 'DELETE', auth?: boolean) => {
  const headers: { 'Content-Type': string, 'Authorization'?: string } = { 'Content-Type': 'application/json', };

  if (auth) {
    const token: string | null = localStorage.getItem('akia-crochet-auth');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return fetch(url, {
    method: method,
    headers
  });
};


export const apiPost = (url: string, method: 'POST' | 'PATCH' | 'PUT', body: any, auth?: boolean) => {
  const headers: { 'Content-Type': string, 'Authorization'?: string } = { 'Content-Type': 'application/json', };

  if (auth) {
    const token: string | null = localStorage.getItem('akia-crochet-auth');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return fetch(url, {
    method: method,
    headers,
    body: body
  });
};
