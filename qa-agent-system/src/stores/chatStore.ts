import { create } from 'zustand';
import { 
  Message, 
  ChatSession, 
  IntentType, 
  IntentResult,
  UserSettings,
  GeneratedImage,
  ExampleQuestion
} from '@/types';
import { 
  createSession, 
  createUserMessage, 
  createAssistantMessage,
  processChatRequest,
  streamChatResponse,
  defaultUserSettings
} from '@/services/chatService';
import { getDomainConfig } from '@/services/intentRecognition';

interface ChatState {
  // 会话数据
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: Message[];
  
  // 用户设置
  settings: UserSettings;
  
  // 加载状态
  isLoading: boolean;
  isGeneratingImage: boolean;
  streamingContent: string;
  currentIntent: IntentResult | null;
  
  // 示例问题
  exampleQuestions: ExampleQuestion[];
  
  // Actions
  initSession: () => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  sendStreamMessage: (content: string) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => void;
  clearMessages: () => void;
  addExampleQuestions: (questions: ExampleQuestion[]) => void;
}

// 示例问题
const defaultExampleQuestions: ExampleQuestion[] = [
  {
    id: '1',
    text: '红烧肉怎么做？',
    intentType: IntentType.FOOD,
    icon: 'UtensilsCrossed'
  },
  {
    id: '2',
    text: '大熊猫的生活习性是什么？',
    intentType: IntentType.SCIENCE,
    icon: 'Microscope'
  },
  {
    id: '3',
    text: '如何使用Excel制作图表？',
    intentType: IntentType.TUTORIAL,
    icon: 'BookOpen'
  },
  {
    id: '4',
    text: '心脏的结构和功能',
    intentType: IntentType.MEDICAL,
    icon: 'Heart'
  },
  {
    id: '5',
    text: 'iPhone和Android有什么区别？',
    intentType: IntentType.COMPARISON,
    icon: 'GitCompare'
  }
];

