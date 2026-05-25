import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Schedule, SlotType } from '../../types';
import ScheduleCard from './ScheduleCard';

interface Props {
  weekStart: Date;
  activeSlot: SlotType;
  schedules: Schedule[];
  isAdmin: boolean;
  onEdit: (s: Schedule) => void;
  onDelete: (id: string) => void;
}

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function CalendarGrid({ weekStart, activeSlot, schedules, isAdmin, onEdit, onDelete }: Props) {
  const filtered = schedules.filter((s) => s.slotType === activeSlot);

  const getSchedulesForDate = (date: Date) =>
    filtered.filter((s) => {
      const d = format(date, 'yyyy-MM-dd');
      return s.startDate <= d && s.endDate >= d;
    });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {days.map((d, i) => (
          <div key={i} className="p-3 text-center border-r border-gray-100 last:border-r-0">
            <div className="text-xs text-gray-400">{weekDays[i]}</div>
            <div className={`text-lg font-semibold mt-0.5 ${format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-brand-600' : 'text-gray-700'}`}>
              {format(d, 'd')}
            </div>
          </div>
        ))}
      </div>
      {/* Resource slot row */}
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const daySchedules = getSchedulesForDate(d);
          return (
            <div key={i} className="min-h-[140px] p-2 border-r border-gray-100 last:border-r-0">
              {daySchedules.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-gray-300">
                  当天暂无排期
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {daySchedules.map((s) => (
                    <ScheduleCard
                      key={s.id}
                      schedule={s}
                      isAdmin={isAdmin}
                      onEdit={() => onEdit(s)}
                      onDelete={() => onDelete(s.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
