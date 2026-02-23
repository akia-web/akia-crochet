import type { LinkDto } from '@/interfaces/link.dto.ts';
import type { ImagesDto } from '@/interfaces/images.dto.ts';
import type { CreatorDto } from '@/interfaces/creator.dto.ts';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto.ts';

export interface ProductDto {
  id?: number;
  name?: string;
  description?: string;
  links?: LinkDto[];
  collection: boolean;
  creationDate?: Date;
  creator?: CreatorDto;
  productVariants?: ProductVariantDto[];
  isVisible: boolean;
}