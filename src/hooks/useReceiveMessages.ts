import { useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteNotification, receiveNotification } from '../api/greenApi'
import type { ChatMessage, Credentials, NotificationBody } from '../api/types'
import { appendCachedMessage } from './messageCache'
import { queryKeys } from './queryKeys'

/** Сколько секунд сервер MAX держит long-poll, если очередь пуста. */
const RECEIVE_TIMEOUT_SECONDS = 5
/**
 * Интервал опроса. react-query не запускает новый запрос и не отменяет текущий,
 * пока предыдущий long-poll ещё выполняется, поэтому запросы не накладываются.
 */
const POLL_INTERVAL_MS = 1000

function toIncomingMessage(notification: NotificationBody): ChatMessage | null {
  if (notification.typeWebhook !== 'incomingMessageReceived') {
    return null
  }

  if (notification.messageData?.typeMessage !== 'textMessage') {
    return null
  }

  const senderData = notification.senderData
  const text = notification.messageData?.textMessageData?.textMessage
  if (!senderData || typeof text !== 'string') {
    return null
  }

  return {
    id: notification.idMessage ?? `${senderData.chatId}-${notification.timestamp ?? 0}`,
    chatId: senderData.chatId,
    text,
    timestamp: (notification.timestamp ?? Math.floor(Date.now() / 1000)) * 1000,
    direction: 'incoming',
    status: 'sent',
    senderName: senderData.senderName ?? senderData.senderContactName,
  }
}

/**
 * Получение сообщений по технологии HTTP API:
 * long-polling методом receiveNotification и подтверждение методом deleteNotification.
 * Мы подтверждаем (удаляем) все уведомления, чтобы очередь не забивалась, но показываем
 * только текстовые сообщения активного чата.
 */
export function useReceiveMessages(credentials: Credentials, chatId: string) {
  const queryClient = useQueryClient()
  const processedReceipts = useRef<Set<number>>(new Set())

  const notificationQuery = useQuery({
    queryKey: queryKeys.incomingNotification(credentials),
    queryFn: () => receiveNotification(credentials, RECEIVE_TIMEOUT_SECONDS),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: false,
    // Отключаем структурное сравнение, чтобы каждый опрос давал новую ссылку на данные
    // и эффект ниже срабатывал даже на повторяющихся ответах (повторное подтверждение).
    structuralSharing: false,
  })

  const { mutate: acknowledge } = useMutation({
    mutationFn: (receiptId: number) => deleteNotification(credentials, receiptId),
  })

  useEffect(() => {
    const notification = notificationQuery.data
    if (!notification) {
      return
    }

    if (!processedReceipts.current.has(notification.receiptId)) {
      processedReceipts.current.add(notification.receiptId)

      const message = toIncomingMessage(notification.body)
      if (message && message.chatId === chatId) {
        appendCachedMessage(queryClient, chatId, message)
      }
    }

    // Подтверждаем на каждом опросе: если предыдущий deleteNotification не прошёл,
    // уведомление осталось во главе очереди и блокирует FIFO.
    acknowledge(notification.receiptId)
  }, [notificationQuery.data, chatId, queryClient, acknowledge])

  return { notificationQuery }
}
