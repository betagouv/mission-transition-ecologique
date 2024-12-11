export const normalizeString = (str: string) => {
  // remove accents, spaces, ponctuation and to lowerCase
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-\s]/g, '')
    .trim()
}
