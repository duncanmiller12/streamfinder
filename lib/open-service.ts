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

  // 1500ms gives iOS enough time to complete the app-switch transition.
  // The extra !document.hidden guard catches cases where the visibilitychange
  // fired just after the timeout was scheduled but before it ran.
  const fallback = setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!appOpened && !document.hidden) {
      window.open(service.appStoreUrl, "_blank", "noopener,noreferrer");
    }
  }, 1500);
}
