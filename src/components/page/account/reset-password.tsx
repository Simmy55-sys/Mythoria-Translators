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
import { resetPasswordAction } from "@/server-actions/authentication";
import { login } from "@/routes/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ResetPasswordForm({
  className,
  token,
  ...props
}: React.ComponentProps<"div"> & { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPasswordAction(token, password);

      if (result.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push(login);
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Reset password error:", err);
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
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500">
                Password has been reset successfully! Redirecting to login...
              </div>
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
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter new password"
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn("pr-9", error ? "border-destructive" : "")}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      disabled={isLoading}
                      className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent hover:text-white"
                    >
                      {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                      <span className="sr-only">
                        {isPasswordVisible ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirm new password"
                      required
                      disabled={isLoading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn("pr-9", error ? "border-destructive" : "")}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      onClick={() =>
                        setIsConfirmPasswordVisible((prev) => !prev)
                      }
                      disabled={isLoading}
                      className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent hover:text-white"
                    >
                      {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                      <span className="sr-only">
                        {isConfirmPasswordVisible
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </Button>
                  </div>
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
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
          <Link href={login} className="text-primary hover:underline">
            Back to login
          </Link>
        </FieldDescription>
      )}
    </div>
  );
}
