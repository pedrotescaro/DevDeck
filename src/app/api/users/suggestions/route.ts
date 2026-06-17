import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json([]);
    }

    // Find users whom the current user is not following, and who are not the user themselves
    const suggestions = await prisma.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
        followers: {
          none: {
            follower_id: user.id,
          },
        },
      },
      select: {
        id: true,
        username: true,
        avatar_url: true,
        total_xp: true,
      },
      take: 5,
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    return NextResponse.json([]);
  }
}
