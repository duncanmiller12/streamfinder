"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { FilteredResult, ExtraDetail } from "@/lib/types";
import { SERVICE_MAP } from "@/lib/streaming-services";

interface Props {
  result: FilteredResult;
  onBack: () => void;
}

const POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";
const LOGO_BASE = "https://image.tmdb.org/t/p/w92";

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function DetailView({ result, onBack }: Props) {
  const [extra, setExtra] = useState<ExtraDetail | null>(null);
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    setLoadingExtra(true);
    setExtra(null);
    fetch(`/api/details?id=${result.id}&type=${result.type}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setExtra(data as ExtraDetail);
        setLoadingExtra(false);
      })
      .catch(() => setLoadingExtra(false));
  }, [result.id, result.type]);

  // All providers for this title that are in our catalogue
  const allKnownProviders = result.providers.filter((p) =>
    SERVICE_MAP.has(p.providerId)
  );
  const matchedIds = new Set(result.matchedProviders.map((p) => p.providerId));

  const metaLine =
    !loadingExtra && extra
      ? result.type === "movie" && extra.runtime
        ? formatRuntime(extra.runtime)
        : result.type === "tv" &&
          extra.numberOfSeasons !== undefined
        ? `${extra.numberOfSeasons} season${extra.numberOfSeasons !== 1 ? "s" : ""}${
            extra.numberOfEpisodes
              ? ` · ${extra.numberOfEpisodes} episodes`
              : ""
          }`
        : null
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 overflow-y-auto detail-view-enter">
      {/* ── Sticky back button ────────────────────────────────────────────── */}
      <button
        onClick={onBack}
        className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 w-full
                   bg-gray-950/90 backdrop-blur-sm text-gray-400 hover:text-white
                   transition-colors border-b border-gray-900"
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to results</span>
      </button>

      {/* ── Header: poster + title info ───────────────────────────────────── */}
      <div className="flex gap-4 px-4 pt-5 pb-2">
        {/* Poster */}
        <div className="w-32 sm:w-36 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-800 self-start"
             style={{ aspectRatio: "2/3" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {result.posterPath && (
            <img
              src={`${POSTER_BASE}${result.posterPath}`}
              alt={`${result.title} poster`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        {/* Title and meta */}
        <div className="flex-1 min-w-0 pt-1">
          <h1 className="text-white text-xl font-bold leading-tight mb-1">
            {result.title}
          </h1>
          {result.year && (
            <p className="text-gray-500 text-sm mb-2">{result.year}</p>
          )}
          <span
            className={[
              "inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3",
              result.type === "movie"
                ? "bg-purple-900/60 text-purple-200"
                : "bg-blue-900/60 text-blue-200",
            ].join(" ")}
          >
            {result.type === "movie" ? "Movie" : "TV Series"}
          </span>

          {/* Runtime / Seasons */}
          {loadingExtra ? (
            <div className="h-4 w-24 bg-gray-800 rounded animate-pulse mt-1" />
          ) : metaLine ? (
            <p className="text-gray-400 text-sm">{metaLine}</p>
          ) : null}
        </div>
      </div>

      {/* ── Body content ──────────────────────────────────────────────────── */}
      <div className="px-4 pb-16 space-y-7 mt-4">
        {/* Description */}
        {result.overview && (
          <section>
            <h2 className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Description
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">{result.overview}</p>
          </section>
        )}

        {/* Cast */}
        <section>
          <h2 className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Cast
          </h2>
          {loadingExtra ? (
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-16 space-y-1.5">
                  <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse" />
                  <div className="h-2.5 bg-gray-800 rounded animate-pulse" />
                  <div className="h-2 bg-gray-800 rounded w-3/4 animate-pulse" />
                </div>
              ))}
            </div>
          ) : extra && extra.cast.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {extra.cast.map((member, i) => (
                <div key={i} className="flex-shrink-0 w-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden mx-auto mb-1.5">
                    {member.profilePath ? (
                      <img
                        src={`${PROFILE_BASE}${member.profilePath}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.674-10 5v1h20v-1c0-3.326-6.67-5-10-5z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                    {member.name}
                  </p>
                  <p className="text-gray-500 text-xs leading-tight line-clamp-1 mt-0.5">
                    {member.character}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No cast information available.</p>
          )}
        </section>

        {/* Available on */}
        {allKnownProviders.length > 0 && (
          <section>
            <h2 className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Available On
            </h2>
            <div className="flex flex-wrap gap-5">
              {allKnownProviders.map((provider) => {
                const service = SERVICE_MAP.get(provider.providerId);
                if (!service) return null;
                const isOnMyServices = matchedIds.has(provider.providerId);
                return (
                  <a
                    key={provider.providerId}
                    href={service.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${service.name}`}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className={[
                        "w-16 h-16 rounded-2xl overflow-hidden ring-2 transition-all duration-200",
                        isOnMyServices
                          ? "ring-white/25 group-hover:ring-white/50"
                          : "ring-transparent opacity-50 group-hover:opacity-75 group-hover:ring-white/20",
                      ].join(" ")}
                    >
                      <Image
                        src={`${LOGO_BASE}${service.logoPath}`}
                        alt={service.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                      {service.shortName}
                    </span>
                  </a>
                );
              })}
            </div>
            {allKnownProviders.some((p) => !matchedIds.has(p.providerId)) && (
              <p className="text-gray-700 text-xs mt-3">
                Dimmed services are not in your selected list.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
