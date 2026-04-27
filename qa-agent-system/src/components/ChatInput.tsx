import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

interface ChatInputProps {
  onSend?: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSend, 
  disabled = false,
  placeholder = '输入您的问题，例如：红烧肉怎么做？'
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isLoading, sendStreamMessage } = useChatStore();

  // 自动调整高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || disabled) return;

    // 清空输入
    setInput('');
    
    // 重置高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // 调用发送消息
    if (onSend) {
      onSend(trimmedInput);
    } else {
      await sendStreamMessage(trimmedInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading || disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent border-0 outline-none text-gray-800 placeholder-gray-400 min-h-[24px] max-h-[200px] py-1"
        style={{ lineHeight: '1.5' }}
      />
      
      <button
        type="submit"
        disabled={!input.trim() || isLoading || disabled}
        className={`
          flex-shrink-0 p-2.5 rounded-xl transition-all duration-200
          ${input.trim() && !isLoading && !disabled
            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}

// 快捷输入建议
export function QuickSuggestions({ 
  suggestions,
  onSelect 
}: { 
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full border border-gray-200 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

// 示例问题卡片
export function ExampleQuestionCard({
  question,
  onClick
}: {
  question: { text: string; icon: React.ReactNode; color: string };
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ backgroundColor: question.color + '20', color: question.color }}
      >
        {question.icon}
      </div>
      <span className="text-gray-700 font-medium">{question.text}</span>
    </button>
  );
}
