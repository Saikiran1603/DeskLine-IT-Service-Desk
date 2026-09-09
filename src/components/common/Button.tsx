import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300 dark:bg-signal-teal dark:hover:bg-signal-tealDark dark:disabled:bg-ink-700',
  secondary: 'bg-white text-ink-700 dark:text-ink-200 border border-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800 disabled:text-ink-300 dark:bg-ink-800 dark:text-ink-200 dark:border-ink-600 dark:hover:bg-ink-700',
  ghost: 'bg-transparent text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 disabled:text-ink-300 dark:text-ink-300 dark:hover:bg-ink-800',
  danger: 'bg-signal-rose text-white hover:bg-signal-rose/90 disabled:bg-ink-200',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export function Button({ variant = 'secondary', size = 'md', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  )
}
