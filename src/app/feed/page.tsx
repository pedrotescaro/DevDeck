import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { FeedContent } from "./FeedContent";

export const revalidate = 0; // Desabilitar cache para feed dinâmico

export default async function FeedPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Buscar posts iniciais do feed com contagens de respostas e quizzes inclusos
  const posts = await prisma.post.findMany({
    orderBy: { created_at: "desc" },
    take: 10,
    include: {
      author: {
        select: {
          username: true,
          avatar_url: true,
          total_xp: true,
        },
      },
      _count: {
        select: { answers: true },
      },
      quizzes: {
        include: {
          attempts: {
            where: { user_id: user.id },
          },
        },
      },
      votes: {
        where: { user_id: user.id },
      },
    },
  });

  // 2. Buscar duelos de código iniciais
  const duels = await prisma.duel.findMany({
    orderBy: { created_at: "desc" },
    include: {
      challenger: {
        select: { username: true, avatar_url: true },
      },
      opponent: {
        select: { username: true, avatar_url: true },
      },
      solutions: {
        select: {
          user_id: true,
          vote_count: true,
        },
      },
    },
  });

  // Fetch trails and badges
  const trails = await prisma.languageTrail.findMany({
    where: { user_id: user.id },
    orderBy: { xp: "desc" },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    created_at: post.created_at.toISOString(),
  }));

  const serializedDuels = duels.map((duel) => ({
    ...duel,
    created_at: duel.created_at.toISOString(),
  }));

  return (
    <FeedContent
      initialUser={{
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_xp: user.total_xp,
        streak: trails.reduce((max, t) => Math.max(max, t.streak), 0),
        trails: trails,
        badges: user.badges.map((b) => b.badge),
      }}
      initialPosts={serializedPosts}
      initialDuels={serializedDuels}
    />
  );
}
