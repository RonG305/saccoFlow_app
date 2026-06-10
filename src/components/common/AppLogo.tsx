import { Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 20, circle: 34, text: 'text-xl' },
  md: { icon: 26, circle: 44, text: 'text-2xl' },
  lg: { icon: 34, circle: 56, text: 'text-3xl' },
}

export function AppLogo({ className, size = 'md' }: AppLogoProps) {
  const s = sizes[size]
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Layers size={s.icon} strokeWidth={1.5} />
      <div className="relative flex items-center">
        <span
          className="absolute -left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ width: s.circle, height: s.circle }}
        />
        <span className={cn('relative font-bold tracking-tight', s.text)}>
          SaccoFlow
        </span>
      </div>
    </div>
  )
}
