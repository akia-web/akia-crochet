export interface ConfigAddressDto {
  id?: number,
  firstName: string,
  lastName: string,
  numberStreet: string,
  company?: string,
  street: string,
  phone: string,
  city: string,
  country: { name: string },
  postalCode: string,
  email: string,
  livraisonOption: {
    code: string,
    name: string,
    supplement: number
  }
}