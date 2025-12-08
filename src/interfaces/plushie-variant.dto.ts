import type { ImagesDto } from '@/interfaces/images.dto.ts';

export interface PlushieVariantDto {
  id?: number,
  randomId?: `${string}-${string}-${string}-${string}-${string}`;
  name: string;
  color: string;
  materials: string[];
  imagesFiles?: File[];
  stock: number;
  images: ImagesDto[];
}