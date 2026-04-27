export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  bio?: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  cover_image?: string;
  author_id: number;
  category_id?: number;
  view_count: number;
  like_count: number;
  comment_count?: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  author_username?: string;
  author_avatar?: string;
  category_name?: string;
  tags?: Tag[];
}

export interface Comment {
  id: number;
  content: string;
  article_id: number;
  author_id: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  author_username?: string;
  author_avatar?: string;
  replies?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  article_count?: number;
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  article_count?: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface PaginationData<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
