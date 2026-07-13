export function getCategoryHref(category: string): string {
  return `/?category=${encodeURIComponent(category)}`;
}
