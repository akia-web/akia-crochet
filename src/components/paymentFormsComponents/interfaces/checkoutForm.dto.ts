import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import type { InvoiceAddressDto } from '@/components/paymentFormsComponents/interfaces/invoice-address.dto.ts';
import type { DeliveryAddressDto } from '@/components/paymentFormsComponents/interfaces/delivery-address.dto.ts';
import type { UserDto } from '@/interfaces/user.dto.ts';

export interface CheckoutFormDto {
  deliveryAddress: DeliveryAddressDto;
  invoiceAddress: InvoiceAddressDto;
  sameAddressForDeliveryAndInvoice: boolean;
  cguAccepted: boolean;
  checked: boolean;
  tips: { name: string, value: number };
  products: ProductShopDto[];
  user?: UserDto;
}