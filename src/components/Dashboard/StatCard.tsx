import type { ComponentType } from 'react'

interface StatCardProps {
  label: string
  value: number
  icon: ComponentType<{ size?: number }>
  tone?: 'default' | 'teal' | 'amber' | 'rose' | 'moss' | 'violet'
}

const TONES: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-ink-100 text-ink-700',
  teal: 'bg-signal-teal/10 text-signal-tealDark',
  amber: 'bg-signal-amber/10 text-signal-amber',
  rose: 'bg-signal-rose/10 text-signal-rose',
  moss: 'bg-signal-moss/10 text-signal-moss',
  violet: 'bg-signal-violet/10 text-signal-violet',
}

export function StatCard({ label, value, icon: Icon, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-md border border-ink-100 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-ink-900">{value}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded ${TONES[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}
