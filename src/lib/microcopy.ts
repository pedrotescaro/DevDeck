export const MICROCOPY = {
  feed: {
    emptyState: 'Nenhuma publicação encontrada.',
    loadMore: 'Carregar Mais',
    loading: 'Carregando postagens...',
    searchActive: (term: string) => `Termo ativo: "${term}".`,
    postTypeQuestion: 'Pergunta Técnica',
    postTypeDiscussion: 'Discussão Geral',
  },
  toasts: {
    firstPost: '+50 XP — Primeira postagem!',
    levelUp: (level: number) => `LEVEL UP! Você agora está no Level ${level}! 🎉`,
    savedBookmark: 'Salvo nos seus bookmarks',
    errorFollow: 'Erro ao seguir/deixar de seguir usuário',
    errorPost: 'Erro ao criar postagem',
  },
  dms: {
    prompt: 'Comece uma conversa com este desenvolvedor...',
  },
};
