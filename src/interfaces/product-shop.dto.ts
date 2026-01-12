import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';

export interface ProductShopDto {
    quantity: number;
    plushie: PlushieDto;
    plushieVariant: PlushieVariantDto;
    preOrder:boolean;
    acceptedPreOrder:boolean;
}