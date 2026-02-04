import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import type { ShipmentStatusEnum } from '@/enum/shipment-status-enum.ts';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';

export interface ItemsOrderDTO {
  id: number;
  name: string;
  price: number;
  quantity: number;
  plushie: PlushieDto;
  plushieVariant: PlushieVariantDto;
  orderShipment: ShipmentStatusEnum;
}