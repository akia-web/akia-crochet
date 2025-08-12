export const checkInputIsNotNull = (value : string) => {
  return value.trim() !== '' && value.trim() !== '<p></p>'
}