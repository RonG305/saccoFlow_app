import { Icon } from '@iconify/react'
import type { ShareAccount } from '@/types/shares'
import { formatKES, formatCardNumber, getHolderName } from '@/utils/format'
import { getMemberProfile } from '@/utils/storage'

export function ShareCard({ account }: { account: ShareAccount | null }) {
  const holderName = getHolderName(getMemberProfile())
  const formattedNumber = formatCardNumber(account?.account_number)

  return (
    <div
      className="relative overflow-hidden rounded-md p-4 text-white select-none"
      style={{
        background: 'linear-gradient(135deg, #018749 0%, #025e35 55%, #012e1a 100%)',
        minHeight: '210px',
      }}
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -right-4 top-24 h-36 w-36 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-white/5" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="solar:layers-minimalistic-bold" className="size-5 text-white/80" />
          <span className="text-sm font-bold tracking-widest">SACCOFLOW</span>
        </div>
        <Icon icon="solar:wifi-bold" className="size-5 rotate-90 text-white/60" />
      </div>

      <div className="relative mt-5 flex items-center gap-3">
        <div className="h-8 w-11 overflow-hidden rounded-md bg-amber-300/90">
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-px p-1">
            <div className="rounded-sm bg-amber-500/40" />
            <div className="rounded-sm bg-amber-500/40" />
            <div className="rounded-sm bg-amber-500/40" />
            <div className="rounded-sm bg-amber-500/40" />
          </div>
        </div>
        <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">
          Share Account
        </span>
      </div>

      <p className="relative mt-4 font-mono text-base tracking-[0.18em] text-white/90">
        {formattedNumber}
      </p>

      <div className="relative mt-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-widest text-white/50 uppercase">Shareholder</p>
          <p className="mt-0.5 text-sm font-semibold tracking-wide truncate max-w-[180px]">
            {holderName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-widest text-white/50 uppercase">Shares</p>
          <p className="mt-0.5 text-2xl font-bold leading-none">
            {account?.total_shares ?? 0}
          </p>
          <p className="mt-0.5 text-xs text-white/60">{formatKES(account?.total_value ?? 0)}</p>
        </div>
      </div>
    </div>
  )
}
