export function getCategoryPath(category: string): string {
  return `/category/${encodeURIComponent(category)}`;
}

export function decodeCategoryParam(category: string): string {
  return decodeURIComponent(category);
}
