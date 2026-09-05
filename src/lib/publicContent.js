// One unauthenticated fetch of whatever the dashboard has saved so far.
// Returns { menu, extras, translations }, each null if never saved yet.
export async function fetchPublicContent() {
  const res = await fetch("/api/content");
  if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
  return res.json();
}
