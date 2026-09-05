import { useRef, useState } from "react";
import { Download, Upload, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { downloadBackup, importBackup, resetAllDashboardData, loadAllContent } from "../storage";
import { Button, SectionCard, ConfirmDialog, useToast } from "../ui";

export default function SettingsTab() {
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
      toast(err.message || "Couldn't build a backup.", "error");
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
      toast("Backup imported — live on the site now.");
    } catch (err) {
      toast(err.message || "That file isn't a valid backup.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    try {
      await resetAllDashboardData();
      setConfirmReset(false);
      toast("All edits reset to defaults.");
    } catch (err) {
      toast(err.message || "Couldn't reset.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Storage & Backups"
        subtitle="Every visitor sees the same data, stored in Vercel Blob storage"
      >
        <div className="flex items-start gap-3 bg-brand-burgundy/10 border border-brand-gold/20 px-4 py-3 mb-6 text-sm text-text-secondary">
          <AlertTriangle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
          <p>
            Content is saved centrally — every visitor and every device sees
            the same menu and page text. There's still no traditional
            database to browse or restore from directly, so download a
            backup regularly and keep it somewhere safe.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownload} disabled={busy}>
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download Backup
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={busy}>
            <Upload className="w-3.5 h-3.5" /> Import Backup
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

      <SectionCard title="Reset" subtitle="Discard every dashboard edit and restore the original site content">
        <Button variant="danger" onClick={() => setConfirmReset(true)} disabled={busy}>
          <RotateCcw className="w-3.5 h-3.5" /> Reset Everything to Default
        </Button>
      </SectionCard>

      {confirmReset && (
        <ConfirmDialog
          title="Reset All Content"
          message="This permanently removes every pizza, sides & desserts, and page-content edit made from this dashboard for every visitor, restoring the site's original defaults. This cannot be undone unless you have a backup."
          confirmLabel="Reset Everything"
          danger
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
