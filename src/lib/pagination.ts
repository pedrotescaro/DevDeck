import { ValidationError } from './errors';

export function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(
    JSON.stringify({
      t: createdAt.toISOString(),
      i: id,
    })
  ).toString('base64url');
}

export function decodeCursor(cursor: string): { t: string; i: string } {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString());
  } catch {
    throw new ValidationError('INVALID_CURSOR', 'Cursor inválido');
  }
}

export function buildCursorWhere(cursor?: string, dateField: string = 'created_at') {
  if (!cursor) return {};
  const { t, i } = decodeCursor(cursor);
  return {
    OR: [{ [dateField]: { lt: new Date(t) } }, { [dateField]: new Date(t), id: { lt: i } }],
  };
}
