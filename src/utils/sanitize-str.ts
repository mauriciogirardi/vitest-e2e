export function sanitizeStr(value: string) {
  const clean = !value || typeof value !== 'string' ? '' : value.trim().normalize()
  return clean
}