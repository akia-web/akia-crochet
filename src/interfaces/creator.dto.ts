import type { SocialMediaDto } from '@/interfaces/social-media.dto.ts';

export interface creatorDto {
  id?: number;
  name?: string;
  socialMedia?: SocialMediaDto[];
}