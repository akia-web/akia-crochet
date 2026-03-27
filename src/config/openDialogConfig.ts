export const configOpenDialog = (header: string, closable:boolean = true, defaultWidth:string = '100%') => {
  return {
    header,
    style: {
      width: defaultWidth,
    },
    breakpoints: {
      '960px': '75vw',
      '640px': '90vw'
    },
    modal: true,
    closable
  };
};