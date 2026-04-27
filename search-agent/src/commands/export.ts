import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { ConfigManager } from '../core/ConfigManager.js';
import { ReportGenerator } from '../core/ReportGenerator.js';
import { Logger, createLogger } from '../utils/logger.js';
import { Report } from '../types/index.js';

export function createExportCommand(): Command {
  const command = new Command('export');
  
  command
    .description('导出分析报告')
    .requiredOption('-i, --input <path>', '输入报告文件路径')
    .option('-f, --format <format>', '输出格式 (json|csv|markdown)', 'markdown')
    .option('-o, --output <path>', '输出文件路径')
    .option('-c, --config-path <path>', '配置文件路径', './config/config.json')
    .action(async (options) => {
      const spinner = ora('正在加载报告...').start();
      
      try {
        // 加载配置
        const tempLogger = createLogger({
          level: 'info',
          file: './logs/search-agent.log',
        });

        const configManager = new ConfigManager(options.configPath, tempLogger);
        await configManager.load();
        
        const config = configManager.getConfig();
        const logger = createLogger(config.logging);

        // 加载报告
        if (!(await fs.pathExists(options.input))) {
          throw new Error(`输入文件不存在: ${options.input}`);
        }

        const report: Report = await fs.readJson(options.input);

        if (!report.keyword || !report.analyses) {
          throw new Error('输入文件格式不正确');
        }

        spinner.text = '正在导出报告...';

        // 生成报告
        const reportGenerator = new ReportGenerator(logger);
        const format = options.format as 'json' | 'csv' | 'markdown';
        
        const outputPath = options.output || path.join(
          config.output.defaultPath, 
          `exported_${report.keyword}_${Date.now()}.${format === 'markdown' ? 'md' : format}`
        );

        const result = await reportGenerator.export({
          format,
          outputPath,
          report,
        });

        spinner.succeed('导出完成');

        console.log('\n' + chalk.green('✓ 报告已导出'));
        console.log(chalk.gray(`  文件: ${result}`));

      } catch (error) {
        spinner.fail('导出失败');
        console.error(chalk.red('\n错误:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
