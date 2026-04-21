import { PASSWORD_STRONG_REGEX } from '@/functions/check-forms.ts';
import { helpers } from '@vuelidate/validators';

export const strongPassword = helpers.withMessage(
  'Le mot de passe doit contenir 8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial',
  (value?: string) => {
    if (!value) return true;

    return PASSWORD_STRONG_REGEX.test(value);
  }
);