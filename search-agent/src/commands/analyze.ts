import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { ConfigManager } from '../core/ConfigManager.js';
import { GEOAnalyzer } from '../core/GEOAnalyzer.js';
import { ReportGenerator } from '../core/ReportGenerator.js';
import { Logger, createLogger } from '../utils/logger.js';
import { SearchSource } from '../types/index.js';

export function createAnalyzeCommand(): Command {
  const command = new Command('analyze');
  
  command
    .description('分析已有的抓取数据')
    .requiredOption('-i, --input <path>', '输入数据文件路径')
    .requiredOption('-k, --keyword <keyword>', '关键词')
    .option('-o, --output <path>', '输出路径')
    .option('-f, --format <format>', '输出格式 (json|csv|markdown|console)', 'console')
    .option('-c, --config-path <path>', '配置文件路径', './config/config.json')
    .action(async (options) => {
      const spinner = ora('正在加载数据...').start();
      
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

        // 加载数据
        if (!(await fs.pathExists(options.input))) {
          throw new Error(`输入文件不存在: ${options.input}`);
        }

        const data = await fs.readJson(options.input);
        const sources: SearchSource[] = data.sources || data;

        if (!Array.isArray(sources) || sources.length === 0) {
          throw new Error('输入文件中没有有效的搜索源数据');
        }

        spinner.text = '正在进行GEO分析...';

        // 执行分析
        const geoAnalyzer = new GEOAnalyzer(logger);
        const report = await geoAnalyzer.analyze({
          keyword: options.keyword,
          sources,
        });

        spinner.succeed('分析完成');

        // 生成报告
        const reportGenerator = new ReportGenerator(logger);
        const format = options.format as 'json' | 'csv' | 'markdown' | 'console';
        const outputPath = options.output || path.join(config.output.defaultPath, `report_${options.keyword}_${Date.now()}`);

        await reportGenerator.export({
          format,
          outputPath: format === 'console' ? undefined : `${outputPath}.${format === 'markdown' ? 'md' : format}`,
          report,
        });

        // 输出摘要
        console.log('\n' + chalk.cyan('═'.repeat(60)));
        console.log(chalk.bold('📊 分析摘要'));
        console.log(chalk.cyan('═'.repeat(60)));
        console.log(`  关键词: ${chalk.yellow(options.keyword)}`);
        console.log(`  分析源数: ${chalk.green(sources.length)}`);
        console.log(`  平均GEO得分: ${chalk.yellow(report.summary.avgScore.toFixed(1))}`);
        if (format !== 'console') {
          console.log(`  报告文件: ${chalk.gray(outputPath)}.${format === 'markdown' ? 'md' : format}`);
        }
        console.log(chalk.cyan('═'.repeat(60)));

      } catch (error) {
        spinner.fail('分析失败');
        console.error(chalk.red('\n错误:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
