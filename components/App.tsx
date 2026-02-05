"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { SearchResult, FilteredResult } from "@/lib/types";
import OnboardingScreen from "@/components/OnboardingScreen";
import SearchBar from "@/components/SearchBar";
import ResultsList from "@/components/ResultsList";
import SettingsModal from "@/components/SettingsModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useDebounce from "@/lib/hooks/useDebounce";

// =============================================================================
// App — top-level client component that owns all application state.
//
// Responsibilities:
//   • Read / write streaming-service selection from localStorage.
//   • Decide whether to show onboarding or the search UI.
//   • Run debounced searches against the /api/search proxy.
//   • Filter raw API results down to only the user's selected services.
//   • Render the correct child based on the current state.
// =============================================================================

/** Key used to persist the selected provider IDs in localStorage. */
const STORAGE_KEY = "streamfinder_selected_services";

export default function App() {
  // ── Streaming service selection ──────────────────────────────────────────
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  /**
   * Guards against an SSR / hydration mismatch: localStorage is not available
   * on the server, so we skip rendering until the first client-side effect has
   * run and populated state from storage.
   */
  const [isHydrated, setIsHydrated] = useState(false);

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);
  /** Raw results from the API — contains ALL providers, not yet filtered. */
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // ── Settings modal visibility ─────────────────────────────────────────────
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ── Effect: read persisted selection from localStorage ────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: number[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedServiceIds(parsed);
          setHasOnboarded(true);
        }
      } catch {
        // Corrupt data — treat as a fresh start
      }
    }
    setIsHydrated(true);
  }, []);

  // ── Persist selection whenever it changes ─────────────────────────────────
  const saveServices = useCallback((ids: number[]) => {
    setSelectedServiceIds(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    if (!hasOnboarded) setHasOnboarded(true);
  }, [hasOnboarded]);

  // ── Effect: fetch results when the debounced query changes ────────────────
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      // User cleared the input — reset without fetching
      setAllResults([]);
      setIsLoading(false);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setSearchError(null);

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setSearchError(data.error);
        } else {
          setAllResults(data.results ?? []);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setSearchError("Search failed. Please try again.");
        setIsLoading(false);
      });

    // If the query changes before the fetch resolves, discard the stale response
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // ── Derived: filter results to the user's selected services ─────────────
  const filteredResults: FilteredResult[] = useMemo(() => {
    const idSet = new Set(selectedServiceIds);
    return allResults
      .map((r) => ({
        ...r,
        matchedProviders: r.providers.filter((p) => idSet.has(p.providerId)),
      }))
      .filter((r) => r.matchedProviders.length > 0);
  }, [allResults, selectedServiceIds]);

  // ── Render ─────────────────────────────────────────────────────────────────

  // Spinner while we read localStorage on the very first render
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  // First-time visitor — show the service-selection onboarding flow
  if (!hasOnboarded) {
    return <OnboardingScreen onComplete={saveServices} />;
  }

  // Main search UI
  return (
    <div className="min-h-screen bg-gray-950 relative">
      {/* Subtle gradient accent behind the header / search area */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-gray-900/50 to-transparent pointer-events-none" />

      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <div className="relative max-w-2xl mx-auto px-4 pt-2 pb-1">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="relative max-w-2xl mx-auto px-4">
        <ResultsList
          results={filteredResults}
          isLoading={isLoading}
          error={searchError}
          hasQuery={!!debouncedQuery.trim()}
          totalUnfiltered={allResults.length}
        />
      </div>

      <Footer />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedServices={selectedServiceIds}
        onSave={saveServices}
      />
    </div>
  );
}
