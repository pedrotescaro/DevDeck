import { describe, it, expect, vi, afterEach } from 'vitest';
import { runCodeInSandbox } from '../code-runner';

describe('runCodeInSandbox', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs JS aliases in the browser sandbox without calling the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await runCodeInSandbox("console.log('ok')", 'JS');

    expect(result).toEqual({ ok: true, output: 'ok' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('runs TS aliases in the browser sandbox without calling the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await runCodeInSandbox('const value: number = 3;\nconsole.log(value)', 'TS');

    expect(result).toEqual({ ok: true, output: '3' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends non-JS trail languages to the run API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true, output: 'python ok' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await runCodeInSandbox("print('python ok')", 'PYTHON');

    expect(result).toEqual({ ok: true, output: 'python ok', error: undefined });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/run',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ code: "print('python ok')", language: 'python' }),
      })
    );
  });
});
