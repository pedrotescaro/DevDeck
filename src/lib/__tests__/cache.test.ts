import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cacheGet, cacheSet, cacheDelete, cacheDeleteByPrefix, withCache } from '../cache';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('cacheGet / cacheSet', () => {
  it('should store and retrieve a value', () => {
    cacheSet('key1', 'value1', 60);
    expect(cacheGet('key1')).toBe('value1');
  });

  it('should return null for non-existent key', () => {
    expect(cacheGet('nonexistent')).toBeNull();
  });

  it('should return null for expired key', () => {
    cacheSet('key2', 'value2', 10);
    vi.advanceTimersByTime(11_000);
    expect(cacheGet('key2')).toBeNull();
  });

  it('should overwrite existing value', () => {
    cacheSet('key3', 'old', 60);
    cacheSet('key3', 'new', 60);
    expect(cacheGet('key3')).toBe('new');
  });

  it('should handle complex objects', () => {
    const obj = { a: 1, b: [2, 3], c: { nested: true } };
    cacheSet('obj', obj, 60);
    expect(cacheGet('obj')).toEqual(obj);
  });
});

describe('cacheDelete', () => {
  it('should remove a specific key', () => {
    cacheSet('toDelete', 'value', 60);
    cacheDelete('toDelete');
    expect(cacheGet('toDelete')).toBeNull();
  });
});

describe('cacheDeleteByPrefix', () => {
  it('should remove all keys matching a prefix', () => {
    cacheSet('user:1', 'alice', 60);
    cacheSet('user:2', 'bob', 60);
    cacheSet('post:1', 'hello', 60);

    cacheDeleteByPrefix('user:');

    expect(cacheGet('user:1')).toBeNull();
    expect(cacheGet('user:2')).toBeNull();
    expect(cacheGet('post:1')).toBe('hello');
  });
});

describe('withCache', () => {
  it('should call the function on cache miss', async () => {
    const fn = vi.fn().mockResolvedValue('computed');
    const result = await withCache('miss', 60, fn);
    expect(result).toBe('computed');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return cached value on cache hit', async () => {
    const fn = vi.fn().mockResolvedValue('computed');
    cacheSet('hit', 'cached', 60);

    const result = await withCache('hit', 60, fn);
    expect(result).toBe('cached');
    expect(fn).not.toHaveBeenCalled();
  });

  it('should re-compute after TTL expires', async () => {
    const fn = vi.fn().mockResolvedValueOnce('first').mockResolvedValueOnce('second');

    const result1 = await withCache('ttl', 10, fn);
    expect(result1).toBe('first');

    vi.advanceTimersByTime(11_000);

    const result2 = await withCache('ttl', 10, fn);
    expect(result2).toBe('second');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
