import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { ConfigManager } from '../core/ConfigManager.js';
import { HttpClient } from '../utils/httpClient.js';
import { CrawlEngine } from '../core/CrawlEngine.js';
import { GEOAnalyzer } from '../core/GEOAnalyzer.js';
import { ReportGenerator } from '../core/ReportGenerator.js';
import { Logger, createLogger } from '../utils/logger.js';
import { generateId } from '../utils/helpers.js';

export function createCrawlCommand(): Command {
  const command = new Command('crawl');
  
  command
    .description('执行搜索源抓取并进行GEO分析')
    .requiredOption('-k, --keyword <keyword>', '搜索关键词')
    .option('-s, --source <sources...>', '搜索源 (doubao|qianwen|all)', ['all'])
    .option('-o, --output <path>', '输出路径')
    .option('-f, --format <format>', '输出格式 (json|csv|markdown|console)', 'console')
    .option('-m, --mock', '使用模拟数据', false)
    .option('-c, --config-path <path>', '配置文件路径', './config/config.json')
    .option('--max-results <number>', '每个平台最大结果数', '10')
    .action(async (options) => {
      const spinner = ora('正在加载配置...').start();
      
      try {
        // 加载配置
        const tempLogger = createLogger({
          level: 'info',
          file: './logs/search-agent.log',
        });

        const configManager = new ConfigManager(options.configPath, tempLogger);
        await configManager.load();
        
        if (!configManager.validate()) {
          throw new Error('配置文件验证失败');
        }

        const config = configManager.getConfig();
        
        // 创建logger
        const logger = createLogger(config.logging);
        
        spinner.text = '正在初始化抓取引擎...';
        
        // 初始化组件
        const httpClient = new HttpClient(config.crawl, logger);
        const crawlEngine = new CrawlEngine(configManager, httpClient, logger);
        const geoAnalyzer = new GEOAnalyzer(logger);
        const reportGenerator = new ReportGenerator(logger);

        spinner.text = `正在抓取 "${options.keyword}" 的搜索源...`;

        // 执行抓取
        const { task, sources } = await crawlEngine.crawl({
          keyword: options.keyword,
          sources: options.source,
          maxResults: parseInt(options.maxResults, 10),
          useMock: options.mock,
        });

        if (sources.length === 0) {
          spinner.warn('未找到任何搜索源');
          return;
        }

        spinner.text = '正在保存抓取数据...';

        // 保存原始数据
        const dataFileName = `sources_${options.keyword}_${Date.now()}.json`;
        const dataFilePath = path.join('./data', dataFileName);
        await fs.ensureDir('./data');
        await fs.writeJson(dataFilePath, {
          task,
          keyword: options.keyword,
          sources,
          fetchedAt: new Date(),
        }, { spaces: 2 });

        spinner.text = '正在进行GEO分析...';

        // 执行GEO分析
        const report = await geoAnalyzer.analyze({
          keyword: options.keyword,
          sources,
        });

        spinner.succeed('抓取和分析完成');

        // 生成报告
        const outputPath = options.output || path.join(config.output.defaultPath, `report_${options.keyword}_${Date.now()}`);
        const format = options.format as 'json' | 'csv' | 'markdown' | 'console';

        await reportGenerator.export({
          format,
          outputPath: format === 'console' ? undefined : `${outputPath}.${format === 'markdown' ? 'md' : format}`,
          report,
        });

        // 输出摘要
        console.log('\n' + chalk.cyan('═'.repeat(60)));
        console.log(chalk.bold('📊 执行摘要'));
        console.log(chalk.cyan('═'.repeat(60)));
        console.log(`  关键词: ${chalk.yellow(options.keyword)}`);
        console.log(`  抓取源数: ${chalk.green(sources.length)}`);
        console.log(`  平均GEO得分: ${chalk.yellow(report.summary.avgScore.toFixed(1))}`);
        console.log(`  数据文件: ${chalk.gray(dataFilePath)}`);
        if (format !== 'console') {
          console.log(`  报告文件: ${chalk.gray(outputPath)}.${format === 'markdown' ? 'md' : format}`);
        }
        console.log(chalk.cyan('═'.repeat(60)));

      } catch (error) {
        spinner.fail('执行失败');
        console.error(chalk.red('\n错误:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
