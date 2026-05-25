import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Props {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAdd: () => void;
  isAdmin: boolean;
}

export default function CalendarHeader({ weekStart, onPrevWeek, onNextWeek, onAdd, isAdmin }: Props) {
  const weekEnd = addDays(weekStart, 6);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900">排期日历</h2>
        <div className="flex items-center gap-1">
          <button onClick={onPrevWeek} className="p-1 rounded hover:bg-gray-100">
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <span className="text-sm text-gray-600 min-w-[180px] text-center">
            {format(weekStart, 'M月d日', { locale: zhCN })} - {format(weekEnd, 'M月d日', { locale: zhCN })}
          </span>
          <button onClick={onNextWeek} className="p-1 rounded hover:bg-gray-100">
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        </div>
      </div>
      {isAdmin && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          添加排期
        </button>
      )}
    </div>
  );
}
