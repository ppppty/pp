import { useState } from 'react';
import { startOfWeek } from 'date-fns';
import { useStore } from '../../store/useStore';
import { Schedule } from '../../types';
import { toast } from '../ui/Toast';
import SlotTypeTabs from './SlotTypeTabs';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import ScheduleForm from './ScheduleForm';

export default function CalendarView() {
  const { schedules, activeSlot, isAdmin, setActiveSlot, addSchedule, updateSchedule, deleteSchedule } = useStore();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);

  const handleSave = (s: Schedule) => {
    if (editing) {
      updateSchedule(s);
      toast('排期已更新');
    } else {
      addSchedule(s);
      toast('排期已添加');
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleEdit = (s: Schedule) => {
    setEditing(s);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个排期吗？')) {
      deleteSchedule(id);
      toast('排期已删除');
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div>
      <SlotTypeTabs active={activeSlot} onChange={setActiveSlot} />
      <div className="mt-4">
        <CalendarHeader
          weekStart={weekStart}
          onPrevWeek={() => setWeekStart((d) => new Date(d.getTime() - 7 * 86400000))}
          onNextWeek={() => setWeekStart((d) => new Date(d.getTime() + 7 * 86400000))}
          onAdd={handleAdd}
          isAdmin={isAdmin}
        />
        <CalendarGrid
          weekStart={weekStart}
          activeSlot={activeSlot}
          schedules={schedules}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <ScheduleForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={handleSave}
        schedule={editing}
      />
    </div>
  );
}
