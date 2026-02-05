"use client";

import { useState } from "react";
import { STREAMING_SERVICES } from "@/lib/streaming-services";
import ServiceCard from "@/components/ServiceCard";

interface Props {
  /** Called with the array of selected TMDB provider IDs once the user taps "Get Started". */
  onComplete: (serviceIds: number[]) => void;
}

/**
 * Full-screen onboarding flow shown on first visit (when no services are saved).
 * The user must select at least one service before they can proceed to the search UI.
 */
export default function OnboardingScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const allSelected = selected.size === STREAMING_SERVICES.length;

  const toggleService = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(
      allSelected ? new Set() : new Set(STREAMING_SERVICES.map((s) => s.id))
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      {/* App icon */}
      <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-900/30">
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v12H4V6zm2 2v8h12V8H6z" />
          <polygon points="10,10 10,16 15,13" fill="white" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-white mb-2 text-center">StreamFinder</h1>
      <p className="text-gray-400 text-center mb-6 max-w-md text-sm sm:text-base">
        Select the streaming services you subscribe to. We'll show you only the
        titles you can actually watch.
      </p>

      {/* Select-all toggle */}
      <button
        onClick={toggleAll}
        className="mb-3 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2"
      >
        {allSelected ? "Deselect All" : "Select All"}
      </button>

      {/* 2-col grid on mobile, 4-col on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mb-8">
        {STREAMING_SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selected.has(service.id)}
            onToggle={() => toggleService(service.id)}
          />
        ))}
      </div>

      {/* CTA button — disabled until at least one service is selected */}
      <button
        onClick={() => selected.size > 0 && onComplete(Array.from(selected))}
        disabled={selected.size === 0}
        className={[
          "w-full max-w-lg py-3.5 rounded-xl font-semibold text-lg transition-all",
          selected.size > 0
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 active:scale-95 shadow-md shadow-purple-900/30"
            : "bg-gray-800 text-gray-500 cursor-not-allowed",
        ].join(" ")}
      >
        {selected.size > 0
          ? `Get Started  (${selected.size} selected)`
          : "Select at least one service"}
      </button>
    </div>
  );
}
