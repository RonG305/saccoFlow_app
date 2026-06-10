import { useEffect, useState } from 'react'
import { Search, MoreVertical } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getMemberShareAccount, getMemberShareStatement } from '@/data/organization/shares'
import type { ShareAccount, ShareStatement } from '@/types/shares'
import { formatKES, formatDate } from '@/utils/format'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  approved: 'default',
  pending: 'secondary',
  rejected: 'destructive',
  cancelled: 'outline',
}

const statusLabel: Record<string, string> = {
  coop_purchase: 'Co-op Purchase',
  member_purchase: 'Purchase',
  transfer: 'Transfer',
  coop_sale: 'Co-op Sale',
  member_sale: 'Sale',
}

function ShareSummary({ account, loading }: { account: ShareAccount | null; loading: boolean }) {
  if (loading) return <Skeleton className="h-24 w-full rounded-2xl" />
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Total Shares', value: account?.total_shares ?? 0 },
        { label: 'Total Value', value: formatKES(account?.total_value ?? 0) },
      ].map(({ label, value }) => (
        <Card key={label}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-bold leading-tight">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function SharesPage() {
  const [account, setAccount] = useState<ShareAccount | null>(null)
  const [statements, setStatements] = useState<ShareStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const memberId = localStorage.getItem('member_id')
    if (!memberId) { setLoading(false); return }
    Promise.all([
      getMemberShareAccount(memberId),
      getMemberShareStatement(memberId, { limit: 20 }),
    ]).then(([acc, stmt]) => {
      setAccount(acc)
      if (!('error' in stmt)) setStatements(stmt.data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = statements.filter(s =>
    (statusLabel[s.transaction_type] ?? s.transaction_type)
      .toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-xl font-bold">Shares</h1>
        <p className="text-sm text-muted-foreground">Manage your share account</p>
      </div>

      {/* Summary stats */}
      <div className="px-6">
        <ShareSummary account={account} loading={loading} />
      </div>

      {/* Search */}
      <div className="mt-4 px-6 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Transaction history */}
      <div className="mt-4 px-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Transaction History
          </p>
          {statements.length > 0 && (
            <span className="text-xs text-muted-foreground">{statements.length} records</span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border py-8 text-center text-sm text-muted-foreground">
            {search ? 'No transactions match your search.' : 'No transactions yet.'}
          </div>
        ) : (
          <div className="divide-y rounded-xl border bg-background">
            {filtered.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {statusLabel[tx.transaction_type] ?? tx.transaction_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.number_of_shares} shares · {formatDate(tx.created_at)}
                  </p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <Badge variant={statusVariant[tx.transaction_type] ?? 'secondary'} className="text-xs">
                    {formatKES(tx.amount)}
                  </Badge>
                  <Button variant="ghost" size="icon" className="-mr-1 size-7">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
