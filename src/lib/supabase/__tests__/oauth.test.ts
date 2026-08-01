import { describe, expect, it } from 'vitest';
import { getOAuthSignupBio, OAUTH_PROVIDER_LABELS, type OAuthProvider } from '@/lib/supabase/oauth';

describe('OAuth provider configuration', () => {
  it('inclui o Google entre os provedores disponíveis', () => {
    const provider: OAuthProvider = 'google';
    expect(OAUTH_PROVIDER_LABELS[provider]).toBe('Google');
  });

  it('identifica corretamente os perfis criados pelo Google', () => {
    expect(getOAuthSignupBio('google')).toBe('Novo desenvolvedor no DevDeck via Google! 🚀');
  });
});
