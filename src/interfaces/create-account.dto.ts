export interface CreateAccountDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  checked: boolean;
}