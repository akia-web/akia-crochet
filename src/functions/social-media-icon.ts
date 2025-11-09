export const getMedialSocialIcon = (type: string): string => {
  if (type === 'YOUTUBE' || type === 'TIKTOK' || type === 'INSTAGRAM') {
    return `pi-${type.toLocaleLowerCase()}`;
  }
  return 'pi-globe';
};