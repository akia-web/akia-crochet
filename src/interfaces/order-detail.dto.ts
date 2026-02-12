import type { AddressDto } from '@/interfaces/Address.dto.ts';
import type { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';
import type { ItemsOrderDTO } from '@/interfaces/items-order.dto.ts';

export interface OrderDetailDto {
  billingAddress: AddressDto;
  deliveryAddress: AddressDto;
  totalAmount: number;
  orderPackages: PackageBoxtalDto[] | null;
  tips: number;
  addingLivraisonPrice: number;
  isGuest: boolean;
  orderItems: ItemsOrderDTO[];
  orderId: number;
}

interface PackageBoxtalDto {
  name: string;
  status: ShipmentStatusEnum;
  ref: string;
  estimateDeliveryDate: Date;
  items: ItemsPackageBoxtalDto[];
  history: HistoryTrackingDto[];
  urlTracking: string;
}

export interface ItemsPackageBoxtalDto {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface HistoryTrackingDto {
  status: string;
  message: string;
  date: Date;
  icon: string;
  color: string;
}