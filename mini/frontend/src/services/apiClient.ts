const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const getHeaders = () => {
  const token = localStorage.getItem("govai_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const handle = async (res: Response) => {
  if (!res.ok) {
    let message = res.statusText;

    try {
      const data = await res.json();
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        message = data.errors[0]?.msg || message;
      } else {
        message = data?.message || message;
      }
    } catch (_error) {
      const text = await res.text();
      message = text || message;
    }

    throw new Error(message);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return null;
};

const request = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init.headers || {}),
    },
  });

  return handle(res);
};

export const apiClient = {
  get(path: string) {
    return request(path);
  },
  post(path: string, body: unknown) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  put(path: string, body: unknown) {
    return request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
};
