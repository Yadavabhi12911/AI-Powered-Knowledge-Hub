export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  summary?: string;
  author: {
    _id: string;
    username: string;
    role: 'user' | 'admin';
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ArticleFormData {
  title: string;
  content: string;
  tags: string[];
}