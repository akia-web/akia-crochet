import type { OrderStatusEnum } from '@/enum/orders-status-enum.ts';
import type { AddressDto } from '@/interfaces/Address.dto.ts';
import type { ItemsOrderDTO } from '@/interfaces/items-order.dto.ts';
import type { UserDto } from '@/interfaces/user.dto.ts';
import type { CurrencyEnum } from '@/enum/currency-enum.ts';

export interface OrderDto {
  id: number;
  createdAt: Date;
  status: OrderStatusEnum;
  totalAmount: number;
  currency: CurrencyEnum;
  stripeSessionId?: string;
  stripePaymentId?: string;
  billingAddress: AddressDto;
  deliveryAddress: AddressDto;
  items: ItemsOrderDTO[];
  tips: number;
  addingLivraisonPrice: number;
  user?: UserDto;
  isGuest: boolean;
  activationCode?: string;
}