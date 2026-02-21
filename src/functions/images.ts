export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  const response: Response = await fetch(url);
  const blob: Blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
}

export const getImageName = (url: string): string => {
  return url.split('/images/')[1];
};


export const getMimeType = (url: string): string => {
  console.warn(url)
  return ''
  // const ext = url.split('.').pop().toLowerCase();
  // const map = {
  //   jpg: 'image/jpeg',
  //   jpeg: 'image/jpeg',
  //   png: 'image/png',
  //   gif: 'image/gif',
  //   webp: 'image/webp',
  //   svg: 'image/svg+xml'
  // };
  // return map[ext] || 'application/octet-stream';
};