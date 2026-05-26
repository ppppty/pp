import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';
import { Position } from '../../types';
import PositionSelector from './PositionSelector';

export default function SubmitForm() {
  const navigate = useNavigate();
  const { addSubmission } = useStore();
  const [form, setForm] = useState({ name: '', misId: '', description: '' });
  const [positions, setPositions] = useState<Position[]>([{ slotType: '顶通', region: '全国' }]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!form.name.trim()) { toast('请输入排期名称', 'error'); return; }
    if (!form.misId.trim()) { toast('请输入提报人 MIS 号', 'error'); return; }
    setSubmitting(true);

    addSubmission({
      id: `sub-${Date.now()}`,
      name: form.name,
      misId: form.misId,
      description: form.description,
      positions,
      status: '待审核',
      createdAt: new Date().toISOString().split('T')[0],
    });

    setTimeout(() => {
      setSubmitting(false);
      toast('提报已提交，等待管理员审核后将加入排期日历');
      navigate('/');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">新建排期提报</h2>
        <p className="text-sm text-gray-500 mb-6">填写下方表单提交资源位申请，管理员审核通过后将自动写入排期</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排期名称 <span className="text-red-400">*</span></label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="请输入排期名称"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">提报人 MIS 号 <span className="text-red-400">*</span></label>
            <input
              value={form.misId}
              onChange={(e) => setForm({ ...form, misId: e.target.value })}
              placeholder="请输入您的 MIS 号"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排期说明</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="请简要描述排期内容和目标"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">申请点位</label>
            <PositionSelector positions={positions} onChange={setPositions} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => navigate('/')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? '提交中...' : '提交'}
          </button>
        </div>
      </div>
    </div>
  );
}
