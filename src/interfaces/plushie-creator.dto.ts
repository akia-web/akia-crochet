import type { SocialMediaDto } from '@/interfaces/social-media.dto.ts';

export interface PlushieCreatorDto {
  id?: number;
  name?: string;
  socialMedia?: SocialMediaDto[];
}