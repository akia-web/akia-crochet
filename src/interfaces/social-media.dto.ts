import type { SocialMediaEnum } from '@/enum/social-media.ts';

export interface SocialMediaDto {
  id?: number;
  type: SocialMediaEnum;
  url: string;
}