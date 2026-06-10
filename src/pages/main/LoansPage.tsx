import { CreditCard, Plus, FileText, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LoanLimitCard from '@/components/Loans/LoanLimitCard'

const loanTypes = [
  { label: 'Emergency Loan', desc: 'Quick access funds for emergencies', rate: '12% p.a.' },
  { label: 'Development Loan', desc: 'Long-term financing for personal growth', rate: '10% p.a.' },
  { label: 'School Fees Loan', desc: 'Education financing for your family', rate: '8% p.a.' },
]

const stats = [
  { label: 'Active Loans', value: '0', icon: CreditCard },
  { label: 'Total Borrowed', value: 'KES 0', icon: FileText },
  { label: 'Pending', value: '0', icon: Clock },
  { label: 'Cleared', value: '0', icon: CheckCircle2 },
]

export default function LoansPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-10 pb-4">
        <div>
          <h1 className="text-xl font-bold">Loans</h1>
          <p className="text-sm text-muted-foreground">Your loan accounts</p>
        </div>
      
      </div>

      <LoanLimitCard />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 px-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active loans — empty state */}
      <div className="mt-6 px-6">
        <p className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Active Loans
        </p>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <CreditCard className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-3 font-medium">No active loans</p>
          <p className="mt-1 text-sm text-muted-foreground text-center px-6">
            Apply for a loan and we'll process it within 24 hours
          </p>
          <Button className="mt-4">
            <Plus className="mr-1.5 size-4" /> Apply for a Loan
          </Button>
        </div>
      </div>

      {/* Loan products */}
      <div className="mt-6 px-6 pb-4">
        <p className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Loan Products
        </p>
        <div className="divide-y rounded-xl border bg-background">
          {loanTypes.map((loan) => (
            <div key={loan.label} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{loan.label}</p>
                <p className="text-xs text-muted-foreground">{loan.desc}</p>
              </div>
              <Badge variant="secondary" className="ml-3 shrink-0 text-xs">
                {loan.rate}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
