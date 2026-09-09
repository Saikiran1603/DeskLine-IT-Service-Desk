import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface WrapperProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  hint?: string
}

function FieldWrapper({ label, error, required, children, hint }: WrapperProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
        {required && <span className="text-signal-rose"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-signal-rose">{error}</span>}
    </label>
  )
}

const inputClass = (hasError?: string) =>
  `w-full rounded border px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-signal-teal/40 ${
    hasError ? 'border-signal-rose' : 'border-ink-200'
  }`

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function TextField({ label, error, required, hint, ...rest }: TextFieldProps) {
  return (
    <FieldWrapper label={label} error={error} required={required} hint={hint}>
      <input className={inputClass(error)} {...rest} />
    </FieldWrapper>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function TextAreaField({ label, error, required, hint, ...rest }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} error={error} required={required} hint={hint}>
      <textarea className={`${inputClass(error)} resize-y`} rows={4} {...rest} />
    </FieldWrapper>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({ label, error, required, options, placeholder, ...rest }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} error={error} required={required}>
      <select className={inputClass(error)} {...rest}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}
