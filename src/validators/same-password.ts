import { helpers } from '@vuelidate/validators';

export const samePassword = (
  getpassword: () => string | undefined
) =>
  helpers.withMessage(
    'Mots de passe non similaire',
    (value?: string) => {
      if (!value) {
        return true;
      }

      const password: string | undefined = getpassword();
      return password === value;
    }
  );