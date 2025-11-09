export const configOpenDialog = (header: string) => {
  return {
    header,
    style: {
      width: '50vw',
    },
    breakpoints: {
      '960px': '75vw',
      '640px': '90vw'
    },
    modal: true
  };
};