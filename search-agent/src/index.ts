#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInitCommand } from './commands/init.js';
import { createCrawlCommand } from './commands/crawl.js';
import { createAnalyzeCommand } from './commands/analyze.js';
import { createConfigCommand } from './commands/config.js';
import { createExportCommand } from './commands/export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取package.json
const packageJson = await fs.readJson(path.join(__dirname, '../package.json'));

// 创建CLI程序
const program = new Command();

program
  .name('search-agent')
  .description('自动抓取豆包、千问搜索源并进行GEO优化的Agent工具')
  .version(packageJson.version, '-v, --version', '显示版本号')
  .helpOption('-h, --help', '显示帮助信息')
  .addHelpCommand('help [command]', '显示命令帮助');

// 添加命令
program.addCommand(createInitCommand());
program.addCommand(createCrawlCommand());
program.addCommand(createAnalyzeCommand());
program.addCommand(createConfigCommand());
program.addCommand(createExportCommand());

// 自定义帮助信息
program.on('--help', () => {
  console.log('');
  console.log(chalk.cyan('示例:'));
  console.log('  $ search-agent init                              初始化配置');
  console.log('  $ search-agent crawl --keyword "AI工具"          抓取并分析');
  console.log('  $ search-agent crawl -k "AI工具" --mock          使用模拟数据');
  console.log('  $ search-agent analyze -i data/sources.json -k "AI工具"  分析已有数据');
  console.log('  $ search-agent config --list                     查看配置');
  console.log('');
});

// 解析参数
program.parse();

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
