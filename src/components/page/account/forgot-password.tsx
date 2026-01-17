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
import { Loader2 } from "lucide-react";
import { forgotPasswordAction } from "@/server-actions/authentication";
import { login } from "@/routes/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email) {
        setError("Please enter your email address");
        setIsLoading(false);
        return;
      }

      const result = await forgotPasswordAction(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(
          result.error || "Failed to send reset link. Please try again."
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 max-w-md mx-auto w-full h-screen items-center justify-center",
        className
      )}
      {...props}
    >
      <Card className="bg-transparent shadow-none border-none w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500">
                If an account with that email exists, a password reset link has
                been sent. Please check your email.
              </div>
              <Field>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(login)}
                >
                  Back to login
                </Button>
              </Field>
            </div>
          ) : (
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
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={error ? "border-destructive" : ""}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
      {!success && (
        <FieldDescription className="px-6 text-center">
          Remember your password?{" "}
          <Link href={login} className="text-primary hover:underline">
            Back to login
          </Link>
        </FieldDescription>
      )}
    </div>
  );
}
