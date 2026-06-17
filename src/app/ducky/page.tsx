import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { DuckyContent } from "./DuckyContent";

export const revalidate = 0; // Desabilitar cache para verificar sessão ativa

export default async function DuckyPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // Serializar usuário
  const serializedUser = {
    id: user.id,
    username: user.username,
    avatar_url: user.avatar_url,
    total_xp: user.total_xp,
  };

  return <DuckyContent user={serializedUser} />;
}
