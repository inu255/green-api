import type { Chat, Credentials } from '../api/types'
import { useMessages } from '../hooks/useMessages'
import { useReceiveMessages } from '../hooks/useReceiveMessages'
import { useSendMessage } from '../hooks/useSendMessage'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { Alert, AlertDescription } from './ui/alert'

interface ChatConversationProps {
  credentials: Credentials
  chat: Chat
}

/** Активная переписка: сообщения, отправка и приём уведомлений. */
export function ChatConversation({ credentials, chat }: ChatConversationProps) {
  const messages = useMessages(chat.chatId)
  const sendMessage = useSendMessage(credentials, chat.chatId)
  const { notificationQuery } = useReceiveMessages(credentials, chat.chatId)

  return (
    <>
      {notificationQuery.isError && (
        <div className="px-3 pt-3">
          <Alert variant="destructive">
            <AlertDescription>
              Не удалось получать входящие сообщения. Проверьте, что в кабинете GREEN-API очищен
              webhookUrl и включён incomingWebhook.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <MessageList messages={messages} />

      <ChatInput
        onSend={(text) => sendMessage.mutateAsync(text)}
        isSending={sendMessage.isPending}
      />
    </>
  )
}
