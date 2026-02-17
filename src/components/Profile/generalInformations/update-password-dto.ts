export interface UpdatePasswordDto {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
    checked: boolean;
}