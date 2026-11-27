// Tiny in-memory response cache for public GET APIs (per process).
// - entries expire after `ttl` seconds
// - any successful write (POST/PUT/DELETE) clears everything, so editors see changes at once
const store = new Map();
const MAX_ENTRIES = 500;

const cacheGet = (ttl = 60) => (req, res, next) => {
  if (req.method !== "GET") return next();
  const key = req.originalUrl;
  const hit = store.get(key);
  if (hit && hit.exp > Date.now()) {
    res.set("X-Cache", "HIT");
    res.set("Cache-Control", `public, max-age=${Math.min(ttl, 30)}, s-maxage=${ttl}`);
    return res.status(200).type("application/json").send(hit.body);
  }
  const send = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) {
      if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value);
      store.set(key, { exp: Date.now() + ttl * 1000, body: JSON.stringify(body) });
      res.set("Cache-Control", `public, max-age=${Math.min(ttl, 30)}, s-maxage=${ttl}`);
    }
    res.set("X-Cache", "MISS");
    return send(body);
  };
  next();
};

const clearCache = () => store.clear();

// mount once on /api/v1: clears the cache after every successful write
const clearOnWrite = (req, res, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && !/\/(visit|click)(\/|$)/.test(req.path)) {
    res.on("finish", () => {
      if (res.statusCode < 400) clearCache();
    });
  }
  next();
};

module.exports = { cacheGet, clearCache, clearOnWrite };
