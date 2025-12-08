export const checkInputIsNotNull = (value: string): boolean => {
  return value.trim() !== '' && value.trim() !== '<p></p>';
};

export const checkInputIsNotNullAndANumber = (value: number) => {
  return !isNaN(value);
};

export const checkValidateEmail = (email: string): string => {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!email) {
    return 'Veuillez saisir votre email';
  } else if (!emailRegex.test(email)) {
    return 'Email invalide';
  } else {
    return '';
  }
};

export const PASSWORD_STRONG_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export const checkValidatePassword = (password: string): string => {

  if (!password) {
    return 'Veuillez saisir le mot de passe';
  } else if (!PASSWORD_STRONG_REGEX.test(password)) {
    return 'Mot de passe invalide, doit contenir 8 caracteres, 1 majuscule, 1 minuscule, 1 chiffre, 1 charactere special';
  } else {
    return '';
  }
};

export const checkPasswordSame = (pwd1: string, pwd2: string): string => {
  if (pwd1 !== pwd2) {
    return 'Les mots de passes ne sont pas les mêmes';
  } else {
    return '';
  }
};