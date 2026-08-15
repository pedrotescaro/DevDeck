import {
  AVATAR_BACKGROUNDS,
  HAIR_COLORS,
  normalizeAvatarConfig,
  OUTFIT_COLORS,
  SKIN_TONES,
} from '@/lib/avatar';

interface CharacterAvatarProps {
  username: string;
  config?: unknown;
  className?: string;
  decorative?: boolean;
  showBackground?: boolean;
}

/**
 * A code-native pixel sprite used only by the character customizer.
 * The account identity remains the provider photo rendered by AuthorAvatar.
 */
export function CharacterAvatar({
  username,
  config,
  className = '',
  decorative = false,
  showBackground = true,
}: CharacterAvatarProps) {
  const avatar = normalizeAvatarConfig(config, username);
  const skin = SKIN_TONES[avatar.skin];
  const hair = HAIR_COLORS[avatar.hairColor];
  const outfit = OUTFIT_COLORS[avatar.outfitColor];
  const background = AVATAR_BACKGROUNDS[avatar.background];

  return (
    <svg
      data-avatar-style="pixel-art"
      viewBox="0 0 160 160"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `Personagem pixel art de ${username}`}
      className={className}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {showBackground && (
        <>
          <rect width="160" height="160" fill={background} />
          <g fill="#ffffff" opacity="0.1">
            <rect x="8" y="16" width="8" height="8" />
            <rect x="16" y="8" width="8" height="8" />
            <rect x="24" y="16" width="8" height="8" />
            <rect x="128" y="24" width="8" height="8" />
            <rect x="136" y="16" width="8" height="8" />
            <rect x="128" y="8" width="8" height="8" />
            <rect x="16" y="128" width="8" height="8" />
            <rect x="24" y="136" width="8" height="8" />
            <rect x="128" y="128" width="16" height="8" />
            <rect x="136" y="120" width="8" height="24" />
          </g>
        </>
      )}

      <rect x="36" y="152" width="88" height="8" fill="#07121a" opacity="0.22" />
      <rect x="44" y="144" width="72" height="8" fill="#07121a" opacity="0.12" />

      {/* Hair that sits behind the head. */}
      {avatar.hair === 2 && (
        <g fill={hair}>
          <rect x="38" y="48" width="84" height="64" />
          <rect x="46" y="104" width="16" height="24" />
          <rect x="98" y="104" width="16" height="24" />
        </g>
      )}
      {avatar.hair === 3 && (
        <g fill={hair}>
          <rect x="64" y="18" width="32" height="16" />
          <rect x="56" y="26" width="48" height="16" />
        </g>
      )}
      {avatar.hair === 4 && (
        <g fill={hair}>
          <rect x="38" y="34" width="84" height="48" />
          <rect x="30" y="50" width="16" height="40" />
          <rect x="114" y="50" width="16" height="40" />
          <rect x="46" y="26" width="68" height="16" />
        </g>
      )}

      {/* Outfit and stepped shoulders. */}
      <g>
        <rect x="52" y="104" width="56" height="8" fill={skin} />
        <rect x="44" y="112" width="72" height="48" fill={outfit} />
        <rect x="36" y="128" width="8" height="32" fill={outfit} />
        <rect x="116" y="128" width="8" height="32" fill={outfit} />
        <rect x="44" y="152" width="80" height="8" fill="#000000" opacity="0.18" />
        {avatar.outfit === 0 && (
          <rect x="72" y="120" width="16" height="40" fill="#fff" opacity="0.1" />
        )}
        {avatar.outfit === 1 && (
          <>
            <rect x="60" y="112" width="40" height="8" fill="#fff" opacity="0.22" />
            <rect x="68" y="120" width="24" height="8" fill="#fff" opacity="0.16" />
            <rect x="76" y="128" width="8" height="32" fill="#fff" opacity="0.12" />
          </>
        )}
        {avatar.outfit === 2 && (
          <>
            <rect x="52" y="120" width="56" height="8" fill="#fff" opacity="0.18" />
            <rect x="52" y="136" width="56" height="8" fill="#fff" opacity="0.18" />
          </>
        )}
        {avatar.outfit === 3 && (
          <>
            <rect x="76" y="112" width="8" height="48" fill="#111827" opacity="0.28" />
            <rect x="68" y="120" width="24" height="8" fill="#fff" opacity="0.1" />
          </>
        )}
        {avatar.outfit === 4 && (
          <>
            <rect x="52" y="128" width="56" height="8" fill="#fff" opacity="0.24" />
            <rect x="60" y="144" width="40" height="8" fill="#fff" opacity="0.15" />
          </>
        )}
      </g>

      {/* Pixel head with asymmetric highlight and shadow. */}
      <rect x="38" y="58" width="8" height="28" fill={skin} />
      <rect x="114" y="58" width="8" height="28" fill={skin} />
      <rect x="46" y="42" width="68" height="60" fill={skin} />
      <rect x="54" y="102" width="52" height="8" fill={skin} />
      <rect x="106" y="50" width="8" height="44" fill="#000000" opacity="0.08" />
      <rect x="54" y="50" width="8" height="8" fill="#ffffff" opacity="0.12" />

      {/* Six block-built hairstyles. */}
      {avatar.hair === 0 && (
        <g fill={hair}>
          <rect x="46" y="34" width="68" height="16" />
          <rect x="46" y="42" width="16" height="24" />
          <rect x="62" y="42" width="16" height="16" />
          <rect x="78" y="42" width="28" height="8" />
        </g>
      )}
      {avatar.hair === 1 && (
        <g fill={hair}>
          <rect x="46" y="34" width="68" height="16" />
          <rect x="46" y="42" width="24" height="24" />
          <rect x="70" y="42" width="20" height="16" />
          <rect x="90" y="42" width="24" height="8" />
        </g>
      )}
      {avatar.hair === 2 && (
        <g fill={hair}>
          <rect x="46" y="34" width="68" height="16" />
          <rect x="46" y="42" width="16" height="32" />
          <rect x="98" y="42" width="16" height="24" />
          <rect x="62" y="42" width="44" height="8" />
        </g>
      )}
      {avatar.hair === 3 && (
        <g fill={hair}>
          <rect x="46" y="34" width="68" height="16" />
          <rect x="46" y="42" width="20" height="24" />
          <rect x="66" y="42" width="40" height="8" />
          <rect x="98" y="42" width="16" height="16" />
        </g>
      )}
      {avatar.hair === 4 && (
        <g fill={hair}>
          <rect x="46" y="34" width="68" height="24" />
          <rect x="38" y="42" width="16" height="32" />
          <rect x="106" y="42" width="16" height="32" />
        </g>
      )}
      {avatar.hair === 5 && (
        <g fill={hair}>
          <rect x="46" y="34" width="68" height="12" />
          <rect x="46" y="42" width="8" height="16" />
          <rect x="106" y="42" width="8" height="8" />
        </g>
      )}

      {/* Eyes keep their personality while staying on the 4px grid. */}
      {avatar.eyes === 0 && (
        <>
          <rect x="58" y="66" width="16" height="16" fill="#f8fafc" />
          <rect x="86" y="66" width="16" height="16" fill="#f8fafc" />
          <rect x="66" y="70" width="8" height="12" fill="#17202a" />
          <rect x="86" y="70" width="8" height="12" fill="#17202a" />
        </>
      )}
      {avatar.eyes === 1 && (
        <>
          <rect x="58" y="72" width="16" height="4" fill="#17202a" />
          <rect x="62" y="68" width="8" height="4" fill="#17202a" />
          <rect x="86" y="72" width="16" height="4" fill="#17202a" />
          <rect x="90" y="68" width="8" height="4" fill="#17202a" />
        </>
      )}
      {avatar.eyes === 2 && (
        <>
          <rect x="58" y="68" width="16" height="12" fill="#f8fafc" />
          <rect x="86" y="68" width="16" height="12" fill="#f8fafc" />
          <rect x="58" y="68" width="16" height="4" fill="#17202a" />
          <rect x="86" y="68" width="16" height="4" fill="#17202a" />
          <rect x="66" y="72" width="4" height="8" fill="#17202a" />
          <rect x="90" y="72" width="4" height="8" fill="#17202a" />
        </>
      )}
      {avatar.eyes === 3 && (
        <>
          <rect x="58" y="64" width="16" height="20" fill="#f8fafc" />
          <rect x="86" y="64" width="16" height="20" fill="#f8fafc" />
          <rect x="62" y="68" width="8" height="12" fill="#55a500" />
          <rect x="90" y="68" width="8" height="12" fill="#55a500" />
          <rect x="66" y="72" width="4" height="8" fill="#17202a" />
          <rect x="90" y="72" width="4" height="8" fill="#17202a" />
        </>
      )}

      <rect x="78" y="78" width="8" height="8" fill="#000000" opacity="0.12" />
      <rect x="82" y="86" width="8" height="4" fill="#000000" opacity="0.12" />

      {avatar.mouth === 0 && (
        <>
          <rect x="70" y="92" width="20" height="4" fill="#7f2739" />
          <rect x="74" y="96" width="12" height="4" fill="#7f2739" />
        </>
      )}
      {avatar.mouth === 1 && <rect x="72" y="94" width="16" height="4" fill="#7f2739" />}
      {avatar.mouth === 2 && (
        <>
          <rect x="70" y="90" width="20" height="12" fill="#7f2739" />
          <rect x="74" y="98" width="12" height="4" fill="#f27f8f" />
        </>
      )}
      {avatar.mouth === 3 && <rect x="76" y="90" width="8" height="12" fill="#7f2739" />}

      {/* Pixel glasses. */}
      {avatar.glasses === 1 && (
        <g fill="#d9f4ff" fillOpacity="0.12" stroke="#26313a" strokeWidth="4">
          <rect x="54" y="62" width="24" height="24" />
          <rect x="82" y="62" width="24" height="24" />
          <path d="M78 70h4M46 70h8M106 70h8" />
        </g>
      )}
      {avatar.glasses === 2 && (
        <g fill="#263d4f" stroke="#1d2830" strokeWidth="4">
          <rect x="54" y="64" width="24" height="20" />
          <rect x="82" y="64" width="24" height="20" />
          <path d="M78 70h4" />
        </g>
      )}
      {avatar.glasses === 3 && (
        <g fill="none" stroke="#edf8ff" strokeWidth="4">
          <rect x="54" y="62" width="24" height="24" />
          <rect x="82" y="62" width="24" height="24" />
          <path d="M78 70h4" />
        </g>
      )}
    </svg>
  );
}
