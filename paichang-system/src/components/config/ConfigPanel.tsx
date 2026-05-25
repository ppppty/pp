import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { SlotType } from '../../types';
import { toast } from '../ui/Toast';
import { Save, ExternalLink } from 'lucide-react';

const slotTypes: SlotType[] = ['顶通', '中通', '弹窗', '侧边栏'];

export default function ConfigPanel() {
  const { configs, updateConfig } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ configUrl: '', sopUrl: '' });

  const startEdit = (type: SlotType) => {
    const c = configs.find((x) => x.type === type)!;
    setForm({ configUrl: c.configUrl, sopUrl: c.sopUrl });
    setEditing(type);
  };

  const handleSave = (type: SlotType) => {
    updateConfig({ type, ...form });
    toast('配置已更新');
    setEditing(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">配置管理</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slotTypes.map((type) => {
          const config = configs.find((x) => x.type === type)!;
          const isEditing = editing === type;

          return (
            <div key={type} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">{type}配置</h3>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">配置地址</label>
                    <input
                      value={form.configUrl}
                      onChange={(e) => setForm({ ...form, configUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">SOP 文档</label>
                    <input
                      value={form.sopUrl}
                      onChange={(e) => setForm({ ...form, sopUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(type)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
                      <Save size={14} /> 保存
                    </button>
                    <button onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">配置地址</span>
                    <a href={config.configUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline flex items-center gap-1">
                      {config.configUrl.split('/').pop()} <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">SOP 文档</span>
                    <a href={config.sopUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline flex items-center gap-1">
                      SOP 文档 <ExternalLink size={12} />
                    </a>
                  </div>
                  <button
                    onClick={() => startEdit(type)}
                    className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    编辑
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
