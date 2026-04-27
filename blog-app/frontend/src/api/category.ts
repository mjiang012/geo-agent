import request from '../utils/request';
import { ApiResponse, Category } from '../types';

export const getCategories = (): Promise<ApiResponse<Category[]>> => {
  return request.get('/categories').then(res => res.data);
};
