// src/components/common/Toast.js
import { useApp } from "../../context/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className="toast-container" aria-live="assertive" aria-atomic="true">
      <div className="toast" role="alert">{toast}</div>
    </div>
  );
}
