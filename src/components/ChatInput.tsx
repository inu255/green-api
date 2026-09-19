import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Loader2Icon, SendIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

interface ChatInputProps {
  onSend: (text: string) => Promise<unknown>
  isSending: boolean
}

export function ChatInput({ onSend, isSending }: ChatInputProps) {
  const [text, setText] = useState('')

  const send = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    setText('')
    onSend(trimmed).catch(() => {
      // статус сообщения помечается как «Не отправлено» прямо в списке
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    send()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <form className="flex items-end gap-2 border-t bg-card p-3" onSubmit={handleSubmit}>
      <Textarea
        className="max-h-36 min-h-9 flex-1 resize-none"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Написать сообщение…"
        rows={1}
      />
      <Button type="submit" size="icon-lg" disabled={!text.trim()} aria-label="Отправить">
        {isSending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
      </Button>
    </form>
  )
}
