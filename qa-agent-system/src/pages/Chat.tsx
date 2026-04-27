import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { MessageContent, StreamingMessage } from '@/components/MessageContent';
import { ChatInput, ExampleQuestionCard } from '@/components/ChatInput';
import { IntentType } from '@/types';
import { 
  UtensilsCrossed, 
  Microscope, 
  BookOpen, 
  Heart, 
  GitCompare,
  Sparkles,
  Trash2
} from 'lucide-react';
import { getDomainConfig } from '@/services/intentRecognition';

const iconComponents = {
  UtensilsCrossed,
  Microscope,
  BookOpen,
  Heart,
  GitCompare
};

export default function Chat() {
  const { 
    messages, 
    isLoading, 
    streamingContent, 
    currentIntent,
    exampleQuestions,
    initSession,
    sendStreamMessage,
    clearMessages
  } = useChatStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化会话
  useEffect(() => {
    initSession();
  }, []);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSendMessage = async (content: string) => {
    await sendStreamMessage(content);
  };

  const handleExampleClick = (text: string) => {
    sendStreamMessage(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI问答助手</h1>
              <p className="text-xs text-gray-500">智能识别意图 · 图文混排回复</p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>清空对话</span>
            </button>
          )}
        </div>
      </header>

      {/* 消息列表 */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            // 空状态 - 显示欢迎和示例问题
            <div className="space-y-8">
              {/* 欢迎区域 */}
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  有什么可以帮您的？
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  我可以识别您的提问意图，并提供图文混排的专业回答。
                  支持美食、科普、教程、医疗、对比五大类问题。
                </p>
              </div>

              {/* 五大领域介绍 */}
              <div className="grid grid-cols-5 gap-4">
                {Object.values(IntentType)
                  .filter(type => type !== IntentType.UNKNOWN)
                  .map((intentType) => {
                    const config = getDomainConfig(intentType);
                    if (!config) return null;
                    
                    const IconComponent = iconComponents[config.icon as keyof typeof iconComponents];
                    
                    return (
                      <div 
                        key={intentType}
                        className="text-center p-4 rounded-xl transition-all hover:scale-105"
                        style={{ backgroundColor: config.bgColor }}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: config.color + '20', color: config.color }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{config.name}</h3>
                        <p className="text-xs text-gray-600">{config.description}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 示例问题 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">试试这些问题</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exampleQuestions.map((question) => {
                    const config = getDomainConfig(question.intentType);
                    const IconComponent = iconComponents[question.icon as keyof typeof iconComponents];
                    
                    return (
                      <ExampleQuestionCard
                        key={question.id}
                        question={{
                          text: question.text,
                          icon: <IconComponent className="w-5 h-5" />,
                          color: config?.color || '#3B82F6'
                        }}
                        onClick={() => handleExampleClick(question.text)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // 消息列表
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageContent 
                  key={message.id} 
                  message={message}
                  isStreaming={false}
                />
              ))}
              
              {/* 流式响应 */}
              {isLoading && streamingContent && (
                <StreamingMessage 
                  content={streamingContent}
                  intent={currentIntent || undefined}
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* 输入区域 */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} />
          <p className="text-xs text-gray-400 text-center mt-2">
            AI生成的内容仅供参考，医疗建议请咨询专业医生
          </p>
        </div>
      </footer>
    </div>
  );
}
