import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/common/AuthLayout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

export default function OtpPage() {
  return (
    <AuthLayout
      title="Enter  OTP Code"
      subtitle="Enter the 6-digit code sent to your phone."
      footer={
        <>
          Did not receive OTP Code?{' '}
          <Link to="#" className="font-bold text-primary">
            Resend
          </Link>
        </>
      }
    >
      <div className="space-y-6 flex items-center justify-center">
        <div className="space-y-1.5">
          <Label>Enter OTP Code</Label>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
           <Button className="w-full">Verify and Continue</Button>
        </div>

       
      </div>
    </AuthLayout>
  )
}
