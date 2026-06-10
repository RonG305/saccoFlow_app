import { useEffect, useState } from 'react'
import { Bell, TrendingUp, CreditCard, PiggyBank, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShareCard } from '@/components/shares/ShareCard'
import { getMemberShareAccount } from '@/data/organization/shares'
import type { ShareAccount } from '@/types/shares'

const quickActions = [
  { label: 'Buy Shares', icon: TrendingUp, to: '/shares' },
  { label: 'Apply Loan', icon: CreditCard, to: '/loans' },
  { label: 'Dividends', icon: PiggyBank, to: '/dividends' },
]

export default function HomePage() {
  const [account, setAccount] = useState<ShareAccount | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const memberId = localStorage.getItem('member_id')
    if (!memberId) { setLoading(false); return }
    getMemberShareAccount(memberId)
      .then(setAccount)
      .finally(() => setLoading(false))
  }, [])

  const profile = JSON.parse(localStorage.getItem('member_profile') || 'null')
  const firstName = profile?.first_name ?? 'Member'

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-10 pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Good day,</p>
          <h1 className="text-xl font-bold">{firstName}</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="size-5" />
        </Button>
      </div>

      {/* Digital share card */}
      <div className="px-6">
        {loading ? (
          <Skeleton className="h-52 w-full rounded-3xl" />
        ) : (
          <ShareCard account={account} />
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-6 px-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Actions
        </p>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ label, icon: Icon }) => (
            <Card key={label} className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <p className="text-center text-xs font-medium leading-tight">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 px-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Activity
          </p>
          <Button variant="ghost" size="sm" className="-mr-2 text-primary">
            View all <ChevronRight className="ml-1 size-3" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="divide-y rounded-xl border bg-background">
            {account ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Share Account Opened</p>
                  <p className="text-xs text-muted-foreground">{account.account_number}</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No recent activity
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
