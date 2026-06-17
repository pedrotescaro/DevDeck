import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getAuthUser();

    // Buscar relações onde o usuário segue alguém
    const follows = await prisma.follow.findMany({
      where: { follower_id: id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            total_xp: true,
          },
        },
      },
    });

    const users = await Promise.all(
      follows.map(async (f) => {
        const isFollowing = currentUser
          ? await prisma.follow.findUnique({
              where: {
                follower_id_following_id: {
                  follower_id: currentUser.id,
                  following_id: f.following.id,
                },
              },
            }) !== null
          : false;

        return {
          id: f.following.id,
          username: f.following.username,
          avatar_url: f.following.avatar_url,
          total_xp: f.following.total_xp,
          isFollowing,
        };
      })
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json({ error: "Erro ao buscar seguidos" }, { status: 500 });
  }
}
