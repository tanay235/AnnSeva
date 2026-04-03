const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request(path, options = {}) {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const payload = await response.json();
      if (payload?.message) {
        errorMessage = payload.message;
      }
    } catch (error) {
      // Ignore parser errors and keep generic message.
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export { API_BASE_URL, request };
