import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function loadGuideMarkdown(slug: string): {
  title: string;
  description: string;
  content: string;
} {
  const filePath = path.join(process.cwd(), "content/guider", `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    content,
  };
}
