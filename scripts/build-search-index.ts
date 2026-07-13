import fs from "node:fs";
import path from "node:path";

import { buildSearchDocuments } from "../src/lib/build-search-documents";

const OUTPUT_PATH = path.join(process.cwd(), "public", "search-index.json");

function main() {
  const documents = buildSearchDocuments();

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(documents, null, 2), "utf8");

  console.log(
    `Wrote ${documents.length} document(s) to public/search-index.json`,
  );
}

main();
