/** Учётные данные инстанса GREEN-API. */
export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

/** Состояние инстанса (метод getStateInstance). */
export type InstanceState =
  | 'authorized'
  | 'notAuthorized'
  | 'blocked'
  | 'sleepMode'
  | 'starting'
  | 'yellowCard'

export interface GetStateInstanceResponse {
  stateInstance: InstanceState
}

/** Настройки инстанса (методы getSettings / setSettings). */
export interface InstanceSettings {
  wid: string
  /** Версия интерфейса: 'v3' для мессенджера MAX, 'whatsapp' для WhatsApp. */
  typeInstance: string
  webhookUrl: string
  webhookUrlToken?: string
  incomingWebhook: 'yes' | 'no'
  outgoingWebhook?: 'yes' | 'no'
  stateWebhook?: 'yes' | 'no'
}

/** Ответ метода setSettings. */
export interface SetSettingsResponse {
  saveSettings: boolean
}

/** Подмножество настроек, которое отправляется в setSettings. */
export interface SettingsPatch {
  webhookUrl?: string
  incomingWebhook?: 'yes' | 'no'
}

/** Ответ метода checkAccount: есть ли MAX-аккаунт на номере. */
export interface CheckAccountResponse {
  exist: boolean
  chatId: string
  fromCache?: boolean
}

/** Ответ метода sendMessage. */
export interface SendMessageResponse {
  idMessage: string
}

/** Данные отправителя входящего уведомления. */
export interface SenderData {
  chatId: string
  chatName?: string
  chatType?: 'user' | 'group'
  sender: string
  senderName?: string
  senderType?: string
  senderContactName?: string
  senderPhoneNumber?: number
}

/** Данные о содержимом сообщения. */
export interface MessageData {
  typeMessage: string
  textMessageData?: {
    textMessage: string
    isForwarded?: boolean
    forwardingScore?: number
  }
}

/** Тело входящего уведомления. Нас интересует только incomingMessageReceived. */
export interface NotificationBody {
  typeWebhook: string
  instanceData?: {
    idInstance: number
    wid: string
    typeInstance: string
  }
  timestamp?: number
  idMessage?: string
  senderData?: SenderData
  messageData?: MessageData
}

/** Ответ метода receiveNotification. null — очередь пуста. */
export interface ReceiveNotificationResponse {
  receiptId: number
  body: NotificationBody
}

/** Ответ метода deleteNotification. */
export interface DeleteNotificationResponse {
  result: boolean
}

/** Направление сообщения в чате. */
export type MessageDirection = 'incoming' | 'outgoing'

/** Статус отправки исходящего сообщения. */
export type MessageStatus = 'pending' | 'sent' | 'error'

/** Сообщение, отображаемое в интерфейсе чата. */
export interface ChatMessage {
  id: string
  chatId: string
  text: string
  timestamp: number
  direction: MessageDirection
  status: MessageStatus
  senderName?: string
}

/** Активный чат (получатель). */
export interface Chat {
  chatId: string
  phoneNumber: string
  title: string
}
