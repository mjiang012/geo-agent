import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, GeneratedImage, IntentResult } from '@/types';
import { IntentBadge, IntentLoadingBadge } from './IntentBadge';
import { ImageGallery } from './ImageGallery';
import { 
  User, 
  Bot, 
  Copy, 
  Check, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

interface MessageContentProps {
  message: Message;
  isStreaming?: boolean;
  showIntent?: boolean;
}

export function MessageContent({ message, isStreaming, showIntent = true }: MessageContentProps) {
  const [copied, setCopied] = useState(false);
  const { isLoading, currentIntent, isGeneratingImage, regenerateResponse } = useChatStore();
  
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleRegenerate = () => {
    if (!isLoading) {
      regenerateResponse(message.id);
    }
  };

  // 检查是否是医疗类消息（需要显示免责声明）
  const showMedicalDisclaimer = message.intent?.type === 'medical';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* 头像 */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
        ${isUser ? 'bg-blue-500' : 'bg-gray-100'}
      `}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-gray-600" />
        )}
      </div>

      {/* 消息内容 */}
      <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* 意图标签（仅AI消息） */}
        {isAssistant && showIntent && (
          <div className="mb-2">
            {isStreaming && !message.intent ? (
              <IntentLoadingBadge size="sm" />
            ) : message.intent ? (
              <IntentBadge intent={message.intent} size="sm" animated />
            ) : null}
          </div>
        )}

        {/* 消息气泡 */}
        <div className={`
          relative max-w-3xl rounded-2xl px-5 py-3
          ${isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-white border border-gray-200 rounded-bl-md shadow-sm'
          }
        `}>
          {/* 用户消息直接显示文本 */}
          {isUser && (
            <p className="text-white whitespace-pre-wrap">{message.content}</p>
          )}

          {/* AI消息使用Markdown渲染 */}
          {isAssistant && (
            <>
              <div className={`
                prose prose-sm max-w-none
                ${isUser ? 'prose-invert' : 'prose-gray'}
              `}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 自定义表格样式
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border-collapse border border-gray-300">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                    th: ({ children }) => (
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {children}
                      </td>
                    ),
                    // 自定义代码块
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                          <code className={className}>{children}</code>
                        </pre>
                      );
                    },
                    // 自定义引用块
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-4">
                        {children}
                      </blockquote>
                    ),
                    // 自定义列表
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
                    ),
                    // 自定义标题
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold text-gray-800 mt-5 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">{children}</h3>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* 医疗免责声明 */}
              {showMedicalDisclaimer && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    <strong>免责声明：</strong>以上内容仅供科普参考，不构成医疗建议。如有健康问题，请及时就医咨询专业医生。
                  </p>
                </div>
              )}

              {/* 图片画廊 */}
              {message.images && message.images.length > 0 && (
                <ImageGallery 
                  images={message.images}
                  isGenerating={isGeneratingImage && isStreaming}
                />
              )}

              {/* 流式生成中的图片提示 */}
              {isGeneratingImage && isStreaming && (!message.images || message.images.length === 0) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    AI正在生成配图...
                  </p>
                </div>
              )}
            </>
          )}

          {/* 操作按钮（仅AI消息） */}
          {isAssistant && !isStreaming && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                title="复制内容"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制</span>
                  </>
                )}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                title="重新生成"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>重新生成</span>
              </button>
            </div>
          )}
        </div>

        {/* 时间戳 */}
        <span className="text-xs text-gray-400 mt-1 px-1">
          {new Date(message.createdAt).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}

// 流式消息组件
export function StreamingMessage({ content, intent }: { content: string; intent?: IntentResult }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <Bot className="w-5 h-5 text-gray-600" />
      </div>

      <div className="flex-1 flex flex-col items-start">
        {/* 意图标签 */}
        <div className="mb-2">
          {intent ? (
            <IntentBadge intent={intent} size="sm" />
          ) : (
            <IntentLoadingBadge size="sm" />
          )}
        </div>

        {/* 消息气泡 */}
        <div className="max-w-3xl bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-5 py-3">
          <div className="prose prose-sm max-w-none prose-gray">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
          
          {/* 打字光标 */}
          <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
