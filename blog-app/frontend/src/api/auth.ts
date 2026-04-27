import request from '../utils/request';
import { ApiResponse, User } from '../types';

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role?: string;
  avatar?: string;
  token: string;
}

export const login = (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  return request.post('/auth/login', data).then(res => res.data);
};

export const register = (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  return request.post('/auth/register', data).then(res => res.data);
};
