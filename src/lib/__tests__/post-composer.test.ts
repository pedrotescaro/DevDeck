import { describe, expect, it } from 'vitest';
import { appendPostExtras, parsePostExtras } from '@/lib/post-composer';

describe('post composer extras', () => {
  it('separates sensitive and location markers from an existing post body', () => {
    const parsed = parsePostExtras('⚠️ Conteúdo sensível\n\nMeu post\n\n📍 São Paulo, BR');

    expect(parsed).toEqual({
      content: 'Meu post',
      isSensitive: true,
      location: 'São Paulo, BR',
    });
  });

  it('finds the location before trailing scheduling and audience metadata', () => {
    const body = appendPostExtras('Conteúdo principal', {
      location: 'Remoto',
      scheduledAt: '2026-07-22T12:00:00.000Z',
      replyAudience: 'followers',
    });

    expect(parsePostExtras(body)).toMatchObject({
      isSensitive: false,
      location: 'Remoto',
    });
    expect(parsePostExtras(body).content).not.toContain('📍');
  });

  it('leaves regular post copy untouched', () => {
    expect(parsePostExtras('Texto comum\n\nSegundo parágrafo')).toEqual({
      content: 'Texto comum\n\nSegundo parágrafo',
      isSensitive: false,
      location: null,
    });
  });
});
