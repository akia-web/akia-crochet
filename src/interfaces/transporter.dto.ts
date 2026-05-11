import type { WeightPriceDto } from '@/interfaces/weight-price.dto.ts';

export interface TransporterDto {
  id?: number;
  name: string;
  code: string;
  weightPrice: WeightPriceDto[];
  value?: string;
}