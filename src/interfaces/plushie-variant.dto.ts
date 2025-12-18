import type { ImagesDto } from '@/interfaces/images.dto.ts';

export interface PlushieVariantDto {
  id?: number,
  randomId?: `${string}-${string}-${string}-${string}-${string}`;
  name: string;
  color: string;
  materials: string[];
  imagesFiles?: {file: File, row: number}[];
  stock: number;
  images: ImagesDto[];
  price: number;
  height: number;
  width: number;
  weight: number;
  depth: number;
}