import { useEffect } from "react";
import { useDashboardAuth } from "./useDashboardAuth";
import { ToastProvider } from "./ui";
import { DashboardLanguageProvider } from "./DashboardLanguageContext";
import LoginScreen from "./components/LoginScreen";
import DashboardShell from "./components/DashboardShell";

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Dashboard";
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);
}

export default function Dashboard() {
  useNoIndex();
  const { isAuthed, login, logout, lockedUntil } = useDashboardAuth();

  return (
    <DashboardLanguageProvider>
      <ToastProvider>
        {isAuthed ? (
          <DashboardShell onLogout={logout} />
        ) : (
          <LoginScreen onLogin={login} lockedUntil={lockedUntil} />
        )}
      </ToastProvider>
    </DashboardLanguageProvider>
  );
}
