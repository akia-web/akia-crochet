export interface InvoiceAddressDto {
  company: string;
  email: string;
  firstName: string;
  lastName: string;
  numberStreet: string;
  postalCode: string;
  street: string;
  city: string;
  country: { name: string };
}