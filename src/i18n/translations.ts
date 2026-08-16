export type Language = 'pt' | 'en';

export interface Translations {
  nav: {
    howItWorks: string;
    platform: string;
    tracks: string;
    duels: string;
    feed: string;
    ranking: string;
    login: string;
    signUp: string;
    goToFeed: string;
    myProfile: string;
    settings: string;
    signOut: string;
    menuToggle: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    activeMembers: string;
    membersInArena: string;
    letsGetStarted: string;
    createYourProfile: string;
    openYourFeed: string;
    viewRealPost: string;
  };
  common: {
    switchToEnglish: string;
    switchToPortuguese: string;
    english: string;
    portuguese: string;
    loading: string;
    search: string;
  };
  footer: {
    tagline: string;
    rights: string;
    navigation: string;
    community: string;
    legal: string;
    privacy: string;
    terms: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    nav: {
      howItWorks: 'Como funciona',
      platform: 'Plataforma',
      tracks: 'Trilhas',
      duels: 'Duelos',
      feed: 'Feed',
      ranking: 'Ranking',
      login: 'Entrar',
      signUp: 'Criar conta',
      goToFeed: 'Ir para o Feed',
      myProfile: 'Meu Perfil',
      settings: 'Configurações',
      signOut: 'Sair da Conta',
      menuToggle: 'Abrir menu',
    },
    hero: {
      titleLine1: 'Desbloqueie o melhor do Stacklyst.',
      titleLine2: 'Acesso à comunidade do futuro.',
      subtitle: 'Desenvolvedores criando experiências incríveis.',
      activeMembers: 'MEMBROS ATIVOS',
      membersInArena: '1.840+ desenvolvedores na arena',
      letsGetStarted: 'Começar agora',
      createYourProfile: 'Crie seu perfil',
      openYourFeed: 'Abra seu feed',
      viewRealPost: 'Ver um post real',
    },
    common: {
      switchToEnglish: 'Switch to English',
      switchToPortuguese: 'Mudar para português',
      english: 'English',
      portuguese: 'Português',
      loading: 'Carregando...',
      search: 'Buscar...',
    },
    footer: {
      tagline: 'A arena social gamificada para programadores que constroem o futuro.',
      rights: '© 2026 Stacklyst. Todos os direitos reservados.',
      navigation: 'Navegação',
      community: 'Comunidade',
      legal: 'Legal',
      privacy: 'Privacidade',
      terms: 'Termos de Uso',
    },
  },
  en: {
    nav: {
      howItWorks: 'How it works',
      platform: 'Platform',
      tracks: 'Tracks',
      duels: 'Duels',
      feed: 'Feed',
      ranking: 'Ranking',
      login: 'Log in',
      signUp: 'Sign up',
      goToFeed: 'Go to Feed',
      myProfile: 'My Profile',
      settings: 'Settings',
      signOut: 'Sign Out',
      menuToggle: 'Toggle menu',
    },
    hero: {
      titleLine1: 'Unlock the best of Stacklyst.',
      titleLine2: 'Access to the future community.',
      subtitle: 'Developers creating amazing experiences.',
      activeMembers: 'ACTIVE MEMBERS',
      membersInArena: '1,840+ developers in the arena',
      letsGetStarted: "Let's Get Started",
      createYourProfile: 'Create Your Profile',
      openYourFeed: 'Open Your Feed',
      viewRealPost: 'View a real post',
    },
    common: {
      switchToEnglish: 'Switch to English',
      switchToPortuguese: 'Switch to Portuguese',
      english: 'English',
      portuguese: 'Portuguese',
      loading: 'Loading...',
      search: 'Search...',
    },
    footer: {
      tagline: 'The gamified social arena for developers building the future.',
      rights: '© 2026 Stacklyst. All rights reserved.',
      navigation: 'Navigation',
      community: 'Community',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms of Service',
    },
  },
};
