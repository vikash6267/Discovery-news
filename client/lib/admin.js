"use client";
// Client-side helpers for the /admin panel (token kept in localStorage, role checks, API wrapper).
import { API_URL } from "./site";

const KEY = "mp_admin_session";

export const ROLE_LABELS = {
  SuperAdmin: "मास्टर एडमिन",
  Admin: "सब एडमिन",
  Editor: "संपादक",
  Writer: "कंटेंट राइटर",
  Reporter: "जिला रिपोर्टर",
};

export const isEditorial = (role) => ["SuperAdmin", "Admin", "Editor"].includes(role);
export const isManager = (role) => ["SuperAdmin", "Admin"].includes(role);
export const isStaff = (role) => ["SuperAdmin", "Admin", "Editor", "Writer", "Reporter"].includes(role);

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}
export const setSession = (s) => localStorage.setItem(KEY, JSON.stringify(s));
export const clearSession = () => localStorage.removeItem(KEY);

/** JSON or FormData request with the bearer token. Throws Error(message) on failure. */
export async function api(path, { method = "GET", body, form } = {}) {
  const session = getSession();
  const headers = {};
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (res.status === 401 && session) {
    clearSession();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
  }
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  }
  return data;
}

/** Upload one or more image files through the API (Cloudinary). Returns [{ url, public_id }]. */
export async function uploadImages(files) {
  const form = new FormData();
  [...files].forEach((f) => form.append("thumbnail", f));
  const data = await api("/image/multi", { method: "POST", form });
  return (data.images || []).map((i) => ({ url: i.secure_url || i.url, public_id: i.public_id || "" }));
}

export const slugify = (title) => {
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${ascii || "news"}-${Date.now().toString(36)}`;
};
