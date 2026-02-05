"use client";

import type { FilteredResult } from "@/lib/types";
import ResultCard from "@/components/ResultCard";

interface Props {
  results: FilteredResult[];
  isLoading: boolean;
  error: string | null;
  /** True once the user has entered at least one character (post-debounce). */
  hasQuery: boolean;
  /** Total results returned by the API *before* client-side service filtering. */
  totalUnfiltered: number;
}

// ─── Sub-components for each state ──────────────────────────────────────────

/** Pulsing skeleton cards shown while a fetch is in flight. */
function LoadingSkeleton() {
  return (
    <div className="space-y-3 mt-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3 bg-gray-900 rounded-xl p-3 animate-pulse">
          <div className="w-24 sm:w-28 h-36 bg-gray-800 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2.5 pt-1">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-800 rounded w-1/3" />
            <div className="h-3 bg-gray-800 rounded w-full" />
            <div className="h-3 bg-gray-800 rounded w-5/6" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 bg-gray-800 rounded-full w-16" />
              <div className="h-5 bg-gray-800 rounded-full w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Friendly prompt shown before the user has typed anything. */
function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p className="text-gray-500 text-lg font-medium">Search for something to watch</p>
      <p className="text-gray-600 text-sm mt-1">Results will be filtered to your selected services</p>
    </div>
  );
}

/** Shown when the API returns an error. */
function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-12 h-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376a12 12 0 1021.593 0M12 15.75h.008v.008H12v-.008z" />
      </svg>
      <p className="text-red-400 font-medium">{message}</p>
      <p className="text-gray-600 text-sm mt-1">Check your connection and try again</p>
    </div>
  );
}

/** Shown when TMDB returns zero results for the query. */
function NoResultsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      <p className="text-gray-400 text-lg font-medium">No results found</p>
      <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
    </div>
  );
}

/**
 * Shown when TMDB *did* return titles but none are on the user's selected
 * streaming services.  Nudges the user toward Settings.
 */
function NotOnYourServices() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      <p className="text-gray-400 text-lg font-medium">Not on your services</p>
      <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
        None of the results are available on your selected streaming services.
        Try updating your services via the settings gear above.
      </p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function ResultsList({
  results,
  isLoading,
  error,
  hasQuery,
  totalUnfiltered,
}: Props) {
  // 1. No query entered yet
  if (!hasQuery && !isLoading) return <EmptyPrompt />;

  // 2. Fetching
  if (isLoading) return <LoadingSkeleton />;

  // 3. API error
  if (error) return <ErrorState message={error} />;

  // 4. API returned nothing at all
  if (totalUnfiltered === 0) return <NoResultsFound />;

  // 5. API returned results but none match the user's services
  if (results.length === 0) return <NotOnYourServices />;

  // 6. Happy path — render cards
  return (
    <div className="space-y-3 mt-3 pb-8">
      <p className="text-gray-600 text-sm">
        {results.length} result{results.length !== 1 ? "s" : ""} on your services
      </p>
      {results.map((result, i) => (
        <ResultCard key={`${result.type}-${result.id}`} result={result} index={i} />
      ))}
    </div>
  );
}
