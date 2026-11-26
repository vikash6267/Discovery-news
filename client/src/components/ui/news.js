import { format } from "date-fns";

export const truncate = (text = "", words = 12) => {
  const w = String(text).split(" ");
  return w.length > words ? `${w.slice(0, words).join(" ")}…` : text;
};

export const fmtDate = (d) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : format(date, "d MMM yyyy, h:mm a");
};

export const imgOf = (news) => news?.images?.[0]?.url || "/logo.png";

export const byLatest = (a, b) =>
  new Date(b.publish || b.createdAt) - new Date(a.publish || a.createdAt);
