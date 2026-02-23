import type { CreatorDto } from '@/interfaces/creator.dto.ts';

export interface Form1EditProductDto {
  name: string;
  description: string;
  creator?: CreatorDto
  collection: boolean;
  isVisible: boolean;
}