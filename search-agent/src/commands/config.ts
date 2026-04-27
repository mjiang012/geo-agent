import { Command } from 'commander';
import chalk from 'chalk';
import { ConfigManager } from '../core/ConfigManager.js';
import { Logger, createLogger } from '../utils/logger.js';

export function createConfigCommand(): Command {
  const command = new Command('config');
  
  command
    .description('配置管理')
    .option('-c, --config-path <path>', '配置文件路径', './config/config.json')
    .option('-g, --get <key>', '获取配置项')
    .option('-s, --set <key>', '设置配置项')
    .option('-v, --value <value>', '配置值（与--set配合使用）')
    .option('-l, --list', '列出所有配置')
    .action(async (options) => {
      try {
        const tempLogger = createLogger({
          level: 'info',
          file: './logs/search-agent.log',
        });

        const configManager = new ConfigManager(options.configPath, tempLogger);
        await configManager.load();

        if (options.list) {
          // 列出所有配置
          const config = configManager.getConfig();
          console.log('\n' + chalk.cyan('当前配置:'));
          console.log(chalk.gray('─'.repeat(60)));
          console.log(JSON.stringify(config, null, 2));
          console.log(chalk.gray('─'.repeat(60)));
          console.log(chalk.gray(`配置文件路径: ${configManager.getConfigPath()}`));
          
        } else if (options.get) {
          // 获取配置项
          const value = configManager.get(options.get);
          if (value !== undefined) {
            console.log(chalk.cyan(`${options.get}:`));
            if (typeof value === 'object') {
              console.log(JSON.stringify(value, null, 2));
            } else {
              console.log(value);
            }
          } else {
            console.log(chalk.yellow(`配置项 "${options.get}" 不存在`));
          }
          
        } else if (options.set) {
          // 设置配置项
          if (options.value === undefined) {
            console.error(chalk.red('错误: 使用 --set 时必须提供 --value'));
            process.exit(1);
          }

          // 尝试解析值
          let parsedValue: any = options.value;
          try {
            parsedValue = JSON.parse(options.value);
          } catch {
            // 保持字符串值
          }

          await configManager.set(options.set, parsedValue);
          console.log(chalk.green(`✓ 配置已更新: ${options.set} = ${JSON.stringify(parsedValue)}`));
          
        } else {
          // 显示帮助
          console.log(chalk.cyan('配置管理命令'));
          console.log('');
          console.log('用法:');
          console.log(`  search-agent config --list                    ${chalk.gray('列出所有配置')}`);
          console.log(`  search-agent config --get <key>               ${chalk.gray('获取配置项')}`);
          console.log(`  search-agent config --set <key> --value <v>   ${chalk.gray('设置配置项')}`);
          console.log('');
          console.log('示例:');
          console.log(`  search-agent config --get crawl.timeout`);
          console.log(`  search-agent config --set crawl.delay --value 2000`);
          console.log(`  search-agent config --set sources.doubao.enabled --value false`);
        }

      } catch (error) {
        console.error(chalk.red('错误:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
