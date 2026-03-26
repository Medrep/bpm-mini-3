import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/server/auth/supabase";

import { Button } from "../ui/button";

type LogoutFormProps = {
  buttonClassName?: string;
  buttonVariant?: "default" | "secondary" | "ghost";
};

export function LogoutForm({
  buttonClassName,
  buttonVariant = "secondary",
}: LogoutFormProps) {
  async function logoutAction() {
    "use server";

    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <form action={logoutAction}>
      <Button
        className={buttonClassName}
        type="submit"
        variant={buttonVariant}
      >
        Sign Out
      </Button>
    </form>
  );
}
