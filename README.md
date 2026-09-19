# MAX Chat — GREEN-API

Тестовое задание: простой веб-интерфейс для отправки и получения текстовых сообщений
в мессенджере **MAX** через **[GREEN-API](https://green-api.com/max)**.

## Стек

- React 19 + TypeScript
- Vite
- `@tanstack/react-query` (queries, mutations, long-polling)
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (компоненты в `src/components/ui/`)
- Стилизация в духе [web.max.ru](https://web.max.ru/)

## Запуск

```bash
npm install
npm run dev
```

Откройте адрес из вывода Vite (обычно http://localhost:5173).

Проверка типов и production-сборка:

```bash
npm run build
```

## Как пользоваться

1. Введите `idInstance` и `apiTokenInstance` из
   [личного кабинета GREEN-API](https://console.green-api.com/). Данные проверяются методом
   `getStateInstance` и сохраняются в `localStorage`.
2. Нажмите «Создать чат» и введите номер телефона получателя (11 цифр для РФ, 12 для РБ) —
   номер резолвится в `chatId` методом `checkAccount` и открывается чат.
3. Напишите текстовое сообщение и отправьте его.
4. Ответ получателя из MAX появится в чате.

## Как это работает

### Отправка (требование 6)

`POST /waInstance{idInstance}/sendMessage/{apiTokenInstance}` с телом
`{ "chatId": "...", "message": "..." }`. Реализовано в `src/api/greenApi.ts`,
используется в `src/hooks/useSendMessage.ts` через `useMutation` с оптимистичным
добавлением сообщения в список.

### Получение (требование 7)

Технология HTTP API — `ReceiveNotification` + `DeleteNotification`:

- `src/hooks/useReceiveMessages.ts` выполняет long-polling методом
  `GET /receiveNotification?receiveTimeout=5` через `useQuery` c `refetchInterval`
  (react-query не запускает новый запрос и не отменяет текущий, пока предыдущий long-poll
  ещё выполняется, поэтому запросы не накладываются);
- каждое полученное уведомление подтверждается методом
  `DELETE /deleteNotification/{receiptId}` (мутация `useMutation`);
- обрабатываются только входящие текстовые сообщения (`typeWebhook === "incomingMessageReceived"`
  и `messageData.typeMessage === "textMessage"`); уведомления о статусах и прочие типы
  подтверждаются, но не отображаются.

### chatId в MAX

В MAX `chatId` — это числовой идентификатор пользователя (`"10000000"`), а не номер телефона.
Поэтому при создании чата номер резолвится методом
`POST /checkAccount/{apiTokenInstance}` с телом `{ "phoneNumber": 79991234567 }`,
который возвращает `{ "exist": true, "chatId": "10000000" }`. Дальше все отправки идут
по этому `chatId`.

## Структура

```
src/
├── api/          # fetch-клиент, методы GREEN-API, DTO-типы
├── hooks/        # react-query: queries, mutations, polling, кэш сообщений
├── lib/          # утилиты (нормализация номера, локальные id, cn)
├── components/   # UI на Tailwind + shadcn/ui
│   ├── ui/                  # компоненты shadcn/ui (button, input, dialog, alert, ...)
│   ├── LoginForm.tsx        # вход (idInstance / apiTokenInstance)
│   ├── ChatWindow.tsx       # оболочка чата: шапка + тело
│   ├── ChatConversation.tsx # переписка (монтируется только при активном чате)
│   ├── EmptyChatState.tsx   # пустое состояние с кнопкой «Создать чат»
│   └── NewChatDialog.tsx    # модалка создания чата
├── providers.tsx
├── App.tsx
└── main.tsx
```

## Особенности

- Запросы выполняются из браузера напрямую: GREEN-API отдаёт CORS-заголовки
  (`Access-Control-Allow-Origin: *`), поэтому прокси не нужен.
- **Автонастройка при входе.** После проверки кредов приложение вызывает `getSettings` и:
  - отклоняет вход, если это не MAX-инстанс (`typeInstance !== "v3"`) или если инстанс не
    авторизован (`stateInstance !== "authorized"`) — с понятным текстом ошибки;
  - если приём входящих выключен (`incomingWebhook !== "yes"`) или задан `webhookUrl`,
    автоматически вызывает `setSettings({ webhookUrl: "", incomingWebhook: "yes" })`.
  Это нужно потому, что **после создания инстанса все настройки уведомлений выключены**,
  и без этого `receiveNotification` всегда возвращает пусто.
  Учтите: `setSettings` перезапускает инстанс, а настройки применяются до 5 минут — в UI
  показывается соответствующая подсказка.
- **Организация чата.** По ТЗ (списка чатов в требованиях нет) приложение работает с одним
  активным чатом: пока чат не создан, в центре окна — кнопка «Создать чат», открывающая
  модалку с вводом номера; кнопка «Новый чат» в шапке появляется только когда номер уже
  введён. Модалку можно закрыть (Esc / крестик / клик по фону) — она никого не «запирает».
- Сообщения, пришедшие до создания чата, не отображаются, но очередь подтверждается,
  чтобы не блокировалась FIFO.
