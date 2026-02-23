import type { SocialMediaDto } from '@/interfaces/social-media.dto.ts';

export interface CreatorDto {
  id?: number;
  name?: string;
  socialMedia?: SocialMediaDto[];
}