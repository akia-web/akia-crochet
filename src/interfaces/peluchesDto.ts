import type { LinkDto } from '@/interfaces/link.dto.ts';
import type { ImagesDto } from '@/interfaces/images.dto.ts';

export interface PeluchesDto {
  id?: number;
  name?: string;
  presentationImage?: string;
  description?: string;
  images?: ImagesDto[];
  links?: LinkDto[];
  price?: number;
  creationDate?: Date;
}