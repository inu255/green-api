import { cn } from '@/lib/utils'
import type { ChatMessage } from '../api/types'

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
})

function statusLabel(message: ChatMessage): string {
  if (message.direction !== 'outgoing') {
    return ''
  }

  if (message.status === 'pending') {
    return 'Отправка…'
  }

  if (message.status === 'error') {
    return 'Не отправлено'
  }

  return ''
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isOutgoing = message.direction === 'outgoing'
  const isFailed = isOutgoing && message.status === 'error'
  const label = statusLabel(message)

  return (
    <div
      className={cn(
        'flex max-w-[78%] flex-col gap-1 rounded-2xl px-3 py-2 text-sm shadow-xs',
        isOutgoing ? 'self-end rounded-br-sm' : 'self-start rounded-bl-sm border bg-card',
        isOutgoing && !isFailed && 'bg-primary text-primary-foreground',
        isFailed && 'border border-destructive/30 bg-destructive/10 text-destructive',
      )}
    >
      <span className="break-words whitespace-pre-wrap">{message.text}</span>

      <span
        className={cn(
          'flex gap-2 self-end text-[11px]',
          isOutgoing && !isFailed ? 'text-primary-foreground/75' : 'text-muted-foreground',
          isFailed && 'text-destructive',
        )}
      >
        <span>{timeFormatter.format(new Date(message.timestamp))}</span>
        {label && <span>{label}</span>}
      </span>
    </div>
  )
}
