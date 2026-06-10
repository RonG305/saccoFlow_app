import {
  User, Mail, Phone, Hash, ChevronRight,
  Shield, Bell, HelpCircle, LogOut,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { logoutUser } from '@/actions/auth'

interface SettingItem {
  label: string
  icon: React.ElementType
  action?: () => void
  danger?: boolean
}

export default function AccountPage() {
  const navigate = useNavigate()
  const profile = JSON.parse(localStorage.getItem('member_profile') || 'null')
  const memberNumber = localStorage.getItem('member_number') ?? '—'

  const name = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
    : 'Member'
  const email = profile?.user?.email ?? '—'
  const phone = profile?.phone_number ?? '—'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const settings: SettingItem[] = [
    { label: 'Privacy & Security', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'Help & Support', icon: HelpCircle },
    {
      label: 'Sign Out',
      icon: LogOut,
      danger: true,
      action: () => {
        logoutUser()
        localStorage.clear()
        navigate('/', { replace: true })
      },
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-xl font-bold">Account</h1>
        <p className="text-sm text-muted-foreground">Your profile and settings</p>
      </div>

      {/* Profile card */}
      <div className="mx-6 rounded-2xl border bg-background p-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 text-lg">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold truncate">{name}</p>
              <Badge variant="secondary" className="text-xs shrink-0">
                {profile?.user?.account_type ?? 'Member'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="size-4 shrink-0" />
            <span className="truncate">{memberNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4 shrink-0" />
            <span className="truncate">{phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        </div>
      </div>

      {/* Profile info row */}
      <div className="mx-6 mt-4 grid grid-cols-3 divide-x rounded-xl border bg-background text-center">
        {[
          { label: 'City', value: profile?.city ?? '—' },
          { label: 'Country', value: profile?.country ?? '—' },
          { label: 'Status', value: profile?.user?.status ?? '—' },
        ].map(({ label, value }) => (
          <div key={label} className="py-3 px-2">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm font-medium capitalize truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="mt-6 px-6 pb-4">
        <p className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Settings
        </p>
        <div className="divide-y rounded-xl border bg-background">
          {settings.map(({ label, icon: Icon, action, danger }) => (
            <button
              key={label}
              onClick={action}
              className={[
                'flex w-full items-center gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-accent',
                danger ? 'text-destructive' : '',
              ].join(' ')}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left font-medium">{label}</span>
              {!danger && <ChevronRight className="size-4 text-muted-foreground" />}
            </button>
          ))}
        </div>
      </div>

      {/* Member info footer */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="size-3.5" />
          <span>Member No. {memberNumber}</span>
        </div>
      </div>
    </div>
  )
}
