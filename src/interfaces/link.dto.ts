import type { TypeLinkEnum } from '@/enum/type-link-enum.ts';

export interface LinkDto {
  id?: number;
  url: string;
  type: TypeLinkEnum;
  productId?: number;
  row: number;
  name: string;
}