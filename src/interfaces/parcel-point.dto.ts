export interface ParcelPointDto {
  code: string,
  location: LocationDto
  name: string,
  network: string,
  openingDays: OpeningDay[]
}


interface LocationDto {
  city: string,
  country: string,
  position: { longitude: string, latitude: string },
  street: string,
  zipCode: string,
}

interface OpeningDay {
  openingPeriod: { closingTime: string, openingTime: string }[];
  weekday: string;
}