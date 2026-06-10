import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/common/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function SignupPage() {
  return (
    <AuthLayout
      title="Signup"
      subtitle="Please enter  your details to register"
      footer={
        <>
          Do not have an account?{' '}
          <Link to="/signin" className="font-bold text-foreground">
            Create account
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Enter email address</Label>
          <Input type="email" placeholder="johndoe@example.com" />
        </div>

        <div className="space-y-1.5">
          <Label>Password</Label>
          <Input type="password" />
        </div>

        <div className="space-y-1.5">
          <Label>Confirm Password</Label>
          <Input type="password" />
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox id="terms" className="mt-0.5" />
          <label htmlFor="terms" className="text-sm leading-snug text-muted-foreground">
            By continuing , I confirm that I have read the{' '}
            <span className="font-semibold text-foreground">Terms of Use</span>
            {' '}and{' '}
            <span className="font-semibold text-foreground">Privacy Policy</span>
          </label>
        </div>

        <Button className="w-full">Sign up</Button>
      </div>
    </AuthLayout>
  )
}
