import request from '../utils/request';
import { ApiResponse, Article, PaginationData } from '../types';

interface ArticleListParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  keyword?: string;
  status?: string;
}

interface CreateArticleData {
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  categoryId?: number;
  tags?: string[];
  status: 'draft' | 'published';
}

export const getArticles = (params?: ArticleListParams): Promise<ApiResponse<PaginationData<Article>>> => {
  return request.get('/articles', { params }).then(res => res.data);
};

export const getArticle = (id: number): Promise<ApiResponse<Article>> => {
  return request.get(`/articles/${id}`).then(res => res.data);
};

export const createArticle = (data: CreateArticleData): Promise<ApiResponse<{ id: number }>> => {
  return request.post('/articles', data).then(res => res.data);
};

export const updateArticle = (id: number, data: Partial<CreateArticleData>): Promise<ApiResponse<null>> => {
  return request.put(`/articles/${id}`, data).then(res => res.data);
};

export const deleteArticle = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/articles/${id}`).then(res => res.data);
};
