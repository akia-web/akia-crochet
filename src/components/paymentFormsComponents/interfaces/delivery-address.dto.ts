import type { TransporterDto } from '@/interfaces/transporter.dto.ts';

export interface DeliveryAddressDto {
  additionalInformation: string;
  company: string;
  email: string;
  firstName: string;
  lastName: string;
  livraisonOption: TransporterDto;
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
      position: { longitude: number, latitude: number },
      street: string,
      postalCode: string
    },
    name: string,
  },
}
