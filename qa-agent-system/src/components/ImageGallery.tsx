import { useState } from 'react';
import { GeneratedImage } from '@/types';
import { 
  ZoomIn, 
  Download, 
  RefreshCw, 
  X,
  ImageIcon,
  Loader2
} from 'lucide-react';
import { regenerateImage } from '@/services/imageGeneration';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageUpdate?: (images: GeneratedImage[]) => void;
  isGenerating?: boolean;
}

export function ImageGallery({ images, onImageUpdate, isGenerating }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleRegenerate = async (image: GeneratedImage, index: number) => {
    setRegeneratingIds(prev => new Set(prev).add(image.id));
    
    try {
      const newImage = await regenerateImage(image, 'style');
      const newImages = [...images];
      newImages[index] = newImage;
      onImageUpdate?.(newImages);
    } catch (error) {
      console.error('重新生成图片失败:', error);
    } finally {
      setRegeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(image.id);
        return next;
      });
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载图片失败:', error);
    }
  };

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  if (images.length === 0 && !isGenerating) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">AI生成配图</span>
        {isGenerating && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            生成中...
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {images.map((image, index) => (
          <div 
            key={image.id}
            className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-200"
          >
            {/* 图片容器 */}
            <div className="aspect-square relative">
              {imageErrors.has(image.id) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">图片加载失败</span>
                  </div>
                </div>
              ) : (
                <img
                  src={image.url}
                  alt={image.alt || 'AI生成图片'}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(image.id)}
                  loading="lazy"
                />
              )}
              
              {/* 悬停操作栏 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button
                  onClick={() => setSelectedImage(image)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="查看大图"
                >
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDownload(image)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="下载图片"
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleRegenerate(image, index)}
                  disabled={regeneratingIds.has(image.id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                  title="重新生成"
                >
                  {regeneratingIds.has(image.id) ? (
                    <Loader2 className="w-4 h-4 text-gray-700 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </div>

              {/* 生成中遮罩 */}
              {regeneratingIds.has(image.id) && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            {/* 图片信息 */}
            <div className="p-2 bg-white">
              <p className="text-xs text-gray-500 truncate" title={image.prompt}>
                {image.alt || image.prompt.slice(0, 50)}...
              </p>
            </div>
          </div>
        ))}
        
        {/* 生成中占位 */}
        {isGenerating && images.length === 0 && (
          <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 border-dashed flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-500">AI正在生成配图...</span>
            </div>
          </div>
        )}
      </div>

      {/* 大图预览模态框 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt || 'AI生成图片'}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              <p className="text-white text-sm">{selectedImage.prompt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 简化版图片展示（用于消息列表）
export function ImageThumbnail({ 
  image, 
  onClick 
}: { 
  image: GeneratedImage; 
  onClick?: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
    >
      <img
        src={image.url}
        alt={image.alt || '缩略图'}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </button>
  );
}
