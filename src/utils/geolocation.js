// Requests the customer's current position (triggers the browser's own
// permission prompt). Resolves to a structured result — never rejects — so
// the caller can always show a specific, actionable message instead of
// silently proceeding without a location.
//
// { success: true, link } on success, or
// { success: false, reason: "denied" | "unavailable" | "timeout" | "unsupported" }

// One attempt at getCurrentPosition, wrapped as a never-rejecting promise.
function tryGetPosition(options) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(
      () => finish({ success: false, reason: "timeout" }),
      options.timeout,
    );

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
      options,
    );
  });
}

// Laptops/desktops have no GPS, so a low-accuracy (network/Wi-Fi based) fix
// is both the fastest and often the *only* one available — forcing high
// accuracy there just times out more. Phones are the opposite: they have a
// real GPS chip, which high accuracy lets kick in and is usually faster and
// more reliable than the network-based fix once it's warmed up. Rather than
// guess the device type, try the cheap one first and only pay for the
// slower, more thorough one if that didn't work.
export async function requestUserLocation() {
  if (!("geolocation" in navigator)) {
    return { success: false, reason: "unsupported" };
  }

  const quick = await tryGetPosition({
    enableHighAccuracy: false,
    timeout: 6000,
    maximumAge: 0,
  });
  if (quick.success || quick.reason === "denied") return quick;

  return tryGetPosition({ enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
}
