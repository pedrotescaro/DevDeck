export const OAUTH_PROVIDER_LABELS = {
  google: 'Google',
  github: 'GitHub',
  discord: 'Discord',
} as const;

export type OAuthProvider = keyof typeof OAUTH_PROVIDER_LABELS;

export function getOAuthSignupBio(provider: string) {
  switch (provider) {
    case 'google':
      return 'Novo desenvolvedor no DevDeck via Google! 🚀';
    case 'discord':
      return 'Novo desenvolvedor no DevDeck via Discord! 🎮';
    case 'github':
      return 'Novo desenvolvedor no DevDeck via GitHub! 🚀';
    default:
      return 'Novo desenvolvedor no DevDeck! 🚀';
  }
}
