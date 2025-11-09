export const api = (arg: string) => {
  const baseUrl = import.meta.env.VITE_BASE_URL_BACK
  return `${baseUrl}${arg}`
}