import { fetchWatchLaters } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

interface AuthenticatedRequest extends NextRequest {
  auth: {
    user: {
      email: string;
    };
  };
}

/**
 * GET /api/watch-later
 */
export const GET = auth(async (req: NextRequest) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const params = authenticatedReq.nextUrl.searchParams;

  // Extract and validate query parameters
  const page = Number(params.get("page")) || 1;
  const minYear = Number(params.get("minYear")) || 0;
  const maxYear = Number(params.get("maxYear")) || new Date().getFullYear();
  const query = params.get("query")?.trim() ?? "";

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  if (isNaN(minYear) || isNaN(maxYear)) {
    return NextResponse.json(
      { error: "Invalid minYear or maxYear" },
      { status: 400 }
    );
  }

  // Ensure user is authenticated
  if (!authenticatedReq.auth || !authenticatedReq.auth.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 }
    );
  }

  const { email } = authenticatedReq.auth.user;

  try {
    // Fetch filtered watch-later movies
    const { watchLater, totalPages } = await fetchWatchLaters(
      page,
      email,
    );

    return NextResponse.json({ watchLater, totalPages });
  } catch (error) {
    console.error("Database Error - Failed to fetch watch later items:", error);
    return NextResponse.json(
      { error: "Failed to fetch watch later items" },
      { status: 500 }
    );
  }
});