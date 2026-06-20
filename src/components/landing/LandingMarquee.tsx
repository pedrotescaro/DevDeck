'use client';

const ITEMS = [
  'COMPETÊNCIA É IDENTIDADE',
  'POSTE E GANHE NÍVEL',
  'SEM ATALHOS',
  'PROVA REAL E NÃO POSTS',
  'FAÇA QUIZ OU SEJA TESTADO',
  'DUELE OU CAIA',
  'COMPETÊNCIA É IDENTIDADE',
  'POSTE E GANHE NÍVEL',
  'SEM ATALHOS',
  'PROVA REAL E NÃO POSTS',
  'FAÇA QUIZ OU SEJA TESTADO',
  'DUELE OU CAIA',
  'COMPETÊNCIA É IDENTIDADE',
  'POSTE E GANHE NÍVEL',
  'SEM ATALHOS',
  'PROVA REAL E NÃO POSTS',
  'FAÇA QUIZ OU SEJA TESTADO',
  'DUELE OU CAIA',
  'COMPETÊNCIA É IDENTIDADE',
  'POSTE E GANHE NÍVEL',
  'SEM ATALHOS',
  'PROVA REAL E NÃO POSTS',
  'FAÇA QUIZ OU SEJA TESTADO',
  'DUELE OU CAIA',
];

function MarqueeSet() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span style={{ color: 'var(--lp-muted)' }}>{item}</span>
          <span className="px-6" style={{ color: 'var(--lp-accent)' }}>
            /
          </span>
        </span>
      ))}
    </>
  );
}

export default function LandingMarquee() {
  return (
    <div
      className="w-full overflow-hidden py-3 backdrop-blur-md"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderTop: '1px solid var(--lp-border)',
      }}
    >
      <div className="lp-marquee-track lp-font-display text-sm tracking-[0.25em]">
        <MarqueeSet />
        <MarqueeSet />
      </div>
    </div>
  );
}
