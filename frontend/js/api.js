const API_BASE_URL = 'http://localhost:8080';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro na requisição');
  }

  if (response.status === 204) return null;
  return response.json();
}
