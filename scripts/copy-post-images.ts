import fs from "node:fs";
import path from "node:path";

const CONTENT_POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PUBLIC_POSTS_DIR = path.join(process.cwd(), "public", "posts");

function copyDirectory(source: string, destination: string) {
  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
}

function main() {
  if (!fs.existsSync(CONTENT_POSTS_DIR)) {
    console.log("No content/posts directory found. Skipping image copy.");
    return;
  }

  if (fs.existsSync(PUBLIC_POSTS_DIR)) {
    fs.rmSync(PUBLIC_POSTS_DIR, { recursive: true, force: true });
  }

  const postDirectories = fs
    .readdirSync(CONTENT_POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const postDirectory of postDirectories) {
    const imagesSource = path.join(
      CONTENT_POSTS_DIR,
      postDirectory.name,
      "images",
    );

    if (!fs.existsSync(imagesSource)) {
      continue;
    }

    const imagesDestination = path.join(
      PUBLIC_POSTS_DIR,
      postDirectory.name,
      "images",
    );

    copyDirectory(imagesSource, imagesDestination);
    console.log(`Copied images for post: ${postDirectory.name}`);
  }
}

main();
