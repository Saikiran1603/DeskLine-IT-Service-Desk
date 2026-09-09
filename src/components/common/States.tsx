import { Inbox, Loader2, ServerCrash } from 'lucide-react'
import type { ReactNode } from 'react'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <Loader2 className="animate-spin" size={26} />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-ink-200 py-16 px-6 text-center">
      <Inbox className="text-ink-300 mb-1" size={28} />
      <p className="text-sm font-medium text-ink-700">{title}</p>
      {description && <p className="text-sm text-ink-400 max-w-sm">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-signal-rose/30 bg-signal-rose/5 py-14 px-6 text-center">
      <ServerCrash className="text-signal-rose mb-1" size={26} />
      <p className="text-sm font-medium text-signal-rose">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-ink-700 underline underline-offset-2 hover:text-ink-900"
        >
          Try again
        </button>
      )}
    </div>
  )
}
