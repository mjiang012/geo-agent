import { IntentType, IntentResult } from '@/types';
import { getDomainConfig } from '@/services/intentRecognition';
import { 
  UtensilsCrossed, 
  Microscope, 
  BookOpen, 
  Heart, 
  GitCompare,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface IntentBadgeProps {
  intent: IntentResult;
  showConfidence?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'UtensilsCrossed': UtensilsCrossed,
  'Microscope': Microscope,
  'BookOpen': BookOpen,
  'Heart': Heart,
  'GitCompare': GitCompare,
  'HelpCircle': HelpCircle
};

export function IntentBadge({ 
  intent, 
  showConfidence = true, 
  size = 'md',
  animated = false
}: IntentBadgeProps) {
  const config = getDomainConfig(intent.type);
  const IconComponent = config ? iconMap[config.icon] : HelpCircle;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // 根据置信度确定颜色深浅
  const getOpacity = () => {
    if (intent.confidence >= 0.9) return 'opacity-100';
    if (intent.confidence >= 0.7) return 'opacity-90';
    return 'opacity-75';
  };

  return (
    <div 
      className={`
        inline-flex items-center rounded-full font-medium
        transition-all duration-300
        ${sizeClasses[size]}
        ${getOpacity()}
        ${animated ? 'animate-in fade-in slide-in-from-left-2' : ''}
      `}
      style={{
        backgroundColor: config?.bgColor || '#F3F4F6',
        color: config?.color || '#6B7280'
      }}
    >
      <IconComponent className={iconSizes[size]} />
      <span>{config?.name || '未知'}</span>
      {showConfidence && (
        <span className="opacity-75">
          ({Math.round(intent.confidence * 100)}%)
        </span>
      )}
      {intent.subType && (
        <span className="opacity-60 text-xs">
          · {intent.subType}
        </span>
      )}
    </div>
  );
}

// 意图识别中加载状态
export function IntentLoadingBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <div 
      className={`
        inline-flex items-center gap-1.5 rounded-full
        bg-gray-100 text-gray-500
        ${sizeClasses[size]}
      `}
    >
      <Sparkles className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} animate-pulse`} />
      <span>识别意图中...</span>
    </div>
  );
}

// 置信度指示器
export function ConfidenceIndicator({ confidence }: { confidence: number }) {
  const getColor = () => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.7) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">
        {Math.round(confidence * 100)}%
      </span>
    </div>
  );
}
