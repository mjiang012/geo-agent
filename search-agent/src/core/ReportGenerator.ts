import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Table from 'cli-table3';
import { Report, GEOAnalysis, SearchSource } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export type ExportFormat = 'json' | 'csv' | 'markdown' | 'console';

export interface ExportOptions {
  format: ExportFormat;
  outputPath?: string;
  report: Report;
}

export class ReportGenerator {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * 导出报告
   */
  async export(options: ExportOptions): Promise<string> {
    const { format, outputPath, report } = options;

    switch (format) {
      case 'console':
        this.generateConsoleReport(report);
        return 'console';
      
      case 'json':
        return await this.generateJSONReport(report, outputPath);
      
      case 'csv':
        return await this.generateCSVReport(report, outputPath);
      
      case 'markdown':
        return await this.generateMarkdownReport(report, outputPath);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * 生成控制台报告
   */
  generateConsoleReport(report: Report): void {
    console.log('\n');
    console.log(chalk.cyan('═'.repeat(80)));
    console.log(chalk.bold.cyan('  GEO优化分析报告'));
    console.log(chalk.cyan('═'.repeat(80)));
    console.log('\n');

    // 基本信息
    console.log(chalk.bold('📊 基本信息'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(`  关键词: ${chalk.yellow(report.keyword)}`);
    console.log(`  分析时间: ${chalk.gray(report.generatedAt.toLocaleString())}`);
    console.log(`  数据来源: ${chalk.gray(report.sources.length)} 个搜索源`);
    console.log('\n');

    // 摘要统计
    console.log(chalk.bold('📈 摘要统计'));
    console.log(chalk.gray('─'.repeat(60)));
    
    const summaryTable = new Table({
      head: [chalk.bold('指标'), chalk.bold('数值')],
      colWidths: [30, 30],
    });
    
    summaryTable.push(
      ['总搜索源数', report.summary.totalSources.toString()],
      ['平均GEO得分', chalk.yellow(report.summary.avgScore.toFixed(1))],
      ['热门关键词', report.summary.topKeywords.slice(0, 5).join(', ')],
      ['常见模式', report.summary.commonPatterns.join(', ')]
    );
    
    console.log(summaryTable.toString());
    console.log('\n');

    // 详细分析
    console.log(chalk.bold('🔍 详细分析'));
    console.log(chalk.gray('─'.repeat(60)));
    
    report.analyses.forEach((analysis, index) => {
      const source = report.sources.find(s => s.id === analysis.sourceId);
      if (!source) return;

      console.log(`\n  ${chalk.bold(`[${index + 1}]`)} ${chalk.cyan(source.title)}`);
      console.log(`  ${chalk.gray('来源:')} ${source.platform} | ${chalk.gray('域名:')} ${source.domain}`);
      console.log(`  ${chalk.gray('GEO得分:')} ${this.getScoreColor(analysis.score)(analysis.score.toString())}`);
      
      // 内容特征
      const features = analysis.contentFeatures;
      console.log(`  ${chalk.gray('内容特征:')} ${features.wordCount}字 | ${features.paragraphCount}段落 | ${features.headingCount}标题`);
      
      // 关键词
      if (analysis.keywords.primary.length > 0) {
        console.log(`  ${chalk.gray('核心关键词:')} ${analysis.keywords.primary.join(', ')}`);
      }
      
      // 优化建议
      if (analysis.suggestions.title.length > 0 || analysis.suggestions.content.length > 0) {
        console.log(`  ${chalk.gray('优化建议:')}`);
        [...analysis.suggestions.title, ...analysis.suggestions.content].slice(0, 3).forEach(suggestion => {
          console.log(`    • ${suggestion}`);
        });
      }
    });

    console.log('\n');
    console.log(chalk.cyan('═'.repeat(80)));
    console.log(chalk.gray('  报告生成完成'));
    console.log(chalk.cyan('═'.repeat(80)));
    console.log('\n');
  }

  /**
   * 生成JSON报告
   */
  private async generateJSONReport(report: Report, outputPath?: string): Promise<string> {
    const fileName = `report_${report.keyword}_${Date.now()}.json`;
    const filePath = outputPath || path.join('./output', fileName);

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeJson(filePath, report, { spaces: 2 });

    this.logger.info(`JSON report saved to: ${filePath}`);
    return filePath;
  }

  /**
   * 生成CSV报告
   */
  private async generateCSVReport(report: Report, outputPath?: string): Promise<string> {
    const fileName = `report_${report.keyword}_${Date.now()}.csv`;
    const filePath = outputPath || path.join('./output', fileName);

    // CSV头部
    const headers = [
      '排名',
      '平台',
      '标题',
      'URL',
      '域名',
      'GEO得分',
      '字数',
      '段落数',
      '核心关键词',
      '优化建议',
    ];

    // CSV行
    const rows = report.analyses.map((analysis, index) => {
      const source = report.sources.find(s => s.id === analysis.sourceId);
      if (!source) return [];

      return [
        (index + 1).toString(),
        source.platform,
        `"${source.title.replace(/"/g, '""')}"`,
        source.url,
        source.domain,
        analysis.score.toString(),
        analysis.contentFeatures.wordCount.toString(),
        analysis.contentFeatures.paragraphCount.toString(),
        `"${analysis.keywords.primary.join(', ')}"`,
        `"${[...analysis.suggestions.title, ...analysis.suggestions.content].slice(0, 2).join('; ')}"`,
      ];
    }).filter(row => row.length > 0);

    // 构建CSV内容
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, csvContent, 'utf-8');

    this.logger.info(`CSV report saved to: ${filePath}`);
    return filePath;
  }

  /**
   * 生成Markdown报告
   */
  private async generateMarkdownReport(report: Report, outputPath?: string): Promise<string> {
    const fileName = `report_${report.keyword}_${Date.now()}.md`;
    const filePath = outputPath || path.join('./output', fileName);

    const lines: string[] = [];

    // 标题
    lines.push(`# GEO优化分析报告: ${report.keyword}`);
    lines.push('');
    lines.push(`> 生成时间: ${report.generatedAt.toLocaleString()}`);
    lines.push('');

    // 摘要
    lines.push('## 📊 摘要统计');
    lines.push('');
    lines.push(`- **总搜索源数**: ${report.summary.totalSources}`);
    lines.push(`- **平均GEO得分**: ${report.summary.avgScore.toFixed(1)}`);
    lines.push(`- **热门关键词**: ${report.summary.topKeywords.slice(0, 5).join(', ')}`);
    lines.push(`- **常见模式**: ${report.summary.commonPatterns.join(', ')}`);
    lines.push('');

    // 详细分析
    lines.push('## 🔍 详细分析');
    lines.push('');

    report.analyses.forEach((analysis, index) => {
      const source = report.sources.find(s => s.id === analysis.sourceId);
      if (!source) return;

      lines.push(`### ${index + 1}. ${source.title}`);
      lines.push('');
      lines.push(`- **来源平台**: ${source.platform}`);
      lines.push(`- **域名**: ${source.domain}`);
      lines.push(`- **URL**: ${source.url}`);
      lines.push(`- **GEO得分**: ${analysis.score}/100`);
      lines.push('');

      // 内容特征
      lines.push('#### 内容特征');
      lines.push('');
      const features = analysis.contentFeatures;
      lines.push(`| 指标 | 数值 |`);
      lines.push(`|------|------|`);
      lines.push(`| 字数 | ${features.wordCount} |`);
      lines.push(`| 段落数 | ${features.paragraphCount} |`);
      lines.push(`| 平均句长 | ${features.avgSentenceLength} |`);
      lines.push(`| 标题数 | ${features.headingCount} |`);
      lines.push(`| 列表数 | ${features.listCount} |`);
      lines.push(`| 链接数 | ${features.linkCount} |`);
      lines.push('');

      // 关键词
      if (analysis.keywords.primary.length > 0) {
        lines.push('#### 关键词分析');
        lines.push('');
        lines.push(`- **核心关键词**: ${analysis.keywords.primary.join(', ')}`);
        lines.push(`- **次要关键词**: ${analysis.keywords.secondary.join(', ')}`);
        lines.push(`- **长尾关键词**: ${analysis.keywords.longTail.join(', ')}`);
        lines.push('');
      }

      // 优化建议
      const allSuggestions = [
        ...analysis.suggestions.title.map(s => `🏷️ ${s}`),
        ...analysis.suggestions.structure.map(s => `📐 ${s}`),
        ...analysis.suggestions.content.map(s => `📝 ${s}`),
        ...analysis.suggestions.keywords.map(s => `🔑 ${s}`),
      ];

      if (allSuggestions.length > 0) {
        lines.push('#### 优化建议');
        lines.push('');
        allSuggestions.forEach(suggestion => {
          lines.push(`- ${suggestion}`);
        });
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    });

    // 结论
    lines.push('## 💡 优化结论');
    lines.push('');
    lines.push('基于以上分析，建议重点关注以下方面：');
    lines.push('');
    
    // 提取最常见的建议
    const allSuggestions: string[] = [];
    report.analyses.forEach(a => {
      allSuggestions.push(...a.suggestions.title, ...a.suggestions.content);
    });
    
    const suggestionCounts: Record<string, number> = {};
    allSuggestions.forEach(s => {
      suggestionCounts[s] = (suggestionCounts[s] || 0) + 1;
    });
    
    Object.entries(suggestionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([suggestion, count], index) => {
        lines.push(`${index + 1}. ${suggestion} (${count}次提及)`);
      });
    
    lines.push('');

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, lines.join('\n'), 'utf-8');

    this.logger.info(`Markdown report saved to: ${filePath}`);
    return filePath;
  }

  /**
   * 根据分数获取颜色
   */
  private getScoreColor(score: number): (text: string) => string {
    if (score >= 80) return chalk.green;
    if (score >= 60) return chalk.yellow;
    return chalk.red;
  }
}
