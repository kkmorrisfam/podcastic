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
