import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/common/AuthLayout'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon, CheckCircle2, Loader2 } from 'lucide-react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { verifyLoginOtp, loginUser } from '@/actions/auth'
import { decodeToken } from '@/lib/decode-token'
import type { UserData } from '@/lib/user'

interface LocationState {
  email?: string
  password?: string
  organization_id?: string
}

function getPreAuthToken(): string | null {
  const match = document.cookie.split('; ').find(c => c.startsWith('pre_auth_token='))
  return match ? match.split('=')[1] : null
}

export default function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState

  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!getPreAuthToken()) {
      navigate('/signin', { replace: true })
    }
  }, [navigate])

  const handleVerify = async () => {
    const pre_auth_token = getPreAuthToken()
    if (!pre_auth_token) {
      setError('Session expired. Please sign in again.')
      return
    }
    if (otp.length < 6) {
      setError('Please enter the full 6-digit code.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const result = await verifyLoginOtp(pre_auth_token, otp)
      if (result?.error) {
        setError(result.error)
        return
      }
      const decoded = decodeToken<UserData>(result.accessToken)
      const destination = decoded?.roles?.includes('driver') ? '/courier/home' : '/courier/home'
      navigate(destination, { replace: true })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!state.email || !state.password) {
      navigate('/signin', { replace: true })
      return
    }

    setIsResending(true)
    setError(null)
    setResendSuccess(false)
    try {
      const result = await loginUser(state.email, state.password, state.organization_id)
      if (result?.error) {
        setError(result.error)
        return
      }
      setOtp('')
      setResendSuccess(true)
    } catch {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout
      title="Verify your identity"
      subtitle="Enter the 6-digit code sent to your email address."
      footer={
        <span>
          Did not receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-bold text-primary disabled:opacity-50"
          >
            {isResending ? 'Sending…' : 'Resend code'}
          </button>
        </span>
      }
    >
      <div className="flex flex-col gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Verification failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resendSuccess && (
          <Alert variant={"success"}>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Code sent</AlertTitle>
            <AlertDescription>A new OTP has been sent to your email.</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => {
              setOtp(val)
              setError(null)
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-xs text-muted-foreground text-center">
            The code expires in 10 minutes.
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={isSubmitting || otp.length < 6}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify and continue
        </Button>
      </div>
    </AuthLayout>
  )
}
