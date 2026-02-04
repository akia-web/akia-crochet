import type { ParcelPointDto } from '@/interfaces/parcel-point.dto.ts';

export interface AddressDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  numberStreet: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  additionalInformation: string;
  parcelPoint: ParcelPointDto;
}