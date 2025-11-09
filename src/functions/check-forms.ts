export const checkInputIsNotNull = (value : string) => {
  return value.trim() !== '' && value.trim() !== '<p></p>'
}

export const checkInputIsNotNullAndANumber = (value: number) => {
  return !isNaN(value);
}