import { createClient, type Session } from "@supabase/supabase-js";
import type {
  ExtensionLeadPreview,
  ExtensionLeadSummary,
  LeadStatus,
} from "@my-bpm-mini/shared";
import { useEffect, useMemo, useState } from "react";

import {
  APP_BASE_URL_STORAGE_KEY,
  BACKGROUND_MESSAGE_TYPES,
  DEFAULT_APP_BASE_URL,
} from "@/shared/constants";
import type {
  CreateLeadFromExtensionResponse,
  InitializeExtensionFlowResponse,
  UpdateExtensionStatusResponse,
} from "@/shared/types";

import { CreatePreviewForm } from "./components/create-preview-form";
import { ErrorState } from "./components/error-state";
import { ExistingLeadCard } from "./components/existing-lead-card";
import { LoadingState } from "./components/loading-state";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

type AuthViewState = {
  mode: "auth";
  error?: string | null;
};

type LoadingViewState = {
  mode: "loading";
  label: string;
};

type ErrorViewState = {
  mode: "error";
  message: string;
};

type ExistingLeadViewState = {
  mode: "existing";
  lead: ExtensionLeadSummary;
  selectedStatus: LeadStatus;
  isSaving: boolean;
  message?: string | null;
};

type CreateLeadViewState = {
  mode: "create";
  preview: ExtensionLeadPreview;
  warnings: string[];
  isSaving: boolean;
  message?: string | null;
};

type CreatedLeadViewState = {
  mode: "created";
  lead: ExtensionLeadSummary;
  created: boolean;
};

type ViewState =
  | AuthViewState
  | LoadingViewState
  | ErrorViewState
  | ExistingLeadViewState
  | CreateLeadViewState
  | CreatedLeadViewState;

function getStoredAppBaseUrl() {
  return localStorage.getItem(APP_BASE_URL_STORAGE_KEY) ?? DEFAULT_APP_BASE_URL;
}

function storeAppBaseUrl(value: string) {
  localStorage.setItem(APP_BASE_URL_STORAGE_KEY, value.trim());
}

async function getActiveSession() {
  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const expiresAt = session.expires_at ?? 0;
  const isExpiring = expiresAt * 1000 <= Date.now() + 60_000;

  if (!isExpiring) {
    return session;
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: session.refresh_token,
  });

  if (error) {
    return null;
  }

  return data.session;
}

async function sendMessage<TResponse>(message: unknown) {
  return (await chrome.runtime.sendMessage(message)) as TResponse;
}

