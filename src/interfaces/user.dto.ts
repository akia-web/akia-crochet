import type {RoleEnum} from '@/enum/role.enum.ts';

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  googleId: string;
  creationDate: Date;
  role: RoleEnum;
}