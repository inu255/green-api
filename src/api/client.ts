import type { Credentials } from './types'

const API_BASE_URL = 'https://api.green-api.com'

/** Ошибка ответа GREEN-API: несёт HTTP-статус и разобранное тело ответа. */
export class GreenApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
    this.body = body
  }
}

function buildUrl(credentials: Credentials, method: string, tail?: string | number): string {
  const base = `${API_BASE_URL}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`
  return tail === undefined ? base : `${base}/${tail}`
}

function extractMessage(payload: unknown, status: number): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    const candidate = record.message ?? record.reason
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate
    }
  }

  return `Запрос к GREEN-API завершился с ошибкой (HTTP ${status})`
}

interface RequestOptions {
  /** Дополнительный сегмент пути, например receiptId для deleteNotification. */
  tail?: string | number
  /** Query-параметры запроса. */
  query?: Record<string, string | number>
  init?: RequestInit
}

/** Выполняет запрос к GREEN-API и возвращает разобранный JSON. */
export async function request<T>(
  credentials: Credentials,
  method: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = new URL(buildUrl(credentials, method, options.tail))

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, options.init)
  const raw = await response.text()

  let payload: unknown = null
  if (raw) {
    try {
      payload = JSON.parse(raw)
    } catch {
      payload = raw
    }
  }

  if (!response.ok) {
    throw new GreenApiError(extractMessage(payload, response.status), response.status, payload)
  }

  return payload as T
}
