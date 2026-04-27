import request from '../utils/request';
import { ApiResponse, Comment } from '../types';

interface CreateCommentData {
  content: string;
  parentId?: number;
}

export const getComments = (articleId: number): Promise<ApiResponse<Comment[]>> => {
  return request.get(`/comments/article/${articleId}`).then(res => res.data);
};

export const createComment = (articleId: number, data: CreateCommentData): Promise<ApiResponse<Comment>> => {
  return request.post(`/comments/article/${articleId}`, data).then(res => res.data);
};

export const deleteComment = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/comments/${id}`).then(res => res.data);
};
