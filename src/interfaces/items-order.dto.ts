import type { ProductDto } from '@/interfaces/product.dto.ts';
import type { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto.ts';

export interface ItemsOrderDTO {
  id: number;
  name: string;
  price: number;
  quantity: number;
  product: ProductDto;
  productVariant: ProductVariantDto;
  orderShipment: ShipmentStatusEnum;
  imageItemUrl?: string;
}