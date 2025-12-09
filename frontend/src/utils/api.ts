/**
 * A wrapper around `fetch` that automatically attaches the user's auth token
 * (if it exists in localStorage) and sets JSON headers. 
 * 
 * Returns the raw Response object, and logs a warning if the request fails
 * with a 401 Unauthorized status.
 */

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth.token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    console.warn("Unauthorized — token expired?");
  }

  return res;
}
