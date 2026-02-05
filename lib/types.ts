// =============================================================================
// Core type definitions for StreamFinder
// =============================================================================

/** A streaming platform the user can subscribe to. */
export interface StreamingService {
  /** TMDB provider ID — used to match against the watch/providers API response. */
  id: number;
  /** Full display name shown in cards and labels (e.g. "Apple TV+"). */
  name: string;
  /** Short name used on result badges (e.g. "Apple"). */
  shortName: string;
  /** Primary hex brand colour used for UI elements. */
  brandColor: string;
  /** Foreground text colour that's legible on brandColor. */
  textColor: string;
  /** TMDB logo path (e.g. "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg"). */
  logoPath: string;
}

// ─── Provider returned by TMDB's watch/providers endpoint ────────────────────

export interface Provider {
  providerId: number;
  providerName: string;
  providerLogoPath: string;
}

// ─── A single search result as returned by our /api/search proxy ─────────────

export interface SearchResult {
  id: number;
  type: "movie" | "tv";
  /** Display title (movie title or TV show name). */
  title: string;
  /** Four-digit release / first-air year, or empty string. */
  year: string;
  /** TMDB poster_path (e.g. "/abc.jpg") or null when unavailable. */
  posterPath: string | null;
  /** Short synopsis from TMDB. */
  overview: string;
  /** All flatrate (subscription) providers available in the US. */
  providers: Provider[];
}

// ─── Client-side filtered result (adds matched providers for display) ────────

export interface FilteredResult extends SearchResult {
  /** Subset of `providers` that the user actually has selected. */
  matchedProviders: Provider[];
}

// ─── Shape returned by /api/search ───────────────────────────────────────────

export interface APISearchResponse {
  results?: SearchResult[];
  error?: string;
}
