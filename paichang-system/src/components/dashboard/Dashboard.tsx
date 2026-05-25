import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Calendar, CheckCircle, Clock, BarChart3, Activity, Layers } from 'lucide-react';

export default function Dashboard() {
  const { schedules, submissions } = useStore();

  const stats = useMemo(() => {
    const now = new Date().toISOString().split('T')[0].substring(0, 7);
    const monthSchedules = schedules.filter((s) => s.createdAt.startsWith(now));
    const pending = submissions.filter((s) => s.status === '待审核').length;
    const byType = schedules.reduce<Record<string, number>>((acc, s) => {
      acc[s.slotType] = (acc[s.slotType] || 0) + 1;
      return acc;
    }, {});

    return {
      total: schedules.length,
      monthTotal: monthSchedules.length,
      pending,
      byType,
    };
  }, [schedules, submissions]);

  const cards = [
    { label: '总排期数', value: stats.total, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '本月排期', value: stats.monthTotal, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '待审核提报', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '资源位使用', value: Object.values(stats.byType).reduce((a, b) => a + b, 0), icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50', subtitle: '总使用次数' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">数据看板</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <c.icon size={20} className={c.color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{c.value}</div>
                <div className="text-xs text-gray-500">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-gray-400" />
          各资源位排期分布
        </h3>
        <div className="space-y-3">
          {['顶通', '中通', '弹窗', '侧边栏'].map((type) => {
            const count = stats.byType[type] || 0;
            const max = Math.max(...Object.values(stats.byType), 1);
            const pct = Math.round((count / max) * 100);
            return (
              <div key={type} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-16">{type}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5">
                  <div
                    className="bg-brand-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${pct}%` }}
                  >
                    <span className="text-xs text-white font-medium">{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
