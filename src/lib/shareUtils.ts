/**
 * Shared utility to create URL-encoded Share-to-X intent links.
 */
interface XShareParams {
  text: string;
  shareUrl: string;
}

export function createXShareUrl({ text, shareUrl }: XShareParams): string {
  const params = new URLSearchParams();
  params.set('text', text);
  params.set('url', shareUrl);
  return `https://x.com/intent/tweet?${params.toString()}`;
}
