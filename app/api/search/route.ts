import { NextResponse } from "next/server";

// =============================================================================
// GET /api/search?q=<query>
//
// Server-side proxy for TMDB.  Keeps the API key out of the browser bundle.
//
// Flow:
//   1. Run /search/movie and /search/tv in parallel.
//   2. Take the top 10 results from each category.
//   3. Fetch /watch/providers for every result in a single Promise.all().
//   4. Normalise everything into a flat SearchResult array and return it.
//
// The client then filters by the user's selected services purely in JS so
// that toggling a service in Settings updates instantly without a new fetch.
// =============================================================================

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  // Nothing to search for → empty result (not an error)
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // Guard: API key must be configured via .env.local
  if (!TMDB_API_KEY) {
    console.error("[search] TMDB_API_KEY is not set");
    return NextResponse.json(
      {
        error:
          "API key not configured. See .env.local.example for instructions.",
      },
      { status: 500 }
    );
  }

  try {
    // ── 1. Search movies + TV in parallel ─────────────────────────────────
    const [moviesRes, tvRes] = await Promise.all([
      fetch(
        `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
      ),
      fetch(
        `${TMDB_BASE}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
      ),
    ]);

    if (!moviesRes.ok || !tvRes.ok) {
      throw new Error(
        `TMDB search returned ${moviesRes.status} / ${tvRes.status}`
      );
    }

    const [moviesData, tvData] = await Promise.all([
      moviesRes.json(),
      tvRes.json(),
    ]);

    // Limit to 10 per category to keep provider-fetch count reasonable
    const topMovies: Record<string, unknown>[] = (
      moviesData.results ?? []
    ).slice(0, 10);
    const topTV: Record<string, unknown>[] = (tvData.results ?? []).slice(
      0,
      10
    );

    // ── 2. Fetch streaming providers for every result in parallel ─────────
    //   Movies occupy indices [0 … topMovies.length)
    //   TV shows occupy        [topMovies.length … end)
    const providerFetches = [
      ...topMovies.map((movie) =>
        fetch(
          `${TMDB_BASE}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`
        ).then((r) => (r.ok ? r.json() : {}))
      ),
      ...topTV.map((show) =>
        fetch(
          `${TMDB_BASE}/tv/${show.id}/watch/providers?api_key=${TMDB_API_KEY}`
        ).then((r) => (r.ok ? r.json() : {}))
      ),
    ];

    const providerResponses = await Promise.all(providerFetches);

    // ── 3. Normalise into SearchResult shape ──────────────────────────────
    // Helper: extract the US flatrate array from a providers response
    const usFlat = (resp: Record<string, unknown>) => {
      const us = (resp?.results as Record<string, unknown>)?.US as Record<
        string,
        unknown
      >;
      return (us?.flatrate as Array<Record<string, unknown>>) ?? [];
    };

    // Debug: Log provider data for first few results
    console.log("[search] Query:", query);
    providerResponses.slice(0, 3).forEach((resp, i) => {
      const title = i < topMovies.length
        ? topMovies[i]?.title
        : topTV[i - topMovies.length]?.name;
      const flatrate = usFlat(resp);
      console.log(`[search] "${title}" US flatrate providers:`,
        flatrate.map((p) => `${p.provider_name} (ID: ${p.provider_id})`).join(", ") || "none"
      );
    });

    const toProviders = (flatrate: Array<Record<string, unknown>>) =>
      flatrate.map((p) => ({
        providerId: p.provider_id as number,
        providerName: p.provider_name as string,
        providerLogoPath: (p.provider_logo_path as string) ?? "",
      }));

    const results = [
      // Movies
      ...topMovies.map((movie, i) => ({
        id: movie.id as number,
        type: "movie" as const,
        title: (movie.title as string) ?? "",
        year: movie.release_date
          ? (movie.release_date as string).substring(0, 4)
          : "",
        posterPath: (movie.poster_path as string) ?? null,
        overview: (movie.overview as string) ?? "",
        providers: toProviders(usFlat(providerResponses[i])),
      })),
      // TV shows
      ...topTV.map((show, i) => ({
        id: show.id as number,
        type: "tv" as const,
        title: (show.name as string) ?? "",
        year: show.first_air_date
          ? (show.first_air_date as string).substring(0, 4)
          : "",
        posterPath: (show.poster_path as string) ?? null,
        overview: (show.overview as string) ?? "",
        providers: toProviders(usFlat(providerResponses[topMovies.length + i])),
      })),
    ];

    // Bubble results that have *any* streaming provider to the top so the
    // user is more likely to see something useful before scrolling.
    results.sort((a, b) => {
      if (a.providers.length > 0 && b.providers.length === 0) return -1;
      if (a.providers.length === 0 && b.providers.length > 0) return 1;
      return 0;
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("[search] Error:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
