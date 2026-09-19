import type { QueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '../api/types'
import { queryKeys } from './queryKeys'

/** Общее «пустое» значение для кэша сообщений (массив никогда не мутируется). */
export const EMPTY_MESSAGES: ChatMessage[] = []

export function appendCachedMessage(queryClient: QueryClient, chatId: string, message: ChatMessage) {
  queryClient.setQueryData<ChatMessage[]>(queryKeys.messages(chatId), (previous = EMPTY_MESSAGES) => [
    ...previous,
    message,
  ])
}

export function patchCachedMessage(
  queryClient: QueryClient,
  chatId: string,
  id: string,
  patch: Partial<ChatMessage>,
) {
  queryClient.setQueryData<ChatMessage[]>(queryKeys.messages(chatId), (previous = EMPTY_MESSAGES) =>
    previous.map((message) => (message.id === id ? { ...message, ...patch } : message)),
  )
}
