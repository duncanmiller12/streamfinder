import type { StreamingService } from "./types";

/**
 * Opens the native app if installed, otherwise opens the App Store — no
 * browser error dialogs or popup-blocker prompts.
 *
 * Two key techniques:
 *  1. Hidden iframe for the URL scheme attempt: iOS silences the
 *     "Safari cannot open the page" error when the navigation happens inside
 *     an iframe rather than on the top-level page.
 *  2. window.location.href for the App Store fallback: navigating the current
 *     tab is never treated as a popup. iOS intercepts apps.apple.com as a
 *     universal link and opens the App Store app without leaving the page.
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

  // Attempt to open the app via a hidden iframe — errors are silenced.
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:-1px;left:-1px;width:1px;height:1px;opacity:0;border:0;";
  iframe.src = service.appScheme;
  document.body.appendChild(iframe);

  const fallback = setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
    if (!appOpened && !document.hidden) {
      // Navigate the current tab — no popup blocker, and iOS opens the
      // App Store app via universal link without leaving this page.
      window.location.href = service.appStoreUrl;
    }
  }, 1500);
}
