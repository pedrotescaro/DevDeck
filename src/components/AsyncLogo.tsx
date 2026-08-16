import Image, { type ImageProps } from 'next/image';

type AsyncLogoProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string;
};

export function AsyncLogo({ alt = 'ASYNC IA', className = '', ...props }: AsyncLogoProps) {
  return (
    <>
      <Image
        {...props}
        src="/async-logo-light.svg"
        alt={alt}
        className={`${className} dark:hidden`}
      />
      <Image
        {...props}
        src="/async-logo-dark.svg"
        alt={alt}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
