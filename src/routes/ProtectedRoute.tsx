import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { Role } from '@/types/user'
import { LoadingState } from '@/components/common/States'

export function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode
  allow?: Role[]
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Checking your session…" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
