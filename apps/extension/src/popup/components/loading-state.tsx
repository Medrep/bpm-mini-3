export function LoadingState({ label }: { label: string }) {
  return (
    <div className="panel panel-muted">
      <div className="spinner" />
      <p className="panel-title">Working</p>
      <p className="panel-copy">{label}</p>
    </div>
  );
}

