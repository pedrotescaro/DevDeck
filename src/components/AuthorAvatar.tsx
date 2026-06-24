import Image from 'next/image';

interface AuthorAvatarProps {
  username: string;
  avatar_url?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export function AuthorAvatar({
  username,
  avatar_url,
  size = 'sm',
  className = '',
}: AuthorAvatarProps) {
  const initials = username.slice(0, 2).toUpperCase();
  const sizeClass = sizeClasses[size];

  if (avatar_url) {
    return (
      <Image
        src={avatar_url}
        alt={username}
        width={size === 'lg' ? 40 : size === 'md' ? 36 : 32}
        height={size === 'lg' ? 40 : size === 'md' ? 36 : 32}
        className={`${sizeClass} rounded-full object-cover border border-dd-border shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-dd-surface text-dd-text border border-dd-border flex items-center justify-center font-bold select-none shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}
