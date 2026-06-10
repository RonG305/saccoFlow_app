export function getMemberProfile() {
  return JSON.parse(localStorage.getItem('member_profile') || 'null') as {
    first_name?: string
    last_name?: string
    [key: string]: unknown
  } | null
}

export function getMemberId() {
  return localStorage.getItem('member_id')
}

export function getMemberNumber() {
  return localStorage.getItem('member_number')
}
