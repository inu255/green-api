import { XIcon } from 'lucide-react'
import type { Chat, Credentials } from '../api/types'
import { ChatConversation } from './ChatConversation'
import { ChatHeader } from './ChatHeader'
import { EmptyChatState } from './EmptyChatState'
import { Alert, AlertAction, AlertDescription } from './ui/alert'
import { Button } from './ui/button'

interface ChatWindowProps {
  credentials: Credentials
  chat: Chat | null
  justConfigured: boolean
  onDismissNote: () => void
  onNewChat: () => void
  onLogout: () => void
}

/** Оболочка чата: шапка всегда, тело — переписка или пустое состояние. */
export function ChatWindow({
  credentials,
  chat,
  justConfigured,
  onDismissNote,
  onNewChat,
  onLogout,
}: ChatWindowProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <ChatHeader chat={chat} onNewChat={onNewChat} onLogout={onLogout} />

      {justConfigured && (
        <Alert className="rounded-none border-x-0 border-t-0 bg-muted/60">
          <AlertDescription>
            Приём входящих включён автоматически (incomingWebhook = yes, webhookUrl очищен).
            Настройки инстанса применяются до 5 минут, поэтому ответ может прийти не сразу.
          </AlertDescription>
          <AlertAction>
            <Button variant="ghost" size="icon-xs" onClick={onDismissNote} aria-label="Скрыть">
              <XIcon />
            </Button>
          </AlertAction>
        </Alert>
      )}

      {chat ? (
        <ChatConversation credentials={credentials} chat={chat} />
      ) : (
        <EmptyChatState onNewChat={onNewChat} />
      )}
    </section>
  )
}
