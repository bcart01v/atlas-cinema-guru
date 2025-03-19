import {
  deleteWatchLater, watchLaterExists, insertWatchLater,
} from "@/lib/data";
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
 * POST /api/watch-later/:id
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

  const exists = await watchLaterExists(id, email);
  if (exists) {
    return NextResponse.json({ message: "Already in watch later" });
  }

  try {
    await insertWatchLater(id, email);
    return NextResponse.json({ message: "Watch later added" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to add watch-later" }, { status: 500 });
  }
});

/**
 * DELETE /api/watch-later/:id
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
    await deleteWatchLater(id, email);
    return NextResponse.json({ message: "Watch later removed" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to remove watch later" }, { status: 500 });
  }
});