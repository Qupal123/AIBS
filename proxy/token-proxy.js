/**
 * Простой прокси для Brawl Stars API.
 * 1) Вставь свой токен в BRAWL_TOKEN ниже (или через переменную окружения).
 * 2) Запусти: `node proxy/token-proxy.js`
 * 3) На developer.brawlstars.com в Allowed IPs добавь внешний IP сервера, где запущен прокси.
 * 4) Во фронте укажи PROXY_URL на этот сервер, например http://<server>:8787
 *
 * Важно: не коммить файл с реальным токеном. Лучше использовать переменную окружения.
 */

import http from "http";
import { URL } from "url";

const BRAWL_TOKEN = process.env.BRAWL_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImQ1ZTI1NGE4LWZkNjktNDkzMy1hZjhlLTQwYzQxNGM4MDQwNCIsImlhdCI6MTc3MTU4MTQ1MCwic3ViIjoiZGV2ZWxvcGVyLzRjNWRjNzMzLTc2MGMtNzJkMC01OWRjLWFkMTc2YWUxZGE4OCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTg4LjIzMi4yMDIuNSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.cG1W_N-dj06hM-EkUk6xxll71cHRCkItK_a46X_xNndbiAL-GAN5kBVt0wCaRkwHQILUCecxJfcRsyawq9DxSg"; // заменить или задать env
const PORT = process.env.PORT || 8787;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname !== "/proxy") {
    res.writeHead(404);
    return res.end("Not found");
  }

  const tag = (url.searchParams.get("tag") || "").replace("#", "").toUpperCase();
  if (!tag) {
    res.writeHead(400);
    return res.end("missing tag");
  }
  if (!BRAWL_TOKEN || BRAWL_TOKEN.includes("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImQ1ZTI1NGE4LWZkNjktNDkzMy1hZjhlLTQwYzQxNGM4MDQwNCIsImlhdCI6MTc3MTU4MTQ1MCwic3ViIjoiZGV2ZWxvcGVyLzRjNWRjNzMzLTc2MGMtNzJkMC01OWRjLWFkMTc2YWUxZGE4OCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTg4LjIzMi4yMDIuNSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.cG1W_N-dj06hM-EkUk6xxll71cHRCkItK_a46X_xNndbiAL-GAN5kBVt0wCaRkwHQILUCecxJfcRsyawq9DxSg")) {
    res.writeHead(500);
    return res.end("BRAWL_TOKEN not set");
  }

  try {
    const apiRes = await fetch(`https://api.brawlstars.com/v1/players/%23${encodeURIComponent(tag)}`, {
      headers: { Authorization: `Bearer ${BRAWL_TOKEN}` }
    });
    const data = await apiRes.text();
    res.writeHead(apiRes.status, {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end("proxy error");
  }
});

server.listen(PORT, () => {
  console.log(`Brawl proxy listening on http://localhost:${PORT}/proxy?tag=YOURTAG`);
});
