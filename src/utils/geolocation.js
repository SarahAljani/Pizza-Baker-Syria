// Requests the customer's current position (triggers the browser's own
// permission prompt). Resolves to a structured result — never rejects — so
// the caller can always show a specific, actionable message instead of
// silently proceeding without a location.
//
// { success: true, link } on success, or
// { success: false, reason: "denied" | "unavailable" | "timeout" | "unsupported" }
//
// Note: enableHighAccuracy is deliberately left off. Forcing GPS-grade
// precision makes desktops (no GPS hardware) far more likely to time out —
// network/Wi-Fi based positioning is plenty accurate for a delivery address
// and resolves faster and more reliably.
export function requestUserLocation(timeoutMs = 12000) {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ success: false, reason: "unsupported" });
      return;
    }

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(() => finish({ success: false, reason: "timeout" }), timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        const { latitude, longitude } = position.coords;
        finish({
          success: true,
          link: `https://www.google.com/maps?q=${latitude},${longitude}`,
        });
      },
      (error) => {
        clearTimeout(timer);
        let reason = "unavailable";
        if (error.code === error.PERMISSION_DENIED) reason = "denied";
        else if (error.code === error.TIMEOUT) reason = "timeout";
        finish({ success: false, reason });
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 0 },
    );
  });
}
