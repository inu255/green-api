import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '../api/greenApi'
import type { ChatMessage, Credentials } from '../api/types'
import { createLocalId } from '../lib/id'
import { appendCachedMessage, patchCachedMessage } from './messageCache'

/**
 * Отправляет текстовое сообщение в MAX (метод SendMessage).
 * Оптимистично добавляет сообщение в кэш чата и помечает его статус по итогу запроса.
 */
export function useSendMessage(credentials: Credentials, chatId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (text: string) => sendMessage(credentials, chatId, text),
    onMutate: (text) => {
      const localId = createLocalId()
      const optimisticMessage: ChatMessage = {
        id: localId,
        chatId,
        text,
        timestamp: Date.now(),
        direction: 'outgoing',
        status: 'pending',
      }

      appendCachedMessage(queryClient, chatId, optimisticMessage)
      return { localId }
    },
    onSuccess: (_response, _text, context) => {
      if (!context) return
      patchCachedMessage(queryClient, chatId, context.localId, { status: 'sent' })
    },
    onError: (_error, _text, context) => {
      if (!context) return
      patchCachedMessage(queryClient, chatId, context.localId, { status: 'error' })
    },
  })
}
