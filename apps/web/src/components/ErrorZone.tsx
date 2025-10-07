import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

export function ErrorZone({ children }: PropsWithChildren) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} type="button">
        Try again
      </button>
    </div>
  );
};
