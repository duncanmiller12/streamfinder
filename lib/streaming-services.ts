import type { StreamingService } from "./types";

// =============================================================================
// Streaming-service catalogue
//
// Each entry maps to a TMDB "provider" ID.  These IDs are stable and used by
// the /movie/{id}/watch/providers and /tv/{id}/watch/providers endpoints to
// indicate where a title is available.
//
// appStoreUrl — links to the iOS App Store page for the service.  On a device
// with the app installed the App Store shows "OPEN"; without it, "GET".
// =============================================================================

export const STREAMING_SERVICES: StreamingService[] = [
  {
    id: 8,
    name: "Netflix",
    shortName: "Netflix",
    brandColor: "#E50914",
    textColor: "#FFFFFF",
    logoPath: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/netflix/id363590051",
  },
  {
    id: 15,
    name: "Hulu",
    shortName: "Hulu",
    brandColor: "#28B46C",
    textColor: "#FFFFFF",
    logoPath: "/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/hulu-stream-movies-tv/id376510438",
  },
  {
    id: 337,
    name: "Disney+",
    shortName: "Disney+",
    brandColor: "#17337D",
    textColor: "#FFFFFF",
    logoPath: "/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/disney/id1446075923",
  },
  {
    id: 9,
    name: "Prime Video",
    shortName: "Prime",
    brandColor: "#00A8E1",
    textColor: "#FFFFFF",
    logoPath: "/pvske1MyAoymrs5bguRfVqYiM9a.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/amazon-prime-video/id545519333",
  },
  {
    id: 1899,
    name: "Max",
    shortName: "Max",
    brandColor: "#002BE7",
    textColor: "#FFFFFF",
    logoPath: "/jbe4gVSfRlbPTdESXhEKpornsfu.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/max-stream-hbo-tv-movies/id1666653815",
  },
  {
    id: 387,
    name: "Apple TV+",
    shortName: "Apple TV+",
    brandColor: "#2C2C2C",
    textColor: "#FFFFFF",
    logoPath: "/6uhKBfmtzFqOcLousHwZuzcrScK.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/apple-tv/id1174078549",
  },
  {
    id: 2616,
    name: "Paramount+",
    shortName: "Paramount+",
    brandColor: "#1A58C5",
    textColor: "#FFFFFF",
    logoPath: "/5wym1C0jAvJeGirPdgVpcW0CCuy.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/paramount/id1340650234",
  },
  {
    id: 386,
    name: "Peacock",
    shortName: "Peacock",
    brandColor: "#000000",
    textColor: "#FFFFFF",
    logoPath: "/2aGrp1xw3qhwCYvNGAJZPdjfeeX.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/peacock-tv-stream-tv-movies/id1508186374",
  },
];

/** Quick lookup: TMDB provider_id → StreamingService (or undefined). */
export const SERVICE_MAP = new Map<number, StreamingService>(
  STREAMING_SERVICES.map((s) => [s.id, s])
);
