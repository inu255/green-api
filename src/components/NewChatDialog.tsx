import { useState, type FormEvent } from 'react'
import { Loader2Icon } from 'lucide-react'
import { PatternFormat } from 'react-number-format'
import type { Chat, Credentials } from '../api/types'
import { useCreateChat } from '../hooks/useCreateChat'
import { normalizePhoneNumber } from '../lib/phone'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface NewChatDialogProps {
  credentials: Credentials
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (chat: Chat) => void
}

/** Диалог создания чата по номеру телефона получателя. */
export function NewChatDialog({ credentials, open, onOpenChange, onCreated }: NewChatDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const createChat = useCreateChat(credentials)

  const canSubmit = normalizePhoneNumber(phoneNumber) !== null

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      createChat.reset()
    }
    onOpenChange(next)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const chat = await createChat.mutateAsync(phoneNumber)
      setPhoneNumber('')
      createChat.reset()
      onCreated(chat)
    } catch {
      // текст ошибки показывается ниже через createChat.error
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Новый чат</DialogTitle>
            <DialogDescription>Введите номер телефона получателя в MAX.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phoneNumber">Номер телефона</Label>
            <PatternFormat
              id="phoneNumber"
              value={phoneNumber}
              format="+7 (###) ###-##-##"
              customInput={Input}
              onValueChange={(values) => setPhoneNumber(values.value)}
              placeholder="+7 999 123-45-67"
              inputMode="tel"
              autoComplete="off"
              required
            />
          </div>

          {createChat.error && (
            <Alert variant="destructive">
              <AlertDescription>{createChat.error.message}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!canSubmit || createChat.isPending}>
              {createChat.isPending && <Loader2Icon className="animate-spin" />}
              {createChat.isPending ? 'Ищем получателя…' : 'Создать чат'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
