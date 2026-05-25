import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';
import { SubmitStatus } from '../../types';
import Tabs from '../ui/Tabs';
import BatchActions from './BatchActions';
import ReviewCard from './ReviewCard';

const statusTabs = [
  { key: '待审核', label: '待审核' },
  { key: '已通过', label: '已通过' },
  { key: '已拒绝', label: '已拒绝' },
];

export default function ReviewList() {
  const { submissions, approveSubmission, rejectSubmission, batchApprove, batchReject } = useStore();
  const [activeStatus, setActiveStatus] = useState<SubmitStatus>('待审核');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () => submissions.filter((s) => s.status === activeStatus),
    [submissions, activeStatus]
  );

  const tabs = statusTabs.map((t) => ({
    ...t,
    count: submissions.filter((s) => s.status === t.key).length,
  }));

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleApprove = (id: string) => {
    approveSubmission(id);
    toast('已通过审核并写入排期');
  };

  const handleReject = (id: string, reason: string) => {
    rejectSubmission(id, reason);
    toast('已拒绝该提报');
  };

  const handleBatchApprove = () => {
    batchApprove(selected);
    toast(`已通过 ${selected.length} 条提报并写入排期`);
    setSelected([]);
  };

  const handleBatchReject = () => {
    batchReject(selected);
    toast(`已拒绝 ${selected.length} 条提报`);
    setSelected([]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">提报清单</h2>

      <Tabs tabs={tabs} active={activeStatus} onChange={(k) => { setActiveStatus(k as SubmitStatus); setSelected([]); }} />

      <div className="mt-4 space-y-3">
        {activeStatus === '待审核' && (
          <BatchActions
            selected={selected}
            total={filtered.length}
            onApproveAll={handleBatchApprove}
            onRejectAll={handleBatchReject}
          />
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            暂无提报记录
          </div>
        ) : (
          filtered.map((s) => (
            <ReviewCard
              key={s.id}
              submission={s}
              selected={selected.includes(s.id)}
              onToggle={() => toggleSelect(s.id)}
              onApprove={handleApprove}
              onReject={handleReject}
              showCheckbox={activeStatus === '待审核'}
            />
          ))
        )}
      </div>
    </div>
  );
}
