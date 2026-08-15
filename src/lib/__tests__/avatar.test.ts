import { describe, expect, it } from 'vitest';
import { getDefaultAvatarConfig, normalizeAvatarConfig } from '@/lib/avatar';

describe('avatar config', () => {
  it('gera o mesmo personagem padrão para o mesmo usuário', () => {
    expect(getDefaultAvatarConfig('pedrotescaro')).toEqual(getDefaultAvatarConfig('pedrotescaro'));
    expect(getDefaultAvatarConfig('pedrotescaro')).not.toEqual(
      getDefaultAvatarConfig('outra-pessoa')
    );
  });

  it('mescla uma personalização parcial com o personagem padrão', () => {
    expect(normalizeAvatarConfig({ hair: 5, glasses: 2 }, 'pedrotescaro')).toMatchObject({
      hair: 5,
      glasses: 2,
    });
  });

  it('descarta valores fora dos limites', () => {
    expect(normalizeAvatarConfig({ skin: 99 }, 'pedrotescaro')).toEqual(
      getDefaultAvatarConfig('pedrotescaro')
    );
  });
});
