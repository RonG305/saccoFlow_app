export function formatKES(value: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return `KES ${num.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function formatCardNumber(accountNumber: string | undefined) {
  return accountNumber ? accountNumber.replace(/-/g, '  ') : '•••  ••••  •••••'
}

export function getHolderName(profile: { first_name?: string; last_name?: string } | null) {
  return profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ').toUpperCase()
    : 'SHAREHOLDER'
}
