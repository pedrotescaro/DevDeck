import Link from 'next/link';
import React from 'react';

export function parseMentions(text: string) {
  if (!text) return '';

  // Matches '@username' only when not preceded by word characters, dots, or dashes (like in emails)
  const parts = text.split(/(?<![\w.-])(@\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      const username = part.slice(1);
      return (
        <Link
          key={index}
          href={`/profile/${username}`}
          className="text-orange-500 hover:underline font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}
