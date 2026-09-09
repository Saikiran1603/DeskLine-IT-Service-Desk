import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { SelectField } from '@/components/common/FormField'
import type { Ticket } from '@/types/ticket'
import type { User } from '@/types/user'

interface AssignmentModalProps {
  ticket: Ticket
  agents: User[]
  onAssign: (agentId: string) => Promise<void>
  onUnassign: () => Promise<void>
  onClose: () => void
}

export function AssignmentModal({ ticket, agents, onAssign, onUnassign, onClose }: AssignmentModalProps) {
  const [agentId, setAgentId] = useState(ticket.assignedAgentId ?? '')
  const [submitting, setSubmitting] = useState(false)

  return (
    <Modal
      title="Assign Ticket"
      onClose={onClose}
      footer={
        <div className="flex justify-between">
          {ticket.assignedAgentId ? (
            <Button
              variant="ghost"
              onClick={async () => {
                setSubmitting(true)
                await onUnassign()
                setSubmitting(false)
                onClose()
              }}
              disabled={submitting}
            >
              Unassign
            </Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              disabled={!agentId || submitting}
              onClick={async () => {
                setSubmitting(true)
                await onAssign(agentId)
                setSubmitting(false)
                onClose()
              }}
            >
              {ticket.assignedAgentId ? 'Reassign' : 'Assign'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3 text-sm">
        <div className="rounded bg-ink-50 p-3">
          <p className="text-ink-400">Ticket</p>
          <p className="font-medium text-ink-900">{ticket.subject}</p>
        </div>
        <div className="rounded bg-ink-50 p-3">
          <p className="text-ink-400">Current Agent</p>
          <p className="font-medium text-ink-900">{ticket.assignedAgentName ?? 'Unassigned'}</p>
        </div>
        <SelectField
          label="Available Support Agents"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="Choose an agent"
          options={agents.map((a) => ({ value: a.id, label: a.fullName }))}
        />
      </div>
    </Modal>
  )
}
