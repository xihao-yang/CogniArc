export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[\"'`.,!?()[\]{}:;<>/\\|@#$%^&*+=~]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}