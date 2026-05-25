import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Schedule, SlotType } from '../../types';
import { activityOptions, regionOptions } from '../../data/mockData';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (s: Schedule) => void;
  schedule?: Schedule | null;
}

const slotTypes: SlotType[] = ['顶通', '中通', '弹窗', '侧边栏'];

export default function ScheduleForm({ open, onClose, onSave, schedule }: Props) {
  const [form, setForm] = useState({
    activityName: '',
    slotType: '顶通' as SlotType,
    region: '全国',
    startDate: '',
    endDate: '',
    remark: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (schedule) {
      setForm({
        activityName: schedule.activityName,
        slotType: schedule.slotType,
        region: schedule.region,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        remark: schedule.remark,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setForm({ activityName: '', slotType: '顶通', region: '全国', startDate: today, endDate: today, remark: '' });
    }
    setErrors({});
  }, [schedule, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.activityName.trim()) errs.activityName = '请输入活动名称';
    if (!form.startDate) errs.startDate = '请选择开始日期';
    if (!form.endDate) errs.endDate = '请选择结束日期';
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      errs.endDate = '开始日期不能晚于结束日期';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      id: schedule?.id || `sch-${Date.now()}`,
      ...form,
      createdAt: schedule?.createdAt || new Date().toISOString().split('T')[0],
    });
  };

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={schedule ? '编辑排期' : '新增排期'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">资源位类型</label>
          <div className="flex gap-2">
            {slotTypes.map((t) => (
              <button
                key={t}
                onClick={() => set('slotType', t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  form.slotType === t ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
          <input
            list="activity-list"
            value={form.activityName}
            onChange={(e) => set('activityName', e.target.value)}
            placeholder="如：上海迪士尼乐园"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.activityName ? 'border-red-300' : 'border-gray-200'}`}
          />
          <datalist id="activity-list">
            {activityOptions.map((a) => <option key={a} value={a} />)}
          </datalist>
          {errors.activityName && <p className="text-red-500 text-xs mt-1">{errors.activityName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">投放地区</label>
          <select
            value={form.region}
            onChange={(e) => set('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.startDate ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.endDate ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            value={form.remark}
            onChange={(e) => set('remark', e.target.value)}
            placeholder="可选填写备注信息"
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            取消
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors">
            保存
          </button>
        </div>
      </div>
    </Modal>
  );
}
