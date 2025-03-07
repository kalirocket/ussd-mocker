export function joinUrl(base, path) {
  return new URL(path, base).toString();
}
