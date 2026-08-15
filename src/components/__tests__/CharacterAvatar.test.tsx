import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CharacterAvatar } from '../CharacterAvatar';

describe('CharacterAvatar', () => {
  it('renderiza o personagem como sprite pixel art separado da foto do perfil', () => {
    render(<CharacterAvatar username="pedrotescaro" />);

    const avatar = screen.getByRole('img', { name: 'Personagem pixel art de pedrotescaro' });
    expect(avatar).toHaveAttribute('data-avatar-style', 'pixel-art');
    expect(avatar).toHaveAttribute('shape-rendering', 'crispEdges');
    expect(avatar).toHaveStyle({ imageRendering: 'pixelated' });
  });
});
