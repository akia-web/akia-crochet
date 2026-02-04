export interface ParcelPointDtoBoxtal {
  code: string,
  location: LocationDto
  name: string,
}


interface LocationDto {
  city: string,
  country: string,
  position: { longitude: number, latitude: number },
  street: string,
  postalCode: string,
}


export interface ParcelPointWithDistanceDto {
  distanceFromSearchLocation: number,
  parcelPoint: ParcelPointDtoBoxtal
}