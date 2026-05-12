import type { StreamingService } from "./types";

/**
 * Opens the native app if installed, otherwise falls back to the App Store.
 *
 * - window.location.href with the URL scheme opens the app when installed.
 *   iOS will show a brief "cannot open page" dialog if the app isn't there —
 *   that's a native iOS limitation that can't be suppressed from a web page.
 * - The App Store fallback uses window.location.href (not window.open) so iOS
 *   never treats it as a popup. apps.apple.com is a universal link, so iOS
 *   opens the App Store app without navigating away from this page.
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

  // Attempt to open the native app. If the app is installed iOS launches it
  // and the page goes hidden; if not, iOS shows a brief error dialog.
  window.location.href = service.appScheme;

  const fallback = setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!appOpened && !document.hidden) {
      // Navigate the current tab (not window.open) so iOS doesn't treat this
      // as a popup. apps.apple.com is a universal link — iOS opens the App
      // Store app without navigating away from this page.
      window.location.href = service.appStoreUrl;
    }
  }, 1500);
}
