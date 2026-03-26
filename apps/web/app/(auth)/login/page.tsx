import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decodeMessage, encodeMessage } from "@/lib/utils";
import { getCurrentUser } from "@/server/auth/guards";
import { createServerSupabaseClient } from "@/server/auth/supabase";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (user) {
    redirect("/leads");
  }

  const errorMessage = decodeMessage(getValue(params.error));

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      redirect(`/login?error=${encodeMessage("Email and password are required.")}`);
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/login?error=${encodeMessage("Invalid email or password.")}`);
    }

    redirect("/leads");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60">
        <CardHeader>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
            Operator Access
          </p>
          <CardTitle className="text-3xl font-semibold text-slate-950">
            My BPM Mini
          </CardTitle>
          <p className="text-sm text-slate-600">
            Sign in with the manually created Supabase operator account.
          </p>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-5">
            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

