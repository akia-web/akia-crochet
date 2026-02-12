import type { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';
import type { ItemsOrderDTO } from '@/interfaces/items-order.dto.ts';
import type { AddressDto } from '@/interfaces/Address.dto.ts';
import type { ShippingLabelDTO } from '@/interfaces/shipping-label.dto.ts';

export interface ShipmentDto {
  id: number;
  createdAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  carrier: string;
  trackingNumber: string;
  status: ShipmentStatusEnum;
  estimateDeliveredAt?: Date;
  deliveryAddress: AddressDto;
  items: ItemsOrderDTO[];
  shippingLabel: ShippingLabelDTO;
}