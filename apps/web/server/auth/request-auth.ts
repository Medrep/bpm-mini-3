import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import { getSupabaseAnonKey, getSupabaseUrl } from "./env";
import { createServerSupabaseClient } from "./supabase";

type AuthenticatedRequestContext = {
  user: User | null;
  supabase: SupabaseClient;
};

function getBearerToken(request: Request) {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
}

function createAccessTokenSupabaseClient(accessToken: string) {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export async function getAuthenticatedRequestContext(
  request: Request,
): Promise<AuthenticatedRequestContext> {
  const accessToken = getBearerToken(request);

  if (accessToken) {
    const supabase = createAccessTokenSupabaseClient(accessToken);
    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);

    return {
      user,
      supabase,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    user,
    supabase,
  };
}

