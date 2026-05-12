import type { StreamingService } from "./types";

/**
 * Attempts to open the native app via its custom URL scheme.
 * If the app is installed, iOS will launch it and the page becomes hidden —
 * detected via visibilitychange. If the page is still visible after 800ms the
 * app isn't installed and we redirect to the App Store instead.
 */
export function openServiceApp(service: StreamingService): void {
  let appOpened = false;

  const onVisibilityChange = () => {
    if (document.hidden) {
      appOpened = true;
      clearTimeout(fallback);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  window.location.href = service.appScheme;

  const fallback = setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!appOpened) {
      window.open(service.appStoreUrl, "_blank", "noopener,noreferrer");
    }
  }, 800);
}
