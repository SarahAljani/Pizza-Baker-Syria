import { useEffect } from "react";
import { useDashboardAuth } from "./useDashboardAuth";
import { ToastProvider } from "./ui";
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

// index.html hardcodes dir="rtl" lang="ar" for the public site's SEO
// defaults; the public app corrects it at runtime based on the visitor's
// chosen language. The dashboard's own chrome is English-only, so it must
// force LTR itself rather than inherit whatever the last visitor left.
function useForceLtr() {
  useEffect(() => {
    const root = document.documentElement;
    const prevDir = root.getAttribute("dir");
    const prevLang = root.getAttribute("lang");
    root.setAttribute("dir", "ltr");
    root.setAttribute("lang", "en");
    return () => {
      if (prevDir === null) root.removeAttribute("dir");
      else root.setAttribute("dir", prevDir);
      if (prevLang === null) root.removeAttribute("lang");
      else root.setAttribute("lang", prevLang);
    };
  }, []);
}

export default function Dashboard() {
  useNoIndex();
  useForceLtr();
  const { isAuthed, login, logout, lockedUntil } = useDashboardAuth();

  return (
    <ToastProvider>
      {isAuthed ? (
        <DashboardShell onLogout={logout} />
      ) : (
        <LoginScreen onLogin={login} lockedUntil={lockedUntil} />
      )}
    </ToastProvider>
  );
}
