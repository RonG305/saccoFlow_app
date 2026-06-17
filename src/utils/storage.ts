export interface MemberProfile {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  middle_name?: string
  phone_number?: string
  alternative_phone?: string
  bio?: string
  gender?: string
  date_of_birth?: string
  avatar_url?: string
  national_id?: string
  national_id_type?: string
  organization_id?: string
  street_address?: string
  city?: string
  region?: string
  postal_code?: string
  country?: string
  address_type?: string
  is_primary?: boolean
  is_verified?: boolean
  status?: string
  account_type?: string
  roles?: string[]
  is_two_factor_enabled?: boolean
  last_login?: string
  created_at?: string
  updated_at?: string
}

export function getUserProfile(): MemberProfile | null {
  return JSON.parse(localStorage.getItem('member_profile') || 'null')
}

export function saveUserProfile(data: Partial<MemberProfile>): void {
  const current = getUserProfile()
  localStorage.setItem('member_profile', JSON.stringify({ ...current, ...data }))
}

export function getMemberId(): string | null {
  return localStorage.getItem('member_id')
}

export function getMemberNumber(): string | null {
  return localStorage.getItem('member_number')
}
