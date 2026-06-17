import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { DuelDetailContent } from "./DuelDetailContent";

export const revalidate = 0; // Desabilitar cache para dados dinâmicos de duelos em tempo real

export default async function DuelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  // Buscar duelo específico
  const duel = await prisma.duel.findUnique({
    where: { id },
    include: {
      challenger: {
        select: { username: true, avatar_url: true },
      },
      opponent: {
        select: { username: true, avatar_url: true },
      },
      solutions: {
        select: {
          id: true,
          user_id: true,
          code: true,
          vote_count: true,
        },
      },
    },
  });

  if (!duel) {
    notFound();
  }

  const serializedDuel = {
    ...duel,
    created_at: duel.created_at.toISOString(),
  };

  return (
    <DuelDetailContent
      user={{
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_xp: user.total_xp,
      }}
      initialDuel={serializedDuel}
    />
  );
}
