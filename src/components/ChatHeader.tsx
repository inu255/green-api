import { LogOutIcon, MessageSquarePlusIcon, UserIcon } from 'lucide-react'
import type { Chat } from '../api/types'
import { Button } from './ui/button'

interface ChatHeaderProps {
  chat: Chat | null
  onNewChat: () => void
  onLogout: () => void
}

function avatarText(title: string): string {
  const letter = title.replace(/[^\dA-Za-zА-Яа-я]/g, '').slice(0, 1)
  return letter ? letter.toUpperCase() : '?'
}

/** Шапка чата. Без активного чата показывает плейсхолдеры вместо номера и chatId. */
export function ChatHeader({ chat, onNewChat, onLogout }: ChatHeaderProps) {
  const title = chat ? chat.title : 'Новый чат'
  const subtitle = chat ? `chatId: ${chat.chatId}` : 'Введите номер телефона получателя'

  return (
    <header className="flex items-center gap-3 border-b px-3 py-2">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {chat ? avatarText(chat.title) : <UserIcon className="size-4" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {chat && (
          <Button variant="ghost" size="sm" onClick={onNewChat}>
            <MessageSquarePlusIcon />
            Новый чат
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <LogOutIcon />
          Выйти
        </Button>
      </div>
    </header>
  )
}
