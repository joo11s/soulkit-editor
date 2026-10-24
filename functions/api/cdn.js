// Same-origin proxy for SoulKit image workroom files on cdn.wonflowai.com (the CDN sends no CORS headers).
// Only GET, only https://cdn.wonflowai.com/ under the allowed folders below
export async function onRequestGet({ request }) {
  const u = new URL(request.url).searchParams.get('u') || '';
  let t;
  try { t = new URL(u); } catch (e) { return new Response('bad url', { status: 400 }); }
  if (t.protocol !== 'https:' || t.hostname !== 'cdn.wonflowai.com' || !['/soulkit-thumbs/', '/jone/', '/caos/'].some(p => t.pathname.startsWith(p))) {
    return new Response('forbidden', { status: 403 });
  }
  const r = await fetch(t.toString(), { cf: { cacheTtl: 0 } });
  const h = new Headers();
  h.set('Content-Type', r.headers.get('Content-Type') || 'application/octet-stream');
  h.set('Cache-Control', 'no-store');
  return new Response(r.body, { status: r.status, headers: h });
}
