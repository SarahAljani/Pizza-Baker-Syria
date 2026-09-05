import { useRef, useState } from "react";
import { Download, Upload, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { downloadBackup, importBackup, resetAllDashboardData, loadAllContent } from "../storage";
import { Button, SectionCard, ConfirmDialog, useToast } from "../ui";
import { useDashboardLanguage } from "../DashboardLanguageContext";

export default function SettingsTab() {
  const { t } = useDashboardLanguage();
  const fileInputRef = useRef(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    setBusy(true);
    try {
      const content = await loadAllContent();
      downloadBackup(content);
    } catch (err) {
      toast(err.message || t("couldntBuildBackup"), "error");
    } finally {
      setBusy(false);
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await importBackup(json);
      toast(t("backupImported"));
    } catch (err) {
      toast(err.message || t("invalidBackupFile"), "error");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    try {
      await resetAllDashboardData();
      setConfirmReset(false);
      toast(t("resetDone"));
    } catch (err) {
      toast(err.message || t("couldntReset"), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title={t("storageBackupsTitle")} subtitle={t("storageBackupsSubtitle")}>
        <div className="flex items-start gap-3 bg-brand-burgundy/10 border border-brand-gold/20 px-4 py-3 mb-6 text-sm text-text-secondary">
          <AlertTriangle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
          <p>{t("storageBackupsNote")}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownload} disabled={busy}>
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {t("downloadBackup")}
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={busy}>
            <Upload className="w-3.5 h-3.5" /> {t("importBackup")}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
      </SectionCard>

      <SectionCard title={t("resetTitle")} subtitle={t("resetSubtitle")}>
        <Button variant="danger" onClick={() => setConfirmReset(true)} disabled={busy}>
          <RotateCcw className="w-3.5 h-3.5" /> {t("resetEverything")}
        </Button>
      </SectionCard>

      {confirmReset && (
        <ConfirmDialog
          title={t("resetAllContentTitle")}
          message={t("resetAllContentMessage")}
          confirmLabel={t("resetEverything")}
          danger
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
