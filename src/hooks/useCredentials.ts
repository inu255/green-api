import { useCallback, useState } from 'react'
import type { Credentials } from '../api/types'

const STORAGE_KEY = 'green-api-max-chat:credentials'

function readStoredCredentials(): Credentials | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<Credentials>
    if (typeof parsed.idInstance === 'string' && typeof parsed.apiTokenInstance === 'string') {
      return { idInstance: parsed.idInstance, apiTokenInstance: parsed.apiTokenInstance }
    }

    return null
  } catch {
    return null
  }
}

/** Хранит учётные данные GREEN-API в localStorage. */
export function useCredentials() {
  const [credentials, setCredentials] = useState<Credentials | null>(readStoredCredentials)

  const saveCredentials = useCallback((next: Credentials) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setCredentials(next)
  }, [])

  const resetCredentials = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setCredentials(null)
  }, [])

  return { credentials, saveCredentials, resetCredentials }
}
