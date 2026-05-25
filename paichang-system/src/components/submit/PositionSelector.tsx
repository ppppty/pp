import { Plus, X } from 'lucide-react';
import { Position, SlotType } from '../../types';
import { regionOptions } from '../../data/mockData';

interface Props {
  positions: Position[];
  onChange: (positions: Position[]) => void;
}

const slotTypes: SlotType[] = ['顶通', '中通', '弹窗', '侧边栏'];

export default function PositionSelector({ positions, onChange }: Props) {
  const addPosition = () => {
    onChange([...positions, { slotType: '顶通', region: '全国' }]);
  };

  const updatePosition = (index: number, field: keyof Position, value: string) => {
    const updated = positions.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    onChange(updated);
  };

  const removePosition = (index: number) => {
    onChange(positions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {positions.map((pos, i) => (
        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-400 w-6">点位{i + 1}</span>
          <select
            value={pos.slotType}
            onChange={(e) => updatePosition(i, 'slotType', e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {slotTypes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={pos.region}
            onChange={(e) => updatePosition(i, 'region', e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {positions.length > 1 && (
            <button onClick={() => removePosition(i)} className="p-1 text-gray-400 hover:text-red-500">
              <X size={16} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addPosition}
        className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        <Plus size={16} />
        添加点位
      </button>
    </div>
  );
}
