type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Action blocked",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="panel panel-danger">
      <p className="panel-kicker">Extension Error</p>
      <p className="panel-title">{title}</p>
      <p className="panel-copy">{message}</p>
      {onRetry ? (
        <button className="button button-secondary" onClick={onRetry} type="button">
          Retry
        </button>
      ) : null}
    </div>
  );
}

