import type { StreamingService } from "./types";

// =============================================================================
// Streaming-service catalogue
//
// Each entry maps to a TMDB "provider" ID.  These IDs are stable and used by
// the /movie/{id}/watch/providers and /tv/{id}/watch/providers endpoints to
// indicate where a title is available.
//
// If a service changes its TMDB ID in the future you only need to update it
// here — no other code needs to change.
// =============================================================================

export const STREAMING_SERVICES: StreamingService[] = [
  {
    id: 8,
    name: "Netflix",
    shortName: "Netflix",
    brandColor: "#E50914",
    textColor: "#FFFFFF",
    logoPath: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg",
  },
  {
    id: 15,
    name: "Hulu",
    shortName: "Hulu",
    brandColor: "#28B46C",
    textColor: "#FFFFFF",
    logoPath: "/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg",
  },
  {
    id: 337,
    name: "Disney+",
    shortName: "Disney+",
    brandColor: "#17337D",
    textColor: "#FFFFFF",
    logoPath: "/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg",
  },
  {
    // Amazon Prime Video — subscription streaming content
    id: 9,
    name: "Prime Video",
    shortName: "Prime",
    brandColor: "#00A8E1",
    textColor: "#FFFFFF",
    logoPath: "/pvske1MyAoymrs5bguRfVqYiM9a.jpg",
  },
  {
    // Max (formerly HBO Max) — TMDB still uses "HBO Max" name
    id: 1899,
    name: "Max",
    shortName: "Max",
    brandColor: "#002BE7",
    textColor: "#FFFFFF",
    logoPath: "/jbe4gVSfRlbPTdESXhEKpornsfu.jpg",
  },
  {
    id: 387,
    name: "Apple TV+",
    shortName: "Apple",
    // Slightly lighter than pure black so it's visible on dark card backgrounds
    brandColor: "#2C2C2C",
    textColor: "#FFFFFF",
    logoPath: "/6uhKBfmtzFqOcLousHwZuzcrScK.jpg",
  },
  {
    // Paramount Plus Essential tier — covers base subscription content
    id: 2616,
    name: "Paramount+",
    shortName: "Paramount",
    brandColor: "#1A58C5",
    textColor: "#FFFFFF",
    logoPath: "/5wym1C0jAvJeGirPdgVpcW0CCuy.jpg",
  },
  {
    // Peacock Premium — standard subscription tier
    id: 386,
    name: "Peacock",
    shortName: "Peacock",
    brandColor: "#000000",
    textColor: "#FFFFFF",
    logoPath: "/2aGrp1xw3qhwCYvNGAJZPdjfeeX.jpg",
  },
];

/** Quick lookup: TMDB provider_id → StreamingService (or undefined). */
export const SERVICE_MAP = new Map<number, StreamingService>(
  STREAMING_SERVICES.map((s) => [s.id, s])
);
