import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono, Bebas_Neue } from 'next/font/google';
import './globals.css';

const themeScript = `
  (function() {
    try {
      const storedTheme = localStorage.getItem('theme');
      const theme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'DevDeck — Rede Social Gamificada para Programadores',
  description:
    'Suba de nível respondendo perguntas, fazendo duelos de código e conquistando badges.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-script"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="bg-dd-bg text-dd-text min-h-screen font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
