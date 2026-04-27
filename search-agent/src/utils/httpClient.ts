import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from './logger.js';
import { CrawlConfig } from '../types/index.js';

export class HttpClient {
  private client: AxiosInstance;
  private logger: Logger;
  private config: CrawlConfig;

  constructor(config: CrawlConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;

    this.client = axios.create({
      timeout: config.timeout,
      headers: {
        'User-Agent': config.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (requestConfig) => {
        this.logger.debug(`HTTP Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
        return requestConfig;
      },
      (error) => {
        this.logger.error('HTTP Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logger.debug(`HTTP Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const config = error.config;
        
        // 重试逻辑
        if (!config || !config.retry) {
          config.retry = 0;
        }

        if (config.retry < this.config.retryCount) {
          config.retry += 1;
          const delay = this.config.delay * config.retry;
          
          this.logger.warn(`Retrying request (${config.retry}/${this.config.retryCount}) after ${delay}ms: ${config.url}`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.client(config);
        }

        this.logger.error(`HTTP Error after ${config.retry} retries:`, {
          url: config?.url,
          status: error.response?.status,
          message: error.message,
        });

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}
