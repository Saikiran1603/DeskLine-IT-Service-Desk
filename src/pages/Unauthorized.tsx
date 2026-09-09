import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/common/Button'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-50 px-4 text-center">
      <ShieldAlert size={40} className="text-signal-rose" />
      <h1 className="text-lg font-semibold text-ink-900">You don't have access to this page</h1>
      <p className="max-w-sm text-sm text-ink-500">
        Your account role doesn't permit this action. If you believe this is a mistake, contact your administrator.
      </p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </div>
  )
}
