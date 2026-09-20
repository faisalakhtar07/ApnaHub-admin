const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ADMIN_TOKEN_KEY = "apnahub_admin_token";

function authHeader() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...authHeader(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function resource(name) {
  return {
    list: () => request(`/${name}`),
    get: (id) => request(`/${name}/${id}`),
    create: (payload) => request(`/${name}`, { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/${name}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/${name}/${id}`, { method: "DELETE" }),
  };
}

export const businessesApi = resource("businesses");
export const jobsApi = resource("jobs");
export const listingsApi = resource("listings");

export const subscriptionPlansApi = {
  list: () => request("/subscription-plans?all=true"),
  create: (payload) => request("/subscription-plans", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/subscription-plans/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/subscription-plans/${id}`, { method: "DELETE" }),
};

export const platformSettingsApi = {
  get: () => request("/admin/settings"),
  update: (payload) => request("/admin/settings", { method: "PUT", body: JSON.stringify(payload) }),
};

export const adsApi = {
  all: () => request("/ads/admin/all"),
  setStatus: (id, status) => request(`/ads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  toggleFeature: (id) => request(`/ads/${id}/feature`, { method: "PATCH" }),
};

export const adminAuthApi = {
  login: async (email, password) => {
    const data = await request("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    return data;
  },
  logout: () => localStorage.removeItem(ADMIN_TOKEN_KEY),
  isLoggedIn: () => Boolean(localStorage.getItem(ADMIN_TOKEN_KEY)),
};
