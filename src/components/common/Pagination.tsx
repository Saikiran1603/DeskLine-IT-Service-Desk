import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  totalItems: number
  pageSize: number
}

export function Pagination({ page, totalPages, onChange, totalItems, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between border-t border-ink-100 dark:border-ink-700 px-4 py-3 text-sm text-ink-500">
      <span>
        Showing {start}–{end} of {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="rounded p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-2 font-medium text-ink-700 dark:text-ink-200">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="rounded p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
