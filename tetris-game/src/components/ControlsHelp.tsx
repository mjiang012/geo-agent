import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space } from 'lucide-react';

export function ControlsHelp() {
  return (
    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
      <h3 className="text-white/80 text-sm font-semibold mb-3 text-center">操作说明</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 text-white/70">
          <div className="flex gap-0.5">
            <ArrowLeft className="w-4 h-4" />
            <ArrowRight className="w-4 h-4" />
          </div>
          <span>左右移动</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <ArrowUp className="w-4 h-4" />
          <span>旋转</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <ArrowDown className="w-4 h-4" />
          <span>加速下落</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Space className="w-4 h-4" />
          <span>快速下落</span>
        </div>
      </div>
    </div>
  );
}
