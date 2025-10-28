// src/api.js
import { auth } from "./firebase";

export async function apiFetch(url, options = {}) {
  try {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken(true) : null;

    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro na API: ${res.status} - ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("apiFetch error:", err);
    throw err;
  }
}
