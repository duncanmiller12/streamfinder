"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

/**
 * The primary search input.  Features:
 *   • Magnifying-glass icon on the left
 *   • Clear (×) button that appears when there is text
 *   • Subtle purple glow on focus
 *   • auto-focus on mount so the user can start typing immediately
 */
export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full">
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies & TV shows…"
        className="w-full bg-gray-800 text-white placeholder-gray-500
                   rounded-xl py-3.5 pl-12 pr-12
                   border border-gray-700
                   focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30
                   text-base transition-colors"
        autoComplete="off"
        autoFocus
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
