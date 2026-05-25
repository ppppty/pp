import { Pencil, Trash2 } from 'lucide-react';
import { Schedule } from '../../types';

interface Props {
  schedule: Schedule;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const colorMap: Record<string, string> = {
  '顶通': 'bg-orange-100 border-orange-300 text-orange-800',
  '中通': 'bg-blue-100 border-blue-300 text-blue-800',
  '弹窗': 'bg-purple-100 border-purple-300 text-purple-800',
  '侧边栏': 'bg-green-100 border-green-300 text-green-800',
};

export default function ScheduleCard({ schedule, isAdmin, onEdit, onDelete }: Props) {
  return (
    <div className={`relative group rounded-lg border px-3 py-2 text-xs ${colorMap[schedule.slotType] || colorMap['顶通']}`}>
      <div className="font-semibold truncate">{schedule.activityName}</div>
      <div className="text-gray-500 mt-0.5">{schedule.region}</div>
      <div className="text-gray-400 text-[10px] mt-0.5">
        {schedule.startDate} ~ {schedule.endDate}
      </div>
      {schedule.remark && (
        <div className="text-gray-500 text-[10px] mt-0.5 truncate">{schedule.remark}</div>
      )}
      {isAdmin && (
        <div className="absolute top-0 right-0 hidden group-hover:flex gap-0.5 p-1">
          <button onClick={onEdit} className="p-0.5 rounded bg-white/80 hover:bg-white shadow-sm">
            <Pencil size={12} className="text-gray-600" />
          </button>
          <button onClick={onDelete} className="p-0.5 rounded bg-white/80 hover:bg-white shadow-sm">
            <Trash2 size={12} className="text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
