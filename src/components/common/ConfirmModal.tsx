import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      width="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-signal-rose/10 text-signal-rose">
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-ink-600 dark:text-ink-300">{message}</p>
      </div>
    </Modal>
  )
}
