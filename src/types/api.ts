import { Language } from '@prisma/client';

export interface CreatePostRequest {
  title: string;
  body: string;
  language?: Language | null;
  code?: string | null;
  image_url?: string | null;
  type: 'question' | 'discussion';
}

export interface AuthorResponse {
  id: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
}

export interface PostResponse {
  id: string;
  author_id: string;
  title: string;
  body: string;
  language: Language | null;
  code_snippet: string | null;
  image_url: string | null;
  is_pinned: boolean;
  created_at: string;
  view_count: number;
  upvotes: number;
  author: AuthorResponse;
  _count?: {
    answers: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

export interface SearchResultResponse extends PostResponse {
  excerpt: string;
  rank: number;
}

export interface XPResult {
  xpEarned: number;
  language: Language | null;
  newXp: number;
  newLevel: number;
  newStreak: number;
}

export interface NotificationResponse {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
  actor?: AuthorResponse | null;
  resourceId?: string | null;
  resourceType?: string | null;
}
