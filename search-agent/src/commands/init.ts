import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from '../core/ConfigManager.js';
import { Logger, createLogger } from '../utils/logger.js';
import { LoggingConfig } from '../types/index.js';

export function createInitCommand(): Command {
  const command = new Command('init');
  
  command
    .description('初始化配置文件')
    .option('-c, --config-path <path>', '配置文件路径', './config/config.json')
    .action(async (options) => {
      const spinner = ora('正在初始化配置...').start();
      
      try {
        // 创建临时logger
        const tempLogger = createLogger({
          level: 'info',
          file: './logs/search-agent.log',
        });

        const configManager = new ConfigManager(options.configPath, tempLogger);
        await configManager.init();

        spinner.succeed('配置初始化完成');
        
        console.log('\n' + chalk.green('✓ 配置文件已创建'));
        console.log(chalk.gray(`  路径: ${configManager.getConfigPath()}`));
        console.log('\n' + chalk.cyan('提示: 使用以下命令开始抓取'));
        console.log(chalk.yellow(`  search-agent crawl --keyword "你的关键词"`));
        
      } catch (error) {
        spinner.fail('配置初始化失败');
        console.error(chalk.red('\n错误:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
