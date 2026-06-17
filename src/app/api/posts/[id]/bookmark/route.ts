import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: postId } = await params;

    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Postagem não encontrada" }, { status: 404 });
    }

    // Verificar se já está salvo nos bookmarks
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        user_id_post_id: {
          user_id: user.id,
          post_id: postId,
        },
      },
    });

    if (existingBookmark) {
      // Remover dos bookmarks
      await prisma.bookmark.delete({
        where: {
          user_id_post_id: {
            user_id: user.id,
            post_id: postId,
          },
        },
      });
      return NextResponse.json({ success: true, bookmarked: false });
    } else {
      // Adicionar aos bookmarks
      await prisma.bookmark.create({
        data: {
          user_id: user.id,
          post_id: postId,
        },
      });
      return NextResponse.json({ success: true, bookmarked: true });
    }
  } catch (error: any) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json({ error: error.message || "Erro ao processar salvamento" }, { status: 500 });
  }
}
