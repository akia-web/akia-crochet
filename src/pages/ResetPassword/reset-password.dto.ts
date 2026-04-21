import type { LocationQueryValue } from 'vue-router';

export interface ResetPasswordDto {
  password: string;
  confirmPassword: string;
  checked: boolean;
  token: LocationQueryValue | LocationQueryValue[];
}