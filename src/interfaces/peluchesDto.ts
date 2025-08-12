import type { LinkDto } from '@/interfaces/link.dto.ts';

export interface PeluchesDto {
  id?: number;
  name?: string;
  presentationImage?: string;
  description?: string;
  images?: string[];
  links?: LinkDto[];
  realisationTime?: number;
  creationDate?: Date;
}