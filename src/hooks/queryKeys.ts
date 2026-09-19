import type { Credentials } from '../api/types'

/**
 * Централизованные ключи кэша react-query.
 * Ключи зависят от инстанса/chatId, чтобы не смешивать данные разных сессий.
 */
export const queryKeys = {
  instanceState: (credentials: Credentials) =>
    ['instanceState', credentials.idInstance, credentials.apiTokenInstance] as const,
  messages: (chatId: string) => ['messages', chatId] as const,
  incomingNotification: (credentials: Credentials) =>
    ['incomingNotification', credentials.idInstance, credentials.apiTokenInstance] as const,
}
