import { auth } from "@/auth";
import { fetchActivities } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

interface AuthenticatedRequest extends NextRequest {
  auth: {
    user: {
      email: string;
    };
  };
}

/**
 * GET /api/activities
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

  try {
    const activities = await fetchActivities(email, 6);
    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
});