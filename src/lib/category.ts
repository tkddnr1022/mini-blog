export function getCategoryPath(category: string): string {
  return `/list/${encodeURIComponent(category)}`;
}

export function decodeCategoryParam(category: string): string {
  return decodeURIComponent(category);
}
