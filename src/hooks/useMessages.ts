import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ChatMessage } from '../api/types'
import { queryKeys } from './queryKeys'
import { EMPTY_MESSAGES } from './messageCache'

/**
 * Читает сообщения чата из кэша react-query.
 * queryFn намеренно не делает сетевых запросов: список наполняется при отправке
 * сообщений и при получении входящих уведомлений.
 */
export function useMessages(chatId: string): ChatMessage[] {
  const messagesKey = useMemo(() => queryKeys.messages(chatId), [chatId])

  const query = useQuery({
    queryKey: messagesKey,
    queryFn: () => EMPTY_MESSAGES,
    initialData: EMPTY_MESSAGES,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return query.data ?? EMPTY_MESSAGES
}
