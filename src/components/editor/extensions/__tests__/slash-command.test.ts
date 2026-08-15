import { afterEach, describe, expect, it } from 'vitest';
import { positionMenu } from '../slash-command';

function rect({
  left,
  top,
  width = 0,
  height = 0,
}: {
  left: number;
  top: number;
  width?: number;
  height?: number;
}) {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

function menuElement() {
  const element = document.createElement('div');
  Object.defineProperty(element, 'getBoundingClientRect', {
    value: () => rect({ left: 0, top: 0, width: 256, height: 289 }),
  });
  return element;
}

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 });
});

describe('positionMenu', () => {
  it('mantém o menu abaixo do cursor quando existe espaço', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 });
    const element = menuElement();

    positionMenu(element, rect({ left: 240, top: 100, height: 20 }));

    expect(element.dataset.placement).toBe('bottom');
    expect(element.style.position).toBe('fixed');
    expect(element.style.left).toBe('240px');
    expect(element.style.top).toBe('128px');
  });

  it('abre acima e limita a lateral quando o cursor está perto das bordas', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 320 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 640 });
    const element = menuElement();

    positionMenu(element, rect({ left: 300, top: 560, height: 20 }));

    expect(element.dataset.placement).toBe('top');
    expect(element.style.left).toBe('52px');
    expect(element.style.top).toBe('263px');
  });
});
