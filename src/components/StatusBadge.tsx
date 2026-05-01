import { Badge } from '@/components/ui/badge'
import { TripStatus } from '@/types'

const STATUS_MAP: Record<TripStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'info' | 'muted' | 'default' }> = {
  on_time:   { label: 'No Horário',        variant: 'success' },
  boarding:  { label: 'Embarque Imediato', variant: 'warning' },
  delayed:   { label: 'Atrasado',          variant: 'destructive' },
  departed:  { label: 'Partiu',            variant: 'muted' },
  arrived:   { label: 'Chegou',            variant: 'muted' },
  cancelled: { label: 'Cancelado',         variant: 'destructive' },
}

interface Props {
  status: TripStatus
  blink?: boolean
}

export default function StatusBadge({ status, blink }: Props) {
  const { label, variant } = STATUS_MAP[status]
  return (
    <Badge
      variant={variant as never}
      className={blink && status === 'boarding' ? 'blink font-bold uppercase tracking-wide' : 'font-semibold uppercase tracking-wide'}
    >
      {label}
    </Badge>
  )
}
