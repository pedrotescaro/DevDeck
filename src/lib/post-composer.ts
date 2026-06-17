export type ReplyAudience = "everyone" | "followers" | "mentioned";

export const REPLY_AUDIENCE_OPTIONS: {
  value: ReplyAudience;
  label: string;
  description: string;
}[] = [
  {
    value: "everyone",
    label: "Qualquer pessoa pode responder",
    description: "Todos os devs podem comentar",
  },
  {
    value: "followers",
    label: "Apenas seguidores",
    description: "Somente quem você segue",
  },
  {
    value: "mentioned",
    label: "Pessoas que você mencionar",
    description: "Apenas @mencionados no post",
  },
];

export const EMOJI_CATEGORIES = [
  {
    name: "Frequentes",
    emojis: ["😀", "😂", "🔥", "👍", "❤️", "🎉", "💡", "🚀", "👀", "✅", "🙏", "💯"],
  },
  {
    name: "Dev",
    emojis: ["💻", "🐛", "⚡", "🔧", "📦", "🧪", "☕", "🦀", "🐍", "⚙️", "📝", "🔍"],
  },
  {
    name: "Gestos",
    emojis: ["👏", "🙌", "💪", "🤔", "😅", "😎", "🫡", "👋", "🎯", "📌", "🤝", "✨"],
  },
];

export const QUICK_LOCATIONS = [
  "Remoto",
  "São Paulo, BR",
  "Rio de Janeiro, BR",
  "Lisboa, PT",
  "DevDeck Community",
];

export function insertAtCursor(
  textarea: HTMLTextAreaElement | null,
  text: string,
  currentValue: string,
  setValue: (value: string) => void
) {
  if (!textarea) {
    setValue(currentValue + text);
    return;
  }

  const start = textarea.selectionStart ?? currentValue.length;
  const end = textarea.selectionEnd ?? currentValue.length;
  const nextValue = currentValue.slice(0, start) + text + currentValue.slice(end);
  setValue(nextValue);

  requestAnimationFrame(() => {
    textarea.focus();
    const cursor = start + text.length;
    textarea.setSelectionRange(cursor, cursor);
  });
}

export function appendPostExtras(
  body: string,
  extras: {
    location?: string;
    scheduledAt?: string | null;
    replyAudience?: ReplyAudience;
    isSensitive?: boolean;
  }
) {
  let finalBody = body.trim();

  if (extras.isSensitive) {
    finalBody = `⚠️ Conteúdo sensível\n\n${finalBody}`;
  }

  if (extras.location?.trim()) {
    finalBody += `\n\n📍 ${extras.location.trim()}`;
  }

  if (extras.scheduledAt) {
    const date = new Date(extras.scheduledAt);
    if (!Number.isNaN(date.getTime())) {
      finalBody += `\n\n📅 Publicação planejada para ${date.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })}`;
    }
  }

  if (extras.replyAudience && extras.replyAudience !== "everyone") {
    const label =
      extras.replyAudience === "followers"
        ? "Apenas seguidores podem responder"
        : "Apenas pessoas mencionadas podem responder";
    finalBody += `\n\n🔒 ${label}`;
  }

  return finalBody;
}

export function resetPostComposerExtras() {
  return {
    replyAudience: "everyone" as ReplyAudience,
    scheduledAt: null as string | null,
    location: "",
    isSensitive: false,
  };
}
