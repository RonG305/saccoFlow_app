import type { ReactNode } from 'react'
import { AppLogo } from './AppLogo'
import { Card } from '../ui/card'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Card className="flex min-h-dvh relative bottom-0 flex-col px-6">
      <div className="flex justify-center pt-12 pb-8">
        <AppLogo />
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer && (
        <div className="py-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  )
}
