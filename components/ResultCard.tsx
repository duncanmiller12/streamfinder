"use client";

import Image from "next/image";
import type { FilteredResult } from "@/lib/types";
import { SERVICE_MAP } from "@/lib/streaming-services";
import { openServiceApp } from "@/lib/open-service";

interface Props {
  result: FilteredResult;
  /** 0-based index used to stagger the fade-in animation delay. */
  index: number;
  onSelect: () => void;
}

const POSTER_BASE = "https://image.tmdb.org/t/p/w185";
const LOGO_BASE = "https://image.tmdb.org/t/p/w92";

export default function ResultCard({ result, index, onSelect }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className="result-card-enter flex bg-gray-900 rounded-xl overflow-hidden
                 hover:bg-gray-800 transition-colors cursor-pointer"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* ── Poster column ──────────────────────────────────────────────── */}
      <div className="w-24 sm:w-28 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        {result.posterPath && (
          <img
            src={`${POSTER_BASE}${result.posterPath}`}
            alt={`${result.title} poster`}
            className="relative w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
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

        {/* Streaming-service logos — larger, clickable, open App Store */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {result.matchedProviders.map((provider) => {
            const service = SERVICE_MAP.get(provider.providerId);
            if (!service) return null;
            return (
              <button
                key={provider.providerId}
                type="button"
                title={service.name}
                className="flex-shrink-0 hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  openServiceApp(service);
                }}
              >
                <Image
                  src={`${LOGO_BASE}${service.logoPath}`}
                  alt={service.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                  unoptimized
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
