import fs from "fs";
import path from "path";
import matter from "gray-matter";

function loadMarkdownFile(relativePath: string): {
  title: string;
  description: string;
  content: string;
} {
  const filePath = path.join(process.cwd(), relativePath);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    content,
  };
}

export function loadGuideMarkdown(slug: string): {
  title: string;
  description: string;
  content: string;
} {
  return loadMarkdownFile(path.join("content/guider", `${slug}.md`));
}

/** Legal/static pages under content/*.md (personvern, vilkar, …). */
export function loadContentMarkdown(slug: string): {
  title: string;
  description: string;
  content: string;
} {
  return loadMarkdownFile(path.join("content", `${slug}.md`));
}
