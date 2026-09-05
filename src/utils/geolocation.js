// Requests the customer's current position (triggers the browser's own
// permission prompt) and resolves to a Google Maps link, or null if the API
// is unavailable, the user denies/ignores the prompt, or it times out.
// Never rejects — callers can always proceed with checkout regardless.
export function getUserLocationLink(timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }

    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        const { latitude, longitude } = position.coords;
        finish(`https://www.google.com/maps?q=${latitude},${longitude}`);
      },
      () => {
        clearTimeout(timer);
        finish(null);
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 },
    );
  });
}
