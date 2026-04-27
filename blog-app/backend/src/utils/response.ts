export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export const success = <T>(data: T, message: string = '操作成功'): ApiResponse<T> => ({
  code: 200,
  message,
  data
});

export const error = (message: string, code: number = 500): ApiResponse => ({
  code,
  message
});

export const unauthorized = (message: string = '未授权访问'): ApiResponse => ({
  code: 401,
  message
});

export const forbidden = (message: string = '禁止访问'): ApiResponse => ({
  code: 403,
  message
});

export const notFound = (message: string = '资源不存在'): ApiResponse => ({
  code: 404,
  message
});

export const validationError = (message: string = '参数验证失败'): ApiResponse => ({
  code: 400,
  message
});
