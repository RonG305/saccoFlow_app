import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { AuthLayout } from "@/components/common/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { registerUser } from "@/actions/auth";
import { cn } from "@/lib/utils";


const baseSchema = z.object({
  account_type: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string().min(1, "Please confirm your password"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  phone_number: z.string().optional(),
  alternative_phone: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  national_id: z.string().optional(),
  national_id_type: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  address_type: z.string().optional(),
  accept_terms_conditions: z.boolean(),
});

type FormFields = z.infer<typeof baseSchema>;

const schema = baseSchema
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine((d) => d.accept_terms_conditions === true, {
    message: "You must accept the terms and conditions",
    path: ["accept_terms_conditions"],
  });


const STEPS = ["Account", "Personal", "Identity", "Confirm"];

const STEP_META = [
  { title: "Create account", subtitle: "Set up your login credentials" },
  { title: "Personal info", subtitle: "Tell us a bit about yourself" },
  { title: "Identity & Address", subtitle: "Verify your identity and location" },
  { title: "Review & confirm", subtitle: "Accept terms and create your account" },
];

const STEP_FIELDS: Array<Array<keyof FormFields>> = [
  ["account_type", "email", "password", "confirm_password"],
  ["first_name", "last_name"],
  [],
  ["accept_terms_conditions"],
];


function StepIndicator({ current }: { current: number }) {
  return (
    <div
      className="mb-8"
      style={{
        display: "grid",
        gridTemplateColumns: `2rem repeat(${STEPS.length - 1}, 1fr 2rem)`,
      }}
    >
      {STEPS.map((_, i) => {
        const n = i + 1;
        const done = current > n;
        const active = current === n;
        return (
          <Fragment key={n}>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                done
                  ? "bg-primary border-primary text-primary-foreground"
                  : active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted text-muted-foreground"
              )}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : n}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "self-center h-0.5 transition-colors",
                  current > n ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </Fragment>
        );
      })}

      {STEPS.map((label, i) => (
        <Fragment key={`l${i}`}>
          <span
            className={cn(
              "text-[10px] font-medium text-center pt-1.5 leading-none",
              current === i + 1 ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && <div />}
        </Fragment>
      ))}
    </div>
  );
}


export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("")

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      account_type: "individual",
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      phone_number: "",
      alternative_phone: "",
      gender: "",
      date_of_birth: "",
      national_id: "",
      national_id_type: "",
      street_address: "",
      city: "",
      region: "",
      postal_code: "",
      country: "",
      address_type: "",
      accept_terms_conditions: false,
    },
    mode: "onTouched",
  });

  const goNext = async () => {
    const fields = STEP_FIELDS[step - 1];
    const valid = fields.length > 0 ? await form.trigger(fields) : true;
    if (valid) setStep((s) => s + 1);
  };

  const goBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await registerUser(values);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSuccessMessage("Saccoflow account has been registered succesfully")
      setTimeout(() => {
         navigate("/signin", { replace: true });
      }, 3000);
     
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { title, subtitle } = STEP_META[step - 1];

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="font-bold text-foreground">
            Sign in
          </Link>
        </>
      }
    >
      <StepIndicator current={step} />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Registration failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

        {successMessage && (
        <Alert variant="success" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Registration Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account type</FormLabel>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[
                        {
                          value: "individual",
                          label: "Individual",
                          icon: "solar:user-bold",
                        },
                        {
                          value: "origanization",
                          label: "Organization",
                          icon: "solar:buildings-bold",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-xl border-2 py-4 text-sm font-medium transition-colors",
                            field.value === opt.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-muted text-muted-foreground hover:border-muted-foreground/40"
                          )}
                        >
                          <Icon icon={opt.icon} fontSize={24} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          <Icon
                            icon={
                              showPassword
                                ? "solar:eye-closed-linear"
                                : "solar:eye-linear"
                            }
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
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
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
                            icon={
                              showConfirm
                                ? "solar:eye-closed-linear"
                                : "solar:eye-linear"
                            }
                            fontSize={20}
                          />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}


          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Middle name{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="A." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone number{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+254722334455" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternative_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Alternative phone{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+254711000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <NativeSelect
                          className="w-full"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <NativeSelectOption value="">Select</NativeSelectOption>
                          <NativeSelectOption value="male">Male</NativeSelectOption>
                          <NativeSelectOption value="female">Female</NativeSelectOption>
                          <NativeSelectOption value="other">Other</NativeSelectOption>
                        </NativeSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="national_id_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID type</FormLabel>
                      <FormControl>
                        <NativeSelect
                          className="w-full"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <NativeSelectOption value="">Select</NativeSelectOption>
                          <NativeSelectOption value="National ID">National ID</NativeSelectOption>
                          <NativeSelectOption value="Passport">Passport</NativeSelectOption>
                          <NativeSelectOption value="Alien ID">Alien ID</NativeSelectOption>
                        </NativeSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="national_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID number</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="street_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Nairobi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Nairobi County" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input placeholder="00100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Kenya" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address type</FormLabel>
                    <FormControl>
                      <NativeSelect
                        className="w-full"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <NativeSelectOption value="">Select</NativeSelectOption>
                        <NativeSelectOption value="Residence">Residence</NativeSelectOption>
                        <NativeSelectOption value="Work">Work</NativeSelectOption>
                        <NativeSelectOption value="Billing">Billing</NativeSelectOption>
                        <NativeSelectOption value="Shipping">Shipping</NativeSelectOption>
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 4 && (
            <>
              <div className="rounded-xl border bg-muted/40 p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium truncate max-w-45">
                    {form.getValues("email")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">
                    {[
                      form.getValues("first_name"),
                      form.getValues("middle_name"),
                      form.getValues("last_name"),
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </div>
                {form.getValues("phone_number") && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">
                      {form.getValues("phone_number")}
                    </span>
                  </div>
                )}
                {form.getValues("city") && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium">{form.getValues("city")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account type</span>
                  <span className="font-medium capitalize">
                    {form.getValues("account_type") === "origanization"
                      ? "Organization"
                      : "Individual"}
                  </span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="accept_terms_conditions"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3 rounded-xl border p-4">
                      <FormControl>
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <label
                        htmlFor="terms"
                        className="text-sm leading-snug text-muted-foreground cursor-pointer"
                      >
                        I have read and agree to the{" "}
                        <span className="font-semibold text-foreground">
                          Terms of Use
                        </span>{" "}
                        and{" "}
                        <span className="font-semibold text-foreground">
                          Privacy Policy
                        </span>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex gap-3 pt-1">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={goBack}
              >
                Back
              </Button>
            )}

            {step < 4 ? (
              <Button
                type="button"
                className="flex-1"
                onClick={goNext}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                className="flex-1"
                disabled={isSubmitting}
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create account
              </Button>
            )}
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
