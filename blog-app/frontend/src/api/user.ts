import request from '../utils/request';
import { ApiResponse, User, Article, PaginationData } from '../types';

interface UpdateProfileData {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const getProfile = (): Promise<ApiResponse<User>> => {
  return request.get('/users/profile').then(res => res.data);
};

export const updateProfile = (data: UpdateProfileData): Promise<ApiResponse<null>> => {
  return request.put('/users/profile', data).then(res => res.data);
};

export const changePassword = (data: ChangePasswordData): Promise<ApiResponse<null>> => {
  return request.put('/users/password', data).then(res => res.data);
};

export const getMyArticles = (params?: { page?: number; pageSize?: number; status?: string }): Promise<ApiResponse<PaginationData<Article>>> => {
  return request.get('/users/articles', { params }).then(res => res.data);
};
