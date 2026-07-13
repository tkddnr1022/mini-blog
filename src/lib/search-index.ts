import MiniSearch from "minisearch";

export type SearchDocument = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
};

export type SearchResultItem = Pick<
  SearchDocument,
  "id" | "slug" | "title" | "description" | "category"
>;

const SEARCH_INDEX_OPTIONS = {
  fields: ["title", "description", "content", "category"] as const,
  storeFields: ["slug", "title", "description", "category"] as const,
  searchOptions: {
    boost: {
      title: 3,
      description: 2,
      content: 1,
      category: 1,
    },
    fuzzy: 0.2,
    prefix: true,
  },
};

export function createSearchIndex(
  documents: SearchDocument[],
): MiniSearch<SearchDocument> {
  const index = new MiniSearch<SearchDocument>({
    fields: [...SEARCH_INDEX_OPTIONS.fields],
    storeFields: [...SEARCH_INDEX_OPTIONS.storeFields],
  });

  index.addAll(documents);

  return index;
}

export function searchDocuments(
  index: MiniSearch<SearchDocument>,
  query: string,
): SearchResultItem[] {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    return [];
  }

  return index
    .search(trimmedQuery, SEARCH_INDEX_OPTIONS.searchOptions)
    .map((result) => ({
      id: String(result.id),
      slug: String(result.slug),
      title: String(result.title),
      description: String(result.description ?? ""),
      category: String(result.category),
    }));
}
