import { AlertTriangle, Info, Lightbulb, AlertCircle, Beaker } from 'lucide-react';
import { cn } from '@/lib/utils';

type CalloutType = 'note' | 'tip' | 'warning' | 'caution' | 'experimental';

const config: Record<CalloutType, { icon: React.ComponentType<{ className?: string }>; label: string; className: string }> = {
  note: {
    icon: Info,
    label: 'Note',
    className: 'border-blue-500/30 bg-blue-500/5 text-blue-200',
  },
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Warning',
    className: 'border-amber-500/30 bg-amber-500/5 text-amber-200',
  },
  caution: {
    icon: AlertCircle,
    label: 'Caution',
    className: 'border-red-500/30 bg-red-500/5 text-red-200',
  },
  experimental: {
    icon: Beaker,
    label: 'Experimental',
    className: 'border-purple-500/30 bg-purple-500/5 text-purple-200',
  },
};

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, label, className } = config[type];
  return (
    <div className={cn('my-4 rounded-lg border p-4', className)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-sm font-semibold">{title || label}</span>
      </div>
      <div className="text-sm leading-relaxed opacity-90">{children}</div>
    </div>
  );
}
