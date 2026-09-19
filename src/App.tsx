import { useState } from 'react'
import type { Chat, Credentials } from './api/types'
import { ChatWindow } from './components/ChatWindow'
import { LoginForm } from './components/LoginForm'
import { NewChatDialog } from './components/NewChatDialog'
import { useCredentials } from './hooks/useCredentials'
import type { VerifiedInstance } from './hooks/useVerifyCredentials'

function App() {
  const { credentials, saveCredentials, resetCredentials } = useCredentials()
  const [chat, setChat] = useState<Chat | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [incomingConfigured, setIncomingConfigured] = useState(false)

  const handleLogin = (next: Credentials, verified: VerifiedInstance) => {
    saveCredentials(next)
    setIncomingConfigured(verified.configured)
  }

  const handleLogout = () => {
    setChat(null)
    setDialogOpen(false)
    setIncomingConfigured(false)
    resetCredentials()
  }

  if (!credentials) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
        <LoginForm onSubmit={handleLogin} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-svh max-w-3xl flex-col p-3 sm:p-4">
      <ChatWindow
        credentials={credentials}
        chat={chat}
        justConfigured={incomingConfigured}
        onDismissNote={() => setIncomingConfigured(false)}
        onNewChat={() => setDialogOpen(true)}
        onLogout={handleLogout}
      />

      <NewChatDialog
        credentials={credentials}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={(next) => {
          setChat(next)
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

export default App
