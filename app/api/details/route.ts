import { NextResponse } from "next/server";

// =============================================================================
// GET /api/details?id=<tmdb_id>&type=movie|tv
//
// Fetches extra detail (cast, runtime, seasons/episodes) for a single title.
// Uses TMDB's append_to_response feature to get credits in one round-trip.
// =============================================================================

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const type = searchParams.get("type");

  if (!id || (type !== "movie" && type !== "tv")) {
    return NextResponse.json(
      { error: "Missing or invalid id / type parameter." },
      { status: 400 }
    );
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=en-US`
    );

    if (!res.ok) {
      throw new Error(`TMDB returned ${res.status}`);
    }

    const data = await res.json();

    const cast = ((data.credits?.cast ?? []) as Array<Record<string, unknown>>)
      .slice(0, 15)
      .map((m) => ({
        name: m.name as string,
        character: m.character as string,
        profilePath: (m.profile_path as string) ?? null,
      }));

    return NextResponse.json({
      runtime: type === "movie" ? (data.runtime as number | undefined) : undefined,
      numberOfSeasons: type === "tv" ? (data.number_of_seasons as number | undefined) : undefined,
      numberOfEpisodes: type === "tv" ? (data.number_of_episodes as number | undefined) : undefined,
      cast,
    });
  } catch (error) {
    console.error("[details] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch details. Please try again." },
      { status: 500 }
    );
  }
}
