import { helpers } from '@vuelidate/validators';
import parsePhoneNumberFromString, { type CountryCode } from 'libphonenumber-js';


export const phoneByCountry = (
  getCountryCode: () => CountryCode | undefined
) =>
  helpers.withMessage(
    'Numéro invalide',
    (value?: string) => {
      if (!value) return true

      const countryCode = getCountryCode()
      if (!countryCode) return false

      const phone = parsePhoneNumberFromString(value, countryCode)
      return phone?.isValid() ?? false
    }
  )