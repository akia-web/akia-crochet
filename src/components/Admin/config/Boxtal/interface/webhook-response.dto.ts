import { StatusWebhookEnum } from '@/enum/status-webhook-enum.ts';

export interface WebhookResponseDto {
  status: StatusWebhookEnum;
  createdAt: string;
  eventType: string;
  id: string;
  callbackUrl: string;
}
