import { useState } from "preact/hooks";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  type: NotificationType;
  message: string;
}

/**
 * Hook de notificação unificado.
 * Suporta a API nova (success/error como strings + clearSuccess/clearError)
 * e a API legada (notification object + clear).
 */
export function useNotification() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showSuccess = (message: string, duration = 3500) => {
    setSuccessMsg(message);
    setErrorMsg("");
    setTimeout(
      () => setSuccessMsg((prev) => (prev === message ? "" : prev)),
      duration,
    );
  };

  const showError = (message: string, duration = 4000) => {
    setErrorMsg(message);
    setSuccessMsg("");
    setTimeout(
      () => setErrorMsg((prev) => (prev === message ? "" : prev)),
      duration,
    );
  };

  const showWarning = (message: string) => showError(message);
  const showInfo = (message: string) => showSuccess(message);

  const clearSuccess = () => setSuccessMsg("");
  const clearError = () => setErrorMsg("");
  const clear = () => {
    setSuccessMsg("");
    setErrorMsg("");
  };

  const show = (message: string, type: NotificationType = "success") => {
    if (type === "success" || type === "info") showSuccess(message);
    else showError(message);
  };

  // Compatibilidade com a API legada (notification object)
  const notification: Notification | null = successMsg
    ? { type: "success", message: successMsg }
    : errorMsg
      ? { type: "error", message: errorMsg }
      : null;

  return {
    // API nova (string-based)
    success: successMsg,
    error: errorMsg,
    clearSuccess,
    clearError,
    // Comuns
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // API legada (objeto notification)
    notification,
    clear,
    show,
  };
}
