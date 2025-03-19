import { fetchFavorites } from "@/lib/data";
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
 * GET /api/favorites
 */
export const GET = auth(async (req: NextRequest) => {
  const authenticatedReq = req as AuthenticatedRequest;

  if (!authenticatedReq.auth || !authenticatedReq.auth.user) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 }
    );
  }

  const { email } = authenticatedReq.auth.user;

  const params = authenticatedReq.nextUrl.searchParams;
  const pageParam = params.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  try {
    const { favorites, totalPages } = await fetchFavorites(page, email);
    return NextResponse.json({ favorites, totalPages });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
});