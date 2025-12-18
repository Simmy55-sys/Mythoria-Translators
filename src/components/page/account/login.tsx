"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { LoginUserAction } from "@/server-actions/authentication";
import { dashboard } from "@/routes/client";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      const result = await LoginUserAction(email, password);

      if (result.success) {
        // Get redirect destination from query params, or default to dashboard
        const redirectTo = searchParams.get("redirect") || dashboard;
        router.push(redirectTo);
      } else {
        setError(
          result.error || "Invalid email or password. Please try again."
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 -mt-2", className)} {...props}>
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in to Mythoria</CardTitle>
          <CardDescription>
            Enter your credentials to access your account and begin translating.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <Field>
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    {error}
                  </div>
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                  className={error ? "border-destructive" : ""}
                />
              </Field>
              <Field>
                <Field className="grid gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        placeholder="Password"
                        className={cn(
                          "pr-9",
                          error ? "border-destructive" : ""
                        )}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        onClick={() => setIsVisible((prevState) => !prevState)}
                        disabled={isLoading}
                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent hover:text-white"
                      >
                        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                        <span className="sr-only">
                          {isVisible ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
