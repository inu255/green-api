import { request } from './client'
import type {
  CheckAccountResponse,
  Credentials,
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  InstanceSettings,
  ReceiveNotificationResponse,
  SendMessageResponse,
  SetSettingsResponse,
  SettingsPatch,
} from './types'

/** Проверяет учётные данные и возвращает состояние инстанса. */
export function getStateInstance(credentials: Credentials) {
  return request<GetStateInstanceResponse>(credentials, 'getStateInstance')
}

/** Возвращает текущие настройки инстанса (в т.ч. typeInstance: 'v3' для MAX). */
export function getSettings(credentials: Credentials) {
  return request<InstanceSettings>(credentials, 'getSettings')
}

/**
 * Устанавливает настройки инстанса. Внимание: метод перезапускает инстанс,
 * а настройки применяются в течение 5 минут.
 */
export function setSettings(credentials: Credentials, settings: SettingsPatch) {
  return request<SetSettingsResponse>(credentials, 'setSettings', {
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    },
  })
}

/** Проверяет, есть ли MAX-аккаунт на номере, и возвращает его chatId. */
export function checkAccount(credentials: Credentials, phoneNumber: number) {
  return request<CheckAccountResponse>(credentials, 'checkAccount', {
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    },
  })
}

/** Отправляет текстовое сообщение в чат MAX (метод SendMessage). */
export function sendMessage(credentials: Credentials, chatId: string, message: string) {
  return request<SendMessageResponse>(credentials, 'sendMessage', {
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    },
  })
}

/**
 * Забирает одно входящее уведомление из очереди (технология HTTP API).
 * Long-polling: сервер держит запрос до receiveTimeout секунд и возвращает null, если очередь пуста.
 */
export function receiveNotification(credentials: Credentials, receiveTimeout: number) {
  return request<ReceiveNotificationResponse | null>(credentials, 'receiveNotification', {
    query: { receiveTimeout },
    init: { method: 'GET' },
  })
}

/** Подтверждает успешную обработку уведомления. */
export function deleteNotification(credentials: Credentials, receiptId: number) {
  return request<DeleteNotificationResponse>(credentials, 'deleteNotification', {
    tail: receiptId,
    init: { method: 'DELETE' },
  })
}
