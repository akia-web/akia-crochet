import type { LinkDto } from '@/interfaces/link.dto.ts';
import type { ImagesDto } from '@/interfaces/images.dto.ts';
import type { PlushieCreatorDto } from '@/interfaces/plushie-creator.dto.ts';

export interface PeluchesDto {
  id?: number;
  name?: string;
  presentationImage?: string;
  description?: string;
  images?: ImagesDto[];
  links?: LinkDto[];
  price?: number;
  creationDate?: Date;
  plushieCreator?: PlushieCreatorDto;
  height?: number;
  width?: number;
}