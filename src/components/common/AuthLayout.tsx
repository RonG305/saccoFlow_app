import type { ReactNode } from 'react'
import { AppLogo } from './AppLogo'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col px-6">
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
    </div>
  )
}
