"use client";

interface Props {
  onSettingsClick: () => void;
}

/**
 * App header bar — logo on the left, settings gear on the right.
 * Spans the full viewport width but constrains its inner content to max-w-2xl
 * so it stays aligned with the search bar and results below it.
 */
export default function Header({ onSettingsClick }: Props) {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
        {/* Logo + app name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-sm shadow-purple-900/40">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v12H4V6zm2 2v8h12V8H6z" />
              <polygon points="10,10 10,16 15,13" fill="white" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">StreamFinder</span>
        </div>

        {/* Settings button */}
        <button
          onClick={onSettingsClick}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          aria-label="Open settings"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.826 3.31.077 3.279 1.815a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.31 1.738-1.477 2.641-3.279 1.815a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.738.826-3.505-.077-3.279-1.815a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.231-1.738 1.536-2.641 3.279-1.815a1.724 1.724 0 002.573-1.066z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
