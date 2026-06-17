import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { requestPasswordChange, confirmPasswordChange } from "@/actions/auth";
import { getUser } from "@/lib/user";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const step1Schema = z.object({
  email: z.email("Enter a valid email"),
});

const step2Schema = z
  .object({
    otp: z.string().length(6, "Enter the 6-digit code"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type Step1Fields = z.infer<typeof step1Schema>;
type Step2Fields = z.infer<typeof step2Schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangePasswordDrawer({ open, onClose, onSuccess }: Props) {
  const user = getUser();
  const [step, setStep] = useState<1 | 2>(1);
  const [sentEmail, setSentEmail] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const step1 = useForm<Step1Fields>({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: user?.email ?? "" },
  });

  const step2 = useForm<Step2Fields>({
    resolver: zodResolver(step2Schema),
    defaultValues: { otp: "", new_password: "", confirm_password: "" },
  });

  const handleRequestOtp = async (values: Step1Fields) => {
    const result = await requestPasswordChange(values.email);
    if (result?.error) {
      step1.setError("root", { message: result.error });
      return;
    }
    setSentEmail(values.email);
    setStep(2);
  };

  const handleConfirm = async (values: Step2Fields) => {
    const result = await confirmPasswordChange(
      sentEmail,
      values.otp,
      values.new_password,
      values.confirm_password,
    );
    if (result?.error) {
      step2.setError("root", { message: result.error });
      return;
    }
    onSuccess();
  };

  const handleClose = () => {
    setStep(1);
    step1.reset();
    step2.reset();
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && handleClose()} direction="bottom">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {step === 1 ? "Change Password" : "Enter OTP & New Password"}
          </DrawerTitle>
        </DrawerHeader>

        {step === 1 && (
          <Form {...step1}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex-1 overflow-y-auto px-4 flex flex-col gap-4 pb-2"
            >
              {step1.formState.errors.root && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {step1.formState.errors.root.message}
                </p>
              )}

              <p className="text-sm text-muted-foreground">
                We will send a one-time code to your email to verify your
                identity before changing your password.
              </p>

              <FormField
                control={step1.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        readOnly={!!user?.email}
                        className={user?.email ? "bg-muted text-muted-foreground" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...step2}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex-1 overflow-y-auto px-4 flex flex-col gap-4 pb-2"
            >
              {step2.formState.errors.root && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {step2.formState.errors.root.message}
                </p>
              )}

              <Alert>
                <AlertTitle>OTP</AlertTitle>
                <AlertDescription>
                 <CheckCircle2 className="h-4 w-4 shrink-0" />  OTP sent to <span className="font-medium">{sentEmail}</span>
                </AlertDescription>
              </Alert>

              <FormField
                control={step2.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6-digit OTP</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step2.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          <Icon
                            icon={showNew ? "solar:eye-closed-linear" : "solar:eye-linear"}
                            fontSize={20}
                          />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step2.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          <Icon
                            icon={showConfirm ? "solar:eye-closed-linear" : "solar:eye-linear"}
                            fontSize={20}
                          />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        <DrawerFooter>
          {step === 1 ? (
            <>
              <Button
                onClick={step1.handleSubmit(handleRequestOtp)}
                disabled={step1.formState.isSubmitting}
              >
                {step1.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send OTP
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DrawerClose>
            </>
          ) : (
            <>
              <Button
                onClick={step2.handleSubmit(handleConfirm)}
                disabled={step2.formState.isSubmitting}
              >
                {step2.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change password
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(1);
                  step2.reset();
                }}
              >
                Back
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
