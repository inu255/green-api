/**
 * Приводит ввод пользователя к формату, который принимает checkAccount:
 * только цифры, 11 (РФ) или 12 (РБ) символов.
 * Возвращает null, если номер некорректен.
 */
export function normalizePhoneNumber(input: string): string | null {
  const digits = input.replace(/\D/g, '')

  if (digits.length === 10) {
    return `7${digits}`
  }

  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}`
  }

  if ((digits.length === 11 && digits.startsWith('7')) || digits.length === 12) {
    return digits
  }

  return null
}

/** Форматирует номер для отображения: +7 999 123-45-67. */
export function formatPhoneNumber(digits: string): string {
  if (digits.length === 11) {
    return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }

  if (digits.length === 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`
  }

  return `+${digits}`
}
