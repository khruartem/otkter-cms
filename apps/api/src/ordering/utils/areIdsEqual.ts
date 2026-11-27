export function areIdsEqual(ids: string[], items: { id: string }[]): boolean {
  const idSet = new Set(ids);
  const itemIdSet = new Set(items.map((item) => item.id));

  if (idSet.size !== itemIdSet.size) return false;

  for (const id of idSet) {
    if (!itemIdSet.has(id)) return false;
  }

  return true;
}
