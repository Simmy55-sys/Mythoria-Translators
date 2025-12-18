import { LoginForm } from "@/components/page/account/login";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/global/logo";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center flex items-center gap-2">
            <Spinner />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col">
          <div className="flex items-center self-center font-medium font-heading text-3xl">
            <div className="text-primary-foreground font-bold flex items-center justify-center rounded-md">
              <Logo className="size-20" />
            </div>
            {/* Mythoria */}
          </div>
          <LoginForm />
        </div>
      </div>
    </Suspense>
  );
}
