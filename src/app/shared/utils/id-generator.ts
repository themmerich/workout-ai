export function generateId(items: { id: string }[]): string {
  const maxId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  return String(maxId + 1);
}
