import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { Config, AgentError, ErrorCode } from '../types/index.js';
import { Logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CONFIG: Config = {
  version: '1.0.0',
  crawl: {
    concurrent: 3,
    timeout: 30000,
    retryCount: 3,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    delay: 1000,
  },
  sources: {
    doubao: {
      enabled: true,
      baseUrl: 'https://www.doubao.com',
    },
    qianwen: {
      enabled: true,
      baseUrl: 'https://tongyi.aliyun.com',
    },
  },
  output: {
    defaultPath: './output',
    formats: ['json', 'csv', 'markdown'],
  },
  logging: {
    level: 'info',
    file: './logs/search-agent.log',
  },
};

export class ConfigManager {
  private configPath: string;
  private config: Config;
  private logger: Logger;

  constructor(configPath: string = './config/config.json', logger: Logger) {
    this.configPath = path.resolve(configPath);
    this.logger = logger;
    this.config = DEFAULT_CONFIG;
  }

  /**
   * 初始化配置文件
   */
  async init(): Promise<void> {
    try {
      // 确保配置目录存在
      const configDir = path.dirname(this.configPath);
      await fs.ensureDir(configDir);

      // 如果配置文件已存在，先备份
      if (await fs.pathExists(this.configPath)) {
        const backupPath = `${this.configPath}.backup.${Date.now()}`;
        await fs.copy(this.configPath, backupPath);
        this.logger.info(`Existing config backed up to: ${backupPath}`);
      }

      // 写入默认配置
      await fs.writeJson(this.configPath, DEFAULT_CONFIG, { spaces: 2 });
      this.config = DEFAULT_CONFIG;
      
      this.logger.info(`Config initialized at: ${this.configPath}`);
    } catch (error) {
      this.logger.error('Failed to initialize config:', error);
      throw new AgentError(
        ErrorCode.STORAGE_ERROR,
        `Failed to initialize config: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 加载配置文件
   */
  async load(): Promise<void> {
    try {
      if (!(await fs.pathExists(this.configPath))) {
        throw new AgentError(
          ErrorCode.CONFIG_NOT_FOUND,
          `Config file not found: ${this.configPath}. Run 'search-agent init' first.`
        );
      }

      const loadedConfig = await fs.readJson(this.configPath);
      this.config = this.mergeConfig(DEFAULT_CONFIG, loadedConfig);
      
      this.logger.info(`Config loaded from: ${this.configPath}`);
    } catch (error) {
      if (error instanceof AgentError) throw error;
      
      this.logger.error('Failed to load config:', error);
      throw new AgentError(
        ErrorCode.CONFIG_INVALID,
        `Failed to load config: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 保存配置
   */
  async save(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeJson(this.configPath, this.config, { spaces: 2 });
      this.logger.info(`Config saved to: ${this.configPath}`);
    } catch (error) {
      this.logger.error('Failed to save config:', error);
      throw new AgentError(
        ErrorCode.STORAGE_ERROR,
        `Failed to save config: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取配置项
   */
  get<T>(key: string): T {
    const keys = key.split('.');
    let value: any = this.config;
    
    for (const k of keys) {
      if (value === undefined || value === null) {
        return undefined as T;
      }
      value = value[k];
    }
    
    return value as T;
  }

  /**
   * 设置配置项
   */
  async set<T>(key: string, value: T): Promise<void> {
    const keys = key.split('.');
    let target: any = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in target)) {
        target[k] = {};
      }
      target = target[k];
    }
    
    target[keys[keys.length - 1]] = value;
    await this.save();
  }

  /**
   * 获取完整配置
   */
  getConfig(): Config {
    return { ...this.config };
  }

  /**
   * 验证配置
   */
  validate(): boolean {
    const required = ['version', 'crawl', 'sources', 'output', 'logging'];
    
    for (const key of required) {
      if (!(key in this.config)) {
        this.logger.error(`Missing required config key: ${key}`);
        return false;
      }
    }

    // 验证crawl配置
    const crawlKeys = ['concurrent', 'timeout', 'retryCount', 'userAgent', 'delay'];
    for (const key of crawlKeys) {
      if (!(key in this.config.crawl)) {
        this.logger.error(`Missing required crawl config: ${key}`);
        return false;
      }
    }

    // 验证sources配置
    if (!this.config.sources.doubao || !this.config.sources.qianwen) {
      this.logger.error('Missing source configuration for doubao or qianwen');
      return false;
    }

    return true;
  }

  /**
   * 合并配置
   */
  private mergeConfig(defaultConfig: Config, userConfig: Partial<Config>): Config {
    return {
      ...defaultConfig,
      ...userConfig,
      crawl: {
        ...defaultConfig.crawl,
        ...userConfig.crawl,
      },
      sources: {
        doubao: {
          ...defaultConfig.sources.doubao,
          ...userConfig.sources?.doubao,
        },
        qianwen: {
          ...defaultConfig.sources.qianwen,
          ...userConfig.sources?.qianwen,
        },
      },
      output: {
        ...defaultConfig.output,
        ...userConfig.output,
      },
      logging: {
        ...defaultConfig.logging,
        ...userConfig.logging,
      },
    };
  }

  /**
   * 获取配置路径
   */
  getConfigPath(): string {
    return this.configPath;
  }
}
