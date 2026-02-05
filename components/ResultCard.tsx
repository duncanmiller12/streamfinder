"use client";

import Image from "next/image";
import type { FilteredResult } from "@/lib/types";
import { SERVICE_MAP } from "@/lib/streaming-services";

interface Props {
  result: FilteredResult;
  /** 0-based index used to stagger the fade-in animation delay. */
  index: number;
}

const POSTER_BASE = "https://image.tmdb.org/t/p/w185";
const TMDB_LOGO_BASE = "https://image.tmdb.org/t/p/w45";

/**
 * A single horizontal result card.
 *
 * Layout (desktop / wider mobile):
 *   ┌──────┬─────────────────────────────────┐
 *   │      │  Title (year)  [Movie | TV]     │
 *   │poster│  Overview…                      │
 *   │      │  [Netflix] [Hulu]               │
 *   └──────┴─────────────────────────────────┘
 *
 * The poster sits on the left as a flex-shrink-0 column; the right column
 * fills remaining space.  When a poster is unavailable a dark placeholder
 * with a play-button icon is shown instead.
 */
export default function ResultCard({ result, index }: Props) {
  return (
    <div
      className="result-card-enter flex bg-gray-900 rounded-xl overflow-hidden
                 hover:bg-gray-800 transition-colors"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* ── Poster column ──────────────────────────────────────────────── */}
      <div className="w-24 sm:w-28 flex-shrink-0 relative">
        {/* Placeholder always present behind the image */}
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Actual poster — hidden via CSS if it fails to load */}
        {result.posterPath && (
          <img
            src={`${POSTER_BASE}${result.posterPath}`}
            alt={`${result.title} poster`}
            className="relative w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Remove the image so the placeholder shows through
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      {/* ── Content column ─────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between p-3 flex-1 min-w-0">
        <div>
          {/* Title + year + type badge */}
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="text-white font-semibold text-base leading-snug">
              {result.title}
              {result.year && (
                <span className="text-gray-500 font-normal ml-1.5">
                  ({result.year})
                </span>
              )}
            </h3>
            <span
              className={[
                "text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                result.type === "movie"
                  ? "bg-purple-900/60 text-purple-200"
                  : "bg-blue-900/60 text-blue-200",
              ].join(" ")}
            >
              {result.type === "movie" ? "Movie" : "TV Series"}
            </span>
          </div>

          {/* Overview (clamped to 2 lines) */}
          {result.overview && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {result.overview}
            </p>
          )}
        </div>

        {/* Streaming-service logos */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {result.matchedProviders.map((provider) => {
            const service = SERVICE_MAP.get(provider.providerId);
            if (!service) return null;
            return (
              <div
                key={provider.providerId}
                className="relative group"
                title={service.name}
              >
                <Image
                  src={`${TMDB_LOGO_BASE}${service.logoPath}`}
                  alt={service.name}
                  width={32}
                  height={32}
                  className="rounded-md object-contain"
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
