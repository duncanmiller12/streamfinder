import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-12 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src="/icons/tmdb-logo.svg"
                alt="The Movie Database (TMDB)"
                width={80}
                height={10}
                className="h-auto"
              />
            </a>
            <p className="text-xs text-gray-500">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
