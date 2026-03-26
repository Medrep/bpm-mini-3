import type { ExtensionLeadPreview } from "@my-bpm-mini/shared";

type CreatePreviewFormProps = {
  preview: ExtensionLeadPreview;
  warnings: string[];
  isSaving: boolean;
  message?: string | null;
  onChange: (
    field: keyof ExtensionLeadPreview,
    value: string,
  ) => void;
  onCreate: () => void;
};

export function CreatePreviewForm({
  preview,
  warnings,
  isSaving,
  message,
  onChange,
  onCreate,
}: CreatePreviewFormProps) {
  return (
    <div className="panel">
      <p className="panel-kicker">Create Lead</p>
      <p className="panel-title">Review the extracted preview</p>
      <p className="panel-copy">
        Edit anything the screenshot missed before creating the lead.
      </p>

      <label className="field">
        <span className="field-label">Full Name</span>
        <input
          className="input"
          value={preview.full_name ?? ""}
          onChange={(event) => onChange("full_name", event.target.value)}
          type="text"
        />
      </label>

      <label className="field">
        <span className="field-label">Company Name</span>
        <input
          className="input"
          value={preview.company_name ?? ""}
          onChange={(event) => onChange("company_name", event.target.value)}
          type="text"
        />
      </label>

      <label className="field">
        <span className="field-label">Role Title</span>
        <input
          className="input"
          value={preview.role_title ?? ""}
          onChange={(event) => onChange("role_title", event.target.value)}
          type="text"
        />
      </label>

      <label className="field">
        <span className="field-label">Location</span>
        <input
          className="input"
          value={preview.location ?? ""}
          onChange={(event) => onChange("location", event.target.value)}
          type="text"
        />
      </label>

      <label className="field">
        <span className="field-label">LinkedIn URL</span>
        <input
          className="input input-readonly"
          readOnly
          value={preview.linkedin_profile_url}
          type="text"
        />
      </label>

      {warnings.length > 0 ? (
        <div className="warning-list">
          {warnings.map((warning) => (
            <p key={warning} className="warning-item">
              {warning}
            </p>
          ))}
        </div>
      ) : null}

      {message ? <p className="inline-message">{message}</p> : null}

      <button
        className="button"
        disabled={
          isSaving || !preview.full_name?.trim() || !preview.company_name?.trim()
        }
        onClick={onCreate}
        type="button"
      >
        {isSaving ? "Creating..." : "Create Lead"}
      </button>
    </div>
  );
}

