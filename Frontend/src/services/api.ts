// const API_BASE_URL = 'http://localhost:9000/api';
const API_BASE_URL = 'https://ai-powered-knowledge-hub.onrender.com';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request<{ data: { token: string; user: any } }>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username: string, password: string) {
    return this.request<{ data: { token: string; user: any } }>('/user/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Article endpoints
  async createArticle(data: { title: string; content: string; tags: string[] }) {
    return this.request<any>('/articles/create-article', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getArticles() {
    return this.request<{ data: any[] }>('/articles/get-all-articles');
  }

  async getArticle(id: string) {
    return this.request<{ data: any }>(`/articles/get-article/${id}`);
  }

  async updateArticle(id: string, data: { title: string; content: string; tags: string[] }) {
    return this.request<any>(`/articles/update-article/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/delete-article/${id}`, {
      method: 'DELETE',
    });
  }

  async summarizeArticle(id: string) {
    return this.request<{ summary: string }>(`/articles/ai-content/${id}/summarize`, {
      method: 'POST',
    });
  }

  // User endpoints
  async getUsers() {
    return this.request<any[]>('/auth/users');
  }
}

export const apiService = new ApiService();
