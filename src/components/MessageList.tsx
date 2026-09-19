import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../api/types'
import { MessageBubble } from './MessageBubble'

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-muted/30 p-4">
      {messages.length === 0 ? (
        <p className="m-auto text-sm text-muted-foreground">Сообщений пока нет. Напишите первым.</p>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}
      <div ref={bottomRef} />
    </div>
  )
}
