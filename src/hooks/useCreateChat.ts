import { useMutation } from '@tanstack/react-query'
import { checkAccount } from '../api/greenApi'
import type { Chat, Credentials } from '../api/types'
import { formatPhoneNumber, normalizePhoneNumber } from '../lib/phone'

/**
 * Создаёт чат по номеру телефона: нормализует номер, проверяет его в MAX
 * (метод checkAccount) и получает chatId, который затем используется в SendMessage.
 */
export function useCreateChat(credentials: Credentials) {
  return useMutation({
    mutationFn: async (rawPhoneNumber: string): Promise<Chat> => {
      const phoneNumber = normalizePhoneNumber(rawPhoneNumber)
      if (!phoneNumber) {
        throw new Error('Введите корректный номер телефона: 11 цифр для РФ или 12 для РБ.')
      }

      const response = await checkAccount(credentials, Number(phoneNumber))
      if (!response.exist || !response.chatId) {
        throw new Error('В MAX нет аккаунта с таким номером телефона.')
      }

      return {
        chatId: response.chatId,
        phoneNumber,
        title: formatPhoneNumber(phoneNumber),
      }
    },
  })
}
