import { useState } from 'react';
import { Check, X, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { Submission } from '../../types';
import Badge from '../ui/Badge';

interface Props {
  submission: Submission;
  selected: boolean;
  onToggle: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  showCheckbox: boolean;
}

const statusVariant: Record<string, 'default' | 'success' | 'error'> = {
  '待审核': 'default',
  '已通过': 'success',
  '已拒绝': 'error',
};

const statusLabel: Record<string, string> = {
  '待审核': '待审',
  '已通过': '已通过',
  '已拒绝': '已拒绝',
};

export default function ReviewCard({ submission, selected, onToggle, onApprove, onReject, showCheckbox }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleReject = () => {
    onReject(submission.id, reason);
    setRejectOpen(false);
    setReason('');
  };

  return (
    <div className={`bg-white rounded-lg border transition-colors ${selected ? 'border-brand-300 bg-brand-50/30' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggle}
              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm truncate">{submission.name}</span>
              <Badge variant={statusVariant[submission.status]}>{statusLabel[submission.status]}</Badge>
            </div>
            <div className="flex gap-3 mt-1 text-xs text-gray-500">
              <span>提报人：{submission.misId}</span>
              <span>{submission.createdAt}</span>
              <span>{submission.positions.map((p) => `${p.slotType}（${p.region}）`).join('、')}</span>
            </div>
          </div>
          {submission.status === '待审核' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onApprove(submission.id)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
              >
                <Check size={14} /> 通过
              </button>
              <button
                onClick={() => setRejectOpen(!rejectOpen)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <X size={14} /> 拒绝
              </button>
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">{submission.description || '暂无说明'}</p>
            {submission.status === '已拒绝' && submission.rejectReason && (
              <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                拒绝原因：{submission.rejectReason}
              </div>
            )}
          </div>
        )}

        {rejectOpen && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入拒绝原因（可留空）"
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              onClick={handleReject}
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              确认拒绝
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
