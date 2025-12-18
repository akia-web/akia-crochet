import type { LinkDto } from '@/interfaces/link.dto.ts';
import type { ImagesDto } from '@/interfaces/images.dto.ts';
import type { PlushieCreatorDto } from '@/interfaces/plushie-creator.dto.ts';
import type { PlushieVariantDto } from '@/interfaces/plushie-variant.dto.ts';

export interface PlushieDto {
  id?: number;
  name?: string;
  description?: string;
  links?: LinkDto[];
  collection: boolean;
  creationDate?: Date;
  plushieCreator?: PlushieCreatorDto;
  plushieVariants?: PlushieVariantDto[];
}