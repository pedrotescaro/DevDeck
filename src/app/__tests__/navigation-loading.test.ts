import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appDirectory = resolve(process.cwd(), 'src', 'app');

function readRouteLoadingSource(relativePath: string) {
  const filePath = resolve(appDirectory, relativePath);

  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

describe.each(['loading.tsx', 'feed/loading.tsx'])('fallback de rota %s', (relativePath) => {
  it('não reutiliza o splash de entrada durante a navegação interna', () => {
    expect(readRouteLoadingSource(relativePath)).not.toContain('SiteEntryLoader');
  });
});
