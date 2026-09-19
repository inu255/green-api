import { useMutation } from '@tanstack/react-query'
import { getSettings, getStateInstance, setSettings } from '../api/greenApi'
import type { Credentials, InstanceState } from '../api/types'

/** Значение typeInstance, которое возвращает инстанс мессенджера MAX. */
const MAX_INSTANCE_TYPE = 'v3'

export interface VerifiedInstance {
  stateInstance: InstanceState
  /** true, если пришлось включить приём входящих через setSettings. */
  configured: boolean
}

/**
 * Проверяет учётные данные и готовит инстанс к приёму сообщений:
 * getStateInstance (валидация) → getSettings (тип инстанса и настройки) →
 * setSettings, если приём входящих выключен или задан webhookUrl.
 */
export function useVerifyCredentials() {
  return useMutation({
    mutationFn: async (credentials: Credentials): Promise<VerifiedInstance> => {
      const { stateInstance } = await getStateInstance(credentials)

      if (stateInstance !== 'authorized') {
        throw new Error(
          `Инстанс не авторизован (stateInstance: "${stateInstance}"). ` +
            'Авторизуйте инстанс в кабинете GREEN-API по QR-коду и попробуйте снова.',
        )
      }

      const settings = await getSettings(credentials)

      if (settings.typeInstance !== MAX_INSTANCE_TYPE) {
        throw new Error(
          `Это не MAX-инстанс (typeInstance: "${settings.typeInstance}"). ` +
            'Создайте инстанс GREEN-API для мессенджера MAX.',
        )
      }

      const receivingDisabled = settings.incomingWebhook !== 'yes'
      const webhookConfigured = settings.webhookUrl !== ''

      if (receivingDisabled || webhookConfigured) {
        await setSettings(credentials, { webhookUrl: '', incomingWebhook: 'yes' })
        return { stateInstance, configured: true }
      }

      return { stateInstance, configured: false }
    },
  })
}

