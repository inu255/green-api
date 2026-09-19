import { useState, type FormEvent } from 'react'
import { Loader2Icon } from 'lucide-react'
import type { Credentials } from '../api/types'
import { useVerifyCredentials, type VerifiedInstance } from '../hooks/useVerifyCredentials'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface LoginFormProps {
  onSubmit: (credentials: Credentials, verified: VerifiedInstance) => void
}

/** Экран входа: учётные данные инстанса GREEN-API. */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const verify = useVerifyCredentials()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const credentials: Credentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    }

    try {
      const verified = await verify.mutateAsync(credentials)
      onSubmit(credentials, verified)
    } catch {
      // текст ошибки показывается ниже через verify.error
    }
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">MAX Chat</h1>
        <p className="text-sm text-muted-foreground">Введите данные инстанса GREEN-API</p>
      </header>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="idInstance">idInstance</Label>
        <Input
          id="idInstance"
          value={idInstance}
          onChange={(event) => setIdInstance(event.target.value)}
          placeholder="1101000000"
          autoComplete="off"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="apiTokenInstance">apiTokenInstance</Label>
        <Input
          id="apiTokenInstance"
          value={apiTokenInstance}
          onChange={(event) => setApiTokenInstance(event.target.value)}
          placeholder="d75b3a66374942c5b3c019c698abc2067e151558acbd451234"
          autoComplete="off"
          required
        />
      </div>

      {verify.error && (
        <Alert variant="destructive">
          <AlertDescription>{verify.error.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={verify.isPending}>
        {verify.isPending && <Loader2Icon className="animate-spin" />}
        {verify.isPending ? 'Проверяем…' : 'Войти'}
      </Button>
    </form>
  )
}
