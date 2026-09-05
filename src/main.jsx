import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import Dashboard from './dashboard/Dashboard';
import { DASHBOARD_PATH } from './dashboard/authConfig';
import { applyMenuOverride, applyExtrasOverride, applySettingsOverride } from './data';
import { applyTranslationOverrides } from './translations';
import { fetchPublicContent } from './lib/publicContent';

const isDashboardRoute =
  window.location.pathname === DASHBOARD_PATH ||
  window.location.pathname === `${DASHBOARD_PATH}/`;

const root = createRoot(document.getElementById('root'));

async function renderSite() {
  try {
    const { menu, extras, translations, settings } = await fetchPublicContent();
    applyMenuOverride(menu);
    applyExtrasOverride(extras);
    applyTranslationOverrides(translations);
    applySettingsOverride(settings);
  } catch {
    // Network hiccup or the API isn't reachable (e.g. local static preview):
    // fall back to the site's built-in defaults rather than blocking render.
  }

  root.render(
    <StrictMode>
      <ThemeLanguageProvider>
        <App />
      </ThemeLanguageProvider>
    </StrictMode>,
  );
}

if (isDashboardRoute) {
  root.render(
    <StrictMode>
      <Dashboard />
    </StrictMode>,
  );
} else {
  renderSite();
}
