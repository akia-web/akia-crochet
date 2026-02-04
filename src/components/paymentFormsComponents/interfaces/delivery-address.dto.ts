export interface DeliveryAddressDto {
  additionalInformation: string;
  company: string;
  email: string;
  firstName: string;
  lastName: string;
  livraisonOption: { name: string, code: string, supplement: number };
  numberStreet: string;
  phone: string;
  postalCode: string;
  street: string;
  city: string;
  country: { name: string, code: string };
  selectedParcelPoint: {
    code: string,
    location: {
      city: string,
      country: string,
      position: { longitude: string, latitude: string },
      street: string,
      postalCode: string
    },
    name: string,
  },
}
