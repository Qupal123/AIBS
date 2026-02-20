// Cloudflare Worker proxy for Brawl Stars API.
// 1) Создай секрет BRAWL_TOKEN в Workers (Quick Edit → Settings → Variables).
// 2) В Allowed IPs на developer.brawlstars.com укажи IP Cloudflare (или свой сервер).
// 3) Задеплой воркер, возьми его URL и подставь во фронте в PROXY_URL.
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const tag = (url.searchParams.get("tag") || "").replace("#", "").toUpperCase();
    if (!tag) return new Response("missing tag", { status: 400 });
    const res = await fetch(`https://api.brawlstars.com/v1/players/%23${encodeURIComponent(tag)}`, {
      headers: { Authorization: `Bearer ${env.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImQ1ZTI1NGE4LWZkNjktNDkzMy1hZjhlLTQwYzQxNGM4MDQwNCIsImlhdCI6MTc3MTU4MTQ1MCwic3ViIjoiZGV2ZWxvcGVyLzRjNWRjNzMzLTc2MGMtNzJkMC01OWRjLWFkMTc2YWUxZGE4OCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTg4LjIzMi4yMDIuNSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.cG1W_N-dj06hM-EkUk6xxll71cHRCkItK_a46X_xNndbiAL-GAN5kBVt0wCaRkwHQILUCecxJfcRsyawq9DxSg}` }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      }
    });
  }
};
