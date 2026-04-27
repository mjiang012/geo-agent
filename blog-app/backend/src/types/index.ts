export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar?: string;
  role: 'user' | 'admin';
  bio?: string;
  created_at: Date;
  updated_at: Date;
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
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
}

export interface ArticleWithAuthor extends Article {
  author_username: string;
  author_avatar?: string;
  category_name?: string;
}

export interface Comment {
  id: number;
  content: string;
  article_id: number;
  author_id: number;
  parent_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CommentWithAuthor extends Comment {
  author_username: string;
  author_avatar?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface Tag {
  id: number;
  name: string;
  created_at: Date;
}

export interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}
