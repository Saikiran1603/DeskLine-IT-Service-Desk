import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Router as RouterIcon, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { TextField } from '@/components/common/FormField'
import { Button } from '@/components/common/Button'

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@deskline.com' },
  { role: 'Support Agent', email: 'agent1@deskline.com' },
  { role: 'Employee', email: 'employee1@deskline.com' },
]

export default function LoginPage() {
  const { user, login, isLoading: sessionLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!sessionLoading && user) return <Navigate to="/dashboard" replace />

  function validate() {
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setFormError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-teal text-white">
            <RouterIcon size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DeskLine</span>
        </div>

        <div className="rounded-md bg-white p-7 shadow-card">
          <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-50">Sign in to your account</h1>
          <p className="mt-1 text-sm text-ink-400">IT Service Desk & Ticket Management</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <TextField
              label="Email"
              type="email"
              placeholder="you@deskline.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />
            <TextField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            {formError && (
              <p className="rounded bg-signal-rose/10 px-3 py-2 text-sm font-medium text-signal-rose">
                {formError}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={submitting} className="mt-1 w-full">
              <LogIn size={16} />
              {submitting ? 'Signing in…' : 'Log In'}
            </Button>
          </form>
        </div>

        <div className="mt-5 rounded-md border border-ink-800 bg-ink-900 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
            Demo credentials
          </p>
          <ul className="space-y-1 text-xs text-ink-300">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email} className="flex justify-between">
                <span>{a.role}</span>
                <span className="font-mono">{a.email} / password123</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
