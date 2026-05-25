import { SlotType } from '../../types';

const slots: SlotType[] = ['顶通', '中通', '弹窗', '侧边栏'];

interface Props {
  active: SlotType;
  onChange: (t: SlotType) => void;
}

export default function SlotTypeTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {slots.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            active === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
