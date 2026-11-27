// Accepts watch / youtu.be / shorts / embed / live links and returns the 11-char video id.
export function ytId(url = "") {
  const m = String(url).match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
