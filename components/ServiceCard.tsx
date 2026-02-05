"use client";

import Image from "next/image";
import type { StreamingService } from "@/lib/types";

/** TMDB image CDN base URL for provider logos */
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

interface Props {
  service: StreamingService;
  isSelected: boolean;
  onToggle: () => void;
}

/**
 * A single streaming-service toggle card.
 * Used identically on the onboarding screen and the settings modal.
 *
 * Layout:
 *   ┌────────────────┐
 *   │   [  Logo  ]   │  ← Official service logo from TMDB
 *   ├────────────────┤
 *   │ Service name ✓ │  ← grey strip with name + checkbox indicator
 *   └────────────────┘
 */
export default function ServiceCard({ service, isSelected, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={[
        "relative rounded-xl overflow-hidden transition-all duration-200",
        "border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
        isSelected ? "shadow-lg scale-[1.02]" : "border-gray-700 hover:border-gray-500",
      ].join(" ")}
      style={isSelected ? { borderColor: service.brandColor } : {}}
      aria-pressed={isSelected}
      aria-label={`${service.name}: ${isSelected ? "selected" : "not selected"}`}
    >
      {/* Logo block */}
      <div className="h-16 flex items-center justify-center bg-gray-800 p-2">
        <Image
          src={`${TMDB_IMAGE_BASE}${service.logoPath}`}
          alt={service.name}
          width={48}
          height={48}
          className="object-contain rounded-lg"
          unoptimized
        />
      </div>

      {/* Name row + checkbox indicator */}
      <div className="bg-gray-900 px-2 py-2 flex items-center justify-between gap-1">
        <span className="text-white text-sm font-medium truncate">
          {service.name}
        </span>

        {/* Circular checkbox */}
        <div
          className={[
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
            isSelected ? "" : "border-gray-500",
          ].join(" ")}
          style={
            isSelected
              ? { backgroundColor: service.brandColor, borderColor: service.brandColor }
              : {}
          }
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
