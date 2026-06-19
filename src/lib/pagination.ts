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
    const decoded = Buffer.from(cursor, 'base64url').toString();
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object' && parsed.t && parsed.i) {
      return parsed;
    }
  } catch {
    // Ignore and try alternative formats
  }

  // Handle flat "timestamp_uuid" format
  const parts = cursor.split('_');
  if (parts.length === 2) {
    const timestamp = parseInt(parts[0], 10);
    if (!isNaN(timestamp)) {
      return {
        t: new Date(timestamp).toISOString(),
        i: parts[1],
      };
    }
  }

  // Handle "isoString_uuid" format
  if (parts.length > 1) {
    const id = parts[parts.length - 1];
    const dateStr = parts.slice(0, parts.length - 1).join('_');
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return {
        t: date.toISOString(),
        i: id,
      };
    }
  }

  throw new ValidationError('INVALID_CURSOR', 'Cursor inválido');
}

export function buildCursorWhere(cursor?: string, dateField: string = 'created_at') {
  if (!cursor) return {};
  const { t, i } = decodeCursor(cursor);
  return {
    OR: [{ [dateField]: { lt: new Date(t) } }, { [dateField]: new Date(t), id: { lt: i } }],
  };
}
