import type { OrderStatusEnum } from '@/enum/orders-status-enum.ts';
import type { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';

export interface AllOrdersDto {
  id: number;
  createdAt: Date;
  status: OrderStatusEnum;
  totalAmount: number;
  currency: string;
  imageItem: string[];
  package: deliveryPackage[];
}


interface deliveryPackage {
  name: string;
  status: ShipmentStatusEnum;
}


