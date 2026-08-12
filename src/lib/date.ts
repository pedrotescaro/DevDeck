const APP_TIME_ZONE = 'America/Sao_Paulo';

export type DateInput = string | number | Date;

function toDate(value: DateInput): Date {
  return value instanceof Date ? new Date(value.getTime()) : new Date(value);
}

export function formatAbsoluteDate(dateValue: DateInput): string {
  return toDate(dateValue).toLocaleDateString('pt-BR', { timeZone: APP_TIME_ZONE });
}

export function formatRelativeTime(
  dateValue: DateInput,
  referenceDate: DateInput = new Date()
): string {
  const date = toDate(dateValue);
  const now = toDate(referenceDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 30) return `${diffDays}d atrás`;
  return formatAbsoluteDate(date);
}
