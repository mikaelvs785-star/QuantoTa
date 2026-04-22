const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:8080';

async function apiRequest(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro na requisição');
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o back-end está ativo.');
    }
    throw error;
  }
}
