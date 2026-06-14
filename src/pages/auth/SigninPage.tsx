import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/common/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getOrganizations } from "@/data/organization/organization";
import { loginUser } from "@/actions/auth";
import type { Organization } from "@/types/organization";
import { Icon } from "@iconify/react";
import { decodeToken } from "@/lib/decode-token";
import type { UserData } from "@/lib/user";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  organization_id: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

export default function SigninPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    getOrganizations({ limit: 20 }).then((res) => {
      if (!("error" in res)) setOrganizations(res.data);
    });
  }, []);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", organization_id: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await loginUser(
        values.email,
        values.password,
        values.organization_id,
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      const decoded = decodeToken<UserData>(result.accessToken);
      const destination = decoded?.roles?.includes("driver") ? "/courier/home" : "/home";
      navigate(destination, { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Please enter your details to login"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-bold text-foreground">
            Create account
          </Link>
        </>
      }
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter email address</FormLabel>
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary underline underline-offset-4"
                    >
                      Forgot password
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={`${showPassword ? "text" : "password"}`}
                        placeholder="••••••••"
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={handleShowPassword}
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

            {organizations.length > 0 && (
              <FormField
                control={form.control}
                name="organization_id"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Organization{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        name={field.name}
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                        className="mt-1 flex flex-col gap-2"
                      >
                        {organizations.map((org) => (
                          <FieldLabel
                            key={org.id}
                            htmlFor={`login-org-${org.id}`}
                          >
                            <Field
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <FieldContent>
                                <FieldTitle>{org.organization_name}</FieldTitle>
                                <FieldDescription>
                                  {[org.short_name, org.country]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </FieldDescription>
                              </FieldContent>
                              <RadioGroupItem
                                value={org.id}
                                id={`login-org-${org.id}`}
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-sm">
              Remember for 30 days
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