export function App() {
  const [view, setView] = useState<ViewState>({
    mode: "loading",
    label: "Checking your operator session...",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [appBaseUrl, setAppBaseUrl] = useState(DEFAULT_APP_BASE_URL);
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    setAppBaseUrl(getStoredAppBaseUrl());
    void initializePopup();
  }, []);

  const headerMeta = useMemo(
    () => ({
      title: "My BPM Mini",
      copy:
        "Lookup the current LinkedIn profile and either update an existing lead or create a new one.",
    }),
    [],
  );

  async function initializePopup() {
    if (!supabase) {
      setView({
        mode: "error",
        message:
          "Supabase env values are missing from the extension build. Rebuild after configuring NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      });
      return;
    }

    const storedBaseUrl = getStoredAppBaseUrl();
    setAppBaseUrl(storedBaseUrl);
    const session = await getActiveSession();

    if (!session) {
      setView({
        mode: "auth",
        error: null,
      });
      return;
    }

    setView({
      mode: "loading",
      label: "Checking this LinkedIn profile against your lead database...",
    });

    const response = await sendMessage<InitializeExtensionFlowResponse>({
      type: BACKGROUND_MESSAGE_TYPES.INITIALIZE_EXTENSION_FLOW,
      payload: {
        appBaseUrl: storedBaseUrl,
        accessToken: session.access_token,
      },
    });

    if (response.mode === "existing") {
      setView({
        mode: "existing",
        lead: response.lead,
        selectedStatus: response.lead.status,
        isSaving: false,
        message: null,
      });
      return;
    }

    if (response.mode === "create") {
      setView({
        mode: "create",
        preview: response.extracted,
        warnings: response.warnings,
        isSaving: false,
        message: null,
      });
      return;
    }

    if (response.requiresAuth) {
      await supabase.auth.signOut();
      setView({
        mode: "auth",
        error: response.error,
      });
      return;
    }

    setView({
      mode: "error",
      message: response.error,
    });
  }

  async function handleLogin() {
    if (!supabase) {
      return;
    }

    setAuthBusy(true);

    try {
      const normalizedBaseUrl = appBaseUrl.trim().replace(/\/+$/, "");
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setView({
          mode: "auth",
          error: "Invalid operator email or password.",
        });
        return;
      }

      storeAppBaseUrl(normalizedBaseUrl);
      setPassword("");
      await initializePopup();
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setView({
      mode: "auth",
      error: null,
    });
  }

  async function withSession<T>(
    handler: (session: Session) => Promise<T>,
  ): Promise<T | null> {
    const session = await getActiveSession();

    if (!session) {
      setView({
        mode: "auth",
        error: "Your operator session expired. Sign in again.",
      });
      return null;
    }

    return handler(session);
  }

  async function handleStatusSave() {
    if (view.mode !== "existing") {
      return;
    }

    setView({
      ...view,
      isSaving: true,
      message: null,
    });

    const response = await withSession(async (session) =>
      sendMessage<UpdateExtensionStatusResponse>({
        type: BACKGROUND_MESSAGE_TYPES.UPDATE_EXTENSION_STATUS,
        payload: {
          appBaseUrl,
          accessToken: session.access_token,
          leadId: view.lead.id,
          newStatus: view.selectedStatus,
        },
      }),
    );

    if (!response) {
      return;
    }

    if (!response.success) {
      if (response.requiresAuth) {
        setView({
          mode: "auth",
          error: response.error,
        });
        return;
      }

      setView({
        ...view,
        isSaving: false,
        message: response.error,
      });
      return;
    }

    setView({
      mode: "existing",
      lead: response.lead,
      selectedStatus: response.lead.status,
      isSaving: false,
      message: "Status updated.",
    });
  }

  async function handleCreateLead() {
    if (view.mode !== "create") {
      return;
    }

    setView({
      ...view,
      isSaving: true,
      message: null,
    });

    const response = await withSession(async (session) =>
      sendMessage<CreateLeadFromExtensionResponse>({
        type: BACKGROUND_MESSAGE_TYPES.CREATE_LEAD_FROM_EXTENSION,
        payload: {
          appBaseUrl,
          accessToken: session.access_token,
          lead: {
            full_name: view.preview.full_name ?? "",
            company_name: view.preview.company_name ?? "",
            role_title: view.preview.role_title,
            location: view.preview.location,
            linkedin_profile_url: view.preview.linkedin_profile_url,
          },
        },
      }),
    );

    if (!response) {
      return;
    }

    if (!response.success) {
      if (response.requiresAuth) {
        setView({
          mode: "auth",
          error: response.error,
        });
        return;
      }

      setView({
        ...view,
        isSaving: false,
        message: response.error,
      });
      return;
    }

    setView({
      mode: "created",
      lead: response.lead,
      created: response.created,
    });
  }

  return (
    <main className="app-shell">
      <section className="app-card">
        <header className="app-header">
          <div>
            <p className="brand-kicker">LinkedIn Capture</p>
            <p className="brand-title">{headerMeta.title}</p>
            <p className="brand-copy">{headerMeta.copy}</p>
          </div>
          {view.mode !== "auth" ? (
            <button className="button button-ghost" onClick={handleLogout} type="button">
              Sign Out
            </button>
          ) : null}
        </header>

        {view.mode === "loading" ? <LoadingState label={view.label} /> : null}

        {view.mode === "auth" ? (
          <div className="panel">
            <p className="panel-kicker">Operator Sign In</p>
            <p className="panel-title">Connect the extension</p>
            <p className="panel-copy">
              Authenticate as the same operator user that signs into the web app.
            </p>

            <label className="field">
              <span className="field-label">App Base URL</span>
              <input
                className="input"
                onChange={(event) => setAppBaseUrl(event.target.value)}
                type="url"
                value={appBaseUrl}
              />
            </label>

            <label className="field">
              <span className="field-label">Email</span>
              <input
                className="input"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </label>

            <label className="field">
              <span className="field-label">Password</span>
              <input
                className="input"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>

            {view.error ? <p className="inline-message">{view.error}</p> : null}

            <button
              className="button"
              disabled={authBusy || !email.trim() || !password.trim()}
              onClick={handleLogin}
              type="button"
            >
              {authBusy ? "Signing In..." : "Sign In"}
            </button>
          </div>
        ) : null}

        {view.mode === "error" ? (
          <ErrorState message={view.message} onRetry={() => void initializePopup()} />
        ) : null}

        {view.mode === "existing" ? (
          <ExistingLeadCard
            isSaving={view.isSaving}
            lead={view.lead}
            message={view.message}
            onSave={() => void handleStatusSave()}
            onStatusChange={(selectedStatus) =>
              setView({
                ...view,
                selectedStatus,
                message: null,
              })
            }
            selectedStatus={view.selectedStatus}
          />
        ) : null}

        {view.mode === "create" ? (
          <CreatePreviewForm
            isSaving={view.isSaving}
            message={view.message}
            onChange={(field, value) =>
              setView({
                ...view,
                preview: {
                  ...view.preview,
                  [field]: value,
                },
                message: null,
              })
            }
            onCreate={() => void handleCreateLead()}
            preview={view.preview}
            warnings={view.warnings}
          />
        ) : null}

        {view.mode === "created" ? (
          <div className="panel">
            <p className="panel-kicker">Lead Saved</p>
            <p className="panel-title">{view.lead.full_name}</p>
            <p className="panel-copy">
              {view.created
                ? "A new lead was created in the web app."
                : "This LinkedIn profile already existed, so the current lead was reused."}
            </p>
            <p className="panel-copy">
              {view.lead.company_name}
              {view.lead.role_title ? ` • ${view.lead.role_title}` : ""}
            </p>
            <button className="button" onClick={() => void initializePopup()} type="button">
              Refresh
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
