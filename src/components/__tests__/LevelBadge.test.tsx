import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getLevelFromTotalXp, LevelBadge } from '../LevelBadge';

describe('LevelBadge', () => {
  it('calcula o nível global por XP', () => {
    expect(getLevelFromTotalXp(0)).toBe(1);
    expect(getLevelFromTotalXp(4_000)).toBe(5);
    expect(getLevelFromTotalXp(29_000)).toBe(30);
  });

  it('usa cores e sombra diferentes conforme o nível', () => {
    const { rerender } = render(<LevelBadge totalXp={0} />);
    const beginner = screen.getByLabelText('Nível 1');
    expect(beginner).toHaveStyle({ backgroundColor: '#1cb0f6', boxShadow: '0 3px 0 #087db5' });

    rerender(<LevelBadge totalXp={19_000} />);
    const advanced = screen.getByLabelText('Nível 20');
    expect(advanced).toHaveStyle({ backgroundColor: '#ffc800', boxShadow: '0 3px 0 #c79700' });
  });
});
