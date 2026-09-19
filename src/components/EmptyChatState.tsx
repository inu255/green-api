import { PlusIcon } from 'lucide-react'
import { Button } from './ui/button'

/** Пустое состояние: чат ещё не создан. */
export function EmptyChatState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-muted/30 p-6 text-center">
      <p className="text-sm text-muted-foreground">
        Чтобы начать переписку, создайте чат по номеру телефона.
      </p>
      <Button onClick={onNewChat}>
        <PlusIcon />
        Создать чат
      </Button>
    </div>
  )
}
