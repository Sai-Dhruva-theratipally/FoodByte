const AUTH_KEY = "fb_auth";
const TOKEN_KEY = "fb_token";

export function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      const tokenOnly = localStorage.getItem(TOKEN_KEY);
      return tokenOnly ? { token: tokenOnly } : null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.token) {
      const tokenOnly = localStorage.getItem(TOKEN_KEY);
      return tokenOnly ? { token: tokenOnly } : null;
    }
    return parsed;
  } catch {
    const tokenOnly = localStorage.getItem(TOKEN_KEY);
    return tokenOnly ? { token: tokenOnly } : null;
  }
}

export function saveAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  if (auth?.token) {
    localStorage.setItem(TOKEN_KEY, auth.token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
