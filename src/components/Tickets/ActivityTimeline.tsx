import { Circle } from 'lucide-react'
import type { ActivityEntry } from '@/types/ticket'

export function ActivityTimeline({ activity }: { activity: ActivityEntry[] }) {
  const sorted = [...activity].sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  return (
    <ol className="relative ml-2 border-l border-ink-200 pl-5">
      {sorted.map((entry) => (
        <li key={entry.id} className="mb-5 last:mb-0">
          <span className="absolute -left-[5px] mt-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-signal-teal">
            <Circle size={0} />
          </span>
          <p className="text-sm text-ink-800">{entry.message}</p>
          <p className="text-xs text-ink-400">
            {new Date(entry.timestamp).toLocaleString([], {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}{' '}
            · {entry.actorName}
          </p>
        </li>
      ))}
    </ol>
  )
}