export const useChatStore = create<ChatState>((set, get) => ({
  // 初始状态
  sessions: [],
  currentSession: null,
  messages: [],
  settings: defaultUserSettings,
  isLoading: false,
  isGeneratingImage: false,
  streamingContent: '',
  currentIntent: null,
  exampleQuestions: defaultExampleQuestions,

  // 初始化会话
  initSession: () => {
    const session = createSession('新对话');
    set({
      sessions: [session],
      currentSession: session,
      messages: []
    });
  },

  // 切换会话
  switchSession: (sessionId: string) => {
    const { sessions } = get();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
      // 实际应用中这里应该加载该会话的历史消息
    }
  },

  // 删除会话
  deleteSession: (sessionId: string) => {
    const { sessions, currentSession } = get();
    const newSessions = sessions.filter(s => s.id !== sessionId);
    set({ sessions: newSessions });
    
    if (currentSession?.id === sessionId) {
      if (newSessions.length > 0) {
        set({ currentSession: newSessions[0] });
      } else {
        get().initSession();
      }
    }
  },

  // 发送消息（非流式）
  sendMessage: async (content: string) => {
    const { currentSession, messages, settings } = get();
    
    if (!currentSession) {
      get().initSession();
    }
    
    const session = get().currentSession!;
    
    // 创建用户消息
    const userMessage = createUserMessage(session.id, content);
    
    set({
      messages: [...messages, userMessage],
      isLoading: true,
      currentIntent: null
    });

    try {
      // 处理请求
      const response = await processChatRequest({
        sessionId: session.id,
        message: content,
        context: get().messages,
        generateImage: settings.enableImageGeneration,
        settings
      });

      // 创建AI消息
      const assistantMessage = createAssistantMessage(
        session.id,
        response.content,
        response.intent,
        response.images
      );

      // 更新会话标题（如果是第一条消息）
      if (messages.length === 0) {
        const updatedSession = {
          ...session,
          title: content.slice(0, 20) + (content.length > 20 ? '...' : ''),
          intentType: response.intent.type,
          messageCount: 2,
          updatedAt: new Date().toISOString()
        };
        set({
          sessions: get().sessions.map(s => s.id === session.id ? updatedSession : s),
          currentSession: updatedSession
        });
      }

      set({
        messages: [...get().messages, assistantMessage],
        isLoading: false,
        currentIntent: response.intent
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      set({ isLoading: false });
      
      // 添加错误消息
      const errorMessage = createAssistantMessage(
        session.id,
        '抱歉，处理您的请求时出现了错误。请稍后重试。'
      );
      set({
        messages: [...get().messages, errorMessage]
      });
    }
  },

  // 发送消息（流式）
  sendStreamMessage: async (content: string) => {
    const { currentSession, messages, settings } = get();
    
    if (!currentSession) {
      get().initSession();
    }
    
    const session = get().currentSession!;
    
    // 创建用户消息
    const userMessage = createUserMessage(session.id, content);
    
    set({
      messages: [...messages, userMessage],
      isLoading: true,
      streamingContent: '',
      currentIntent: null
    });

    try {
      const stream = streamChatResponse({
        sessionId: session.id,
        message: content,
        context: get().messages,
        generateImage: settings.enableImageGeneration,
        settings
      });

      let fullContent = '';
      let intentResult: IntentResult | null = null;
      let generatedImages: GeneratedImage[] = [];

      for await (const event of stream) {
        switch (event.type) {
          case 'intent':
            intentResult = event.data as IntentResult;
            set({ currentIntent: intentResult });
            break;
          
          case 'text':
            const { accumulated } = event.data as { chunk: string; accumulated: string };
            fullContent = accumulated;
            set({ streamingContent: accumulated });
            break;
          
          case 'image_start':
            set({ isGeneratingImage: true });
            break;
          
          case 'image_complete':
            generatedImages.push(event.data as GeneratedImage);
            break;
          
          case 'done':
            break;
          
          case 'error':
            console.error('流式响应错误:', event.data);
            break;
        }
      }

      // 创建AI消息
      const assistantMessage = createAssistantMessage(
        session.id,
        fullContent,
        intentResult || undefined,
        generatedImages.length > 0 ? generatedImages : undefined
      );

      // 更新会话标题（如果是第一条消息）
      if (messages.length === 0 && intentResult) {
        const updatedSession = {
          ...session,
          title: content.slice(0, 20) + (content.length > 20 ? '...' : ''),
          intentType: intentResult.type,
          messageCount: 2,
          updatedAt: new Date().toISOString()
        };
        set({
          sessions: get().sessions.map(s => s.id === session.id ? updatedSession : s),
          currentSession: updatedSession
        });
      }

      set({
        messages: [...get().messages, assistantMessage],
        isLoading: false,
        isGeneratingImage: false,
        streamingContent: '',
        currentIntent: intentResult
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      set({ 
        isLoading: false,
        isGeneratingImage: false,
        streamingContent: ''
      });
      
      // 添加错误消息
      const errorMessage = createAssistantMessage(
        session.id,
        '抱歉，处理您的请求时出现了错误。请稍后重试。'
      );
      set({
        messages: [...get().messages, errorMessage]
      });
    }
  },

  // 重新生成响应
  regenerateResponse: async (messageId: string) => {
    const { messages, settings } = get();
    
    // 找到要重新生成的消息
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].role !== 'assistant') {
      return;
    }

    // 找到对应的用户消息
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
      userMessageIndex--;
    }
    
    if (userMessageIndex < 0) return;
    
    const userMessage = messages[userMessageIndex];
    const sessionId = userMessage.sessionId;

    set({ isLoading: true });

    try {
      const response = await processChatRequest({
        sessionId,
        message: userMessage.content,
        context: messages.slice(0, userMessageIndex),
        generateImage: settings.enableImageGeneration,
        settings
      });

      // 更新消息
      const updatedMessage = createAssistantMessage(
        sessionId,
        response.content,
        response.intent,
        response.images
      );

      const newMessages = [...messages];
      newMessages[messageIndex] = updatedMessage;

      set({
        messages: newMessages,
        isLoading: false,
        currentIntent: response.intent
      });
    } catch (error) {
      console.error('重新生成失败:', error);
      set({ isLoading: false });
    }
  },

  // 更新设置
  updateSettings: (newSettings: Partial<UserSettings>) => {
    set({
      settings: { ...get().settings, ...newSettings }
    });
  },

  // 清空消息
  clearMessages: () => {
    const { currentSession } = get();
    if (currentSession) {
      set({ messages: [] });
      // 创建新会话
      get().initSession();
    }
  },

  // 添加示例问题
  addExampleQuestions: (questions: ExampleQuestion[]) => {
    set({ exampleQuestions: questions });
  }
}));
