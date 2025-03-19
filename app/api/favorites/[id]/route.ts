import { deleteFavorite, favoriteExists, insertFavorite } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

interface AuthenticatedRequest extends NextRequest {
  auth: {
    user: {
      email: string;
    };
  };
};

/**
 * POST /api/favorites/:id
 */
export const POST = auth(async (req: NextRequest, ctx: { params?: Record<string, string | string[]> }) => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!ctx.params || typeof ctx.params.id !== "string") {
    return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
  }

  if (!authenticatedReq.auth || !authenticatedReq.auth.user) {
    return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 });
  }

  const { email } = authenticatedReq.auth.user;
  const id = ctx.params.id;

  const exists = await favoriteExists(id, email);
  if (exists) {
    return NextResponse.json({ message: "Already favorited" });
  }

  try {
    await insertFavorite(id, email);
    return NextResponse.json({ message: "Favorite Added" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
});

/**
 * DELETE /api/favorites/:id
 */
export const DELETE = auth(async (req: NextRequest, ctx: { params?: Record<string, string | string[]> }) => {
  const authenticatedReq = req as AuthenticatedRequest;

  if (!ctx.params || typeof ctx.params.id !== "string") {
    return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
  }

  if (!authenticatedReq.auth || !authenticatedReq.auth.user) {
    return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 });
  }

  const { email } = authenticatedReq.auth.user;
  const id = ctx.params.id;

  try {
    await deleteFavorite(id, email);
    return NextResponse.json({ message: "Favorite removed" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
});