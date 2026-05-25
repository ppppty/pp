import { useState, type ReactNode } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  CircleCheckBig,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Image,
  Lightbulb,
  ListChecks,
  Lock,
  MessageSquare,
  Settings,
  UploadCloud,
  Wrench,
  X,
} from 'lucide-react';

type Role = 'business' | 'approval' | 'operation';
type MainTab = 'marketing' | 'progress';

interface Activity {
  id: string;
  name: string;
  level: 'S' | 'A' | 'B';
  owner: string;
  date: string;
  status: '待审批' | '待排期' | '待上线';
}

const activityRows: Activity[] = [
  { id: 'a1', name: '暑期亲子景区联动', level: 'S', owner: 'demo', date: '2026-06-01', status: '待审批' },
  { id: 'a2', name: '江浙沪周边游榜单', level: 'A', owner: 'lixiao', date: '2026-06-08', status: '待排期' },
  { id: 'a3', name: '夜游门票限时活动', level: 'B', owner: 'wangyi', date: '2026-06-15', status: '待上线' },
];

const processSteps = [
  { label: '活动提报', icon: FileText, bg: 'bg-blue-100', color: 'text-blue-600' },
  { label: '运营排期', icon: Calendar, bg: 'bg-green-100', color: 'text-green-600' },
  { label: '物料准备', icon: Image, bg: 'bg-pink-100', color: 'text-pink-600' },
  { label: '点位配置', icon: Settings, bg: 'bg-purple-100', color: 'text-purple-600' },
  { label: '活动上线', icon: CircleCheckBig, bg: 'bg-orange-100', color: 'text-orange-600' },
];

const materialCards = [
  { level: 'S级', title: 'S级活动物料模板', desc: '重大活动，全渠道推广', tag: 'bg-red-50 text-red-700 border-red-100' },
  { level: 'A级', title: 'A级活动物料模板', desc: '重点活动，多资源位支持', tag: 'bg-orange-50 text-orange-700 border-orange-100' },
  { level: 'B级', title: 'B级活动物料模板', desc: '常规活动，基础资源支持', tag: 'bg-green-50 text-green-700 border-green-100' },
];

export default function App() {
  const [role, setRole] = useState<Role>('business');
  const [tab, setTab] = useState<MainTab>('marketing');
  const [passwordFor, setPasswordFor] = useState<Role | null>(null);
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const requestRole = (nextRole: Role) => {
    if (nextRole === 'business') {
      setRole('business');
      setTab('marketing');
      return;
    }
    setPasswordFor(nextRole);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#101828]">
      <header className="bg-[#1A2B4A] shadow-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-[18px] font-bold tracking-wide text-white">点评景点营销平台</h1>
            <button
              onClick={() => setToolboxOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Wrench className="h-3.5 w-3.5" />
              运营工具箱
            </button>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1">
            {[
              ['business', '业务侧'],
              ['approval', '审批侧'],
              ['operation', '运营侧'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => requestRole(key as Role)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  role === key ? 'bg-white text-[#1A2B4A] shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="mb-4 rounded-lg border border-gray-100 bg-white px-6 shadow-sm">
          <nav className="flex gap-6">
            <TopTab active={tab === 'marketing'} icon={<FileText className="h-4 w-4" />} onClick={() => setTab('marketing')}>
              营销活动
            </TopTab>
            <TopTab active={tab === 'progress'} icon={<Clock className="h-4 w-4" />} onClick={() => setTab('progress')}>
              活动进展
            </TopTab>
          </nav>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          {role === 'business' && tab === 'marketing' && <BusinessMarketing onSubmit={() => setSubmitOpen(true)} />}
          {role === 'business' && tab === 'progress' && <ProgressView activities={[]} />}
          {role === 'approval' && <ApprovalView />}
          {role === 'operation' && <OperationView />}
        </div>
      </div>

      <button
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#1A2B4A] px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:scale-105"
      >
        <MessageSquare className="h-4 w-4" />
        意见反馈
      </button>

      {passwordFor && (
        <PasswordDialog
          title={passwordFor === 'approval' ? '进入审批侧' : '进入运营侧'}
          onClose={() => setPasswordFor(null)}
          onSuccess={() => {
            setRole(passwordFor);
            setTab('progress');
            setPasswordFor(null);
          }}
        />
      )}
      {toolboxOpen && <ToolboxDialog onClose={() => setToolboxOpen(false)} />}
      {submitOpen && <SubmitDialog onClose={() => setSubmitOpen(false)} />}
      {feedbackOpen && <FeedbackDialog onClose={() => setFeedbackOpen(false)} />}
    </div>
  );
}

function TopTab({ active, icon, children, onClick }: { active: boolean; icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 py-3.5 text-sm font-medium transition-colors ${
        active ? 'border-[#1A2B4A] text-[#1A2B4A]' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function BusinessMarketing({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-6">
      <Panel className="p-5 text-center">
        <a className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800">
          <FileText className="h-4 w-4" />
          点评资源位介绍
          <ExternalLink className="h-4 w-4" />
        </a>
      </Panel>

      <Panel className="p-6">
        <div className="mb-5 flex items-center justify-center">
          <Lightbulb className="mr-1.5 h-4 w-4 text-yellow-500" />
          <h3 className="text-[14px] font-semibold text-gray-700">景点营销活动全流程</h3>
        </div>
        <div className="flex w-full items-start">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="contents">
                <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                  <div className={`mb-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${step.bg} ${step.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="whitespace-nowrap text-[11px] font-semibold leading-tight text-gray-800">{step.label}</span>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="flex w-4 shrink-0 justify-center pt-3 text-base font-light leading-none text-gray-300">›</div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel className="p-6 text-center">
        <h2 className="mb-5 text-[20px] font-bold text-gray-900">活动提报</h2>
        <div className="mb-4 flex flex-col items-center">
          <label className="mb-1 text-sm font-medium text-gray-700">您的 MIS 号</label>
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            <span className="text-sm text-green-700">
              已自动识别：<span className="font-semibold">demo</span>
            </span>
            <button className="ml-auto text-xs text-gray-400 hover:text-gray-600">更改</button>
          </div>
        </div>
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <FileText className="h-4 w-4" />
          开始提报
        </button>
      </Panel>

      <Panel className="p-6">
        <div className="mb-4 text-center">
          <h2 className="mb-1 text-[20px] font-bold text-gray-900">物料准备</h2>
          <p className="text-[14px] text-gray-500">请于活动开始前 T-2 日将物料提交运营审核</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {materialCards.map((card) => (
            <a key={card.level} className="block rounded-lg border border-gray-100 bg-gray-50 p-4 text-center transition-shadow hover:bg-white hover:shadow-sm">
              <span className={`mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${card.tag}`}>
                {card.level}
              </span>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">{card.title}</h3>
              <p className="text-xs text-gray-500">{card.desc}</p>
            </a>
          ))}
        </div>
      </Panel>

      <Panel className="p-6 text-center">
        <h2 className="mb-1 text-[20px] font-bold text-gray-900">点位配置</h2>
        <p className="mb-4 text-[14px] text-gray-500">
          运营审核物料通过后，
          <br />
          业务方自行完成资源位配置
        </p>
        <a className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
          <Settings className="h-4 w-4" />
          资源位配置模板及SOP
          <ExternalLink className="h-4 w-4" />
        </a>
      </Panel>

      <Panel className="p-6 text-center">
        <h2 className="mb-1 text-[20px] font-bold text-gray-900">活动上线</h2>
        <div className="mb-3 mt-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
          <CircleCheckBig className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-[14px] text-gray-500">完成资源位配置并提审后，由运营侧确认上线</p>
      </Panel>
    </div>
  );
}

function ProgressView({ activities }: { activities: Activity[] }) {
  return (
    <div className="px-6 py-8">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-[20px] font-bold text-gray-900">活动进展</h2>
        <p className="text-[14px] text-gray-500">查看您的活动当前状态和进度</p>
      </div>
      <div className="mx-auto mb-6 grid max-w-2xl grid-cols-3 gap-4">
        {['待审批', '待排期', '待上线'].map((status) => (
          <div key={status} className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
            <div className="mb-1 text-[22px] font-bold text-[#1A2B4A]">
              {activities.filter((item) => item.status === status).length}
            </div>
            <p className="text-xs text-gray-500">{status}</p>
          </div>
        ))}
      </div>
      {activities.length === 0 ? (
        <div className="py-12 text-center text-gray-400">暂无活动</div>
      ) : (
        <ActivityTable rows={activities} />
      )}
    </div>
  );
}

function ApprovalView() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">审批侧工作台</h2>
          <p className="text-[14px] text-gray-500">审核业务提报并流转至运营排期</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">已登录</span>
      </div>
      <ActivityTable rows={activityRows.filter((row) => row.status === '待审批')} />
    </div>
  );
}

function OperationView() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">运营侧工作台</h2>
          <p className="text-[14px] text-gray-500">管理排期、物料审核和活动上线确认</p>
        </div>
        <button className="rounded-lg bg-[#1A2B4A] px-4 py-2 text-sm font-medium text-white">新建排期</button>
      </div>
      <ActivityTable rows={activityRows} />
    </div>
  );
}

function ActivityTable({ rows }: { rows: Activity[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
          <tr>
            <th className="px-4 py-3">活动名称</th>
            <th className="px-4 py-3">等级</th>
            <th className="px-4 py-3">负责人</th>
            <th className="px-4 py-3">上线日期</th>
            <th className="px-4 py-3">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/70">
              <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">{row.level}级</span>
              </td>
              <td className="px-4 py-3 text-gray-500">{row.owner}</td>
              <td className="px-4 py-3 text-gray-500">{row.date}</td>
              <td className="px-4 py-3 text-gray-500">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-gray-100 bg-white shadow-sm ${className}`}>{children}</section>;
}

function PasswordDialog({ title, onClose, onSuccess }: { title: string; onClose: () => void; onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  return (
    <Modal onClose={onClose}>
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onSubmit={(event) => {
          event.preventDefault();
          if (password === '123') onSuccess();
          else setError('密码错误');
        }}
      >
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <Lock className="h-4 w-4 text-[#1A2B4A]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">请输入访问密码</p>
        <div className="relative mb-2">
          <input
            autoFocus
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#1A2B4A]"
          />
          <button type="button" onClick={() => setShow((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            取消
          </button>
          <button className="flex-1 rounded-lg bg-[#1A2B4A] px-4 py-2.5 text-sm font-medium text-white">确认</button>
        </div>
      </form>
    </Modal>
  );
}

function ToolboxDialog({ onClose }: { onClose: () => void }) {
  const items = [
    ['资源位排期', Calendar],
    ['提报审批', ListChecks],
    ['数据看板', BarChart3],
    ['物料归档', UploadCloud],
  ] as const;
  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <DialogTitle title="运营工具箱" onClose={onClose} />
        <div className="grid grid-cols-2 gap-3">
          {items.map(([label, Icon]) => (
            <button key={label} className="rounded-xl border border-gray-100 p-4 text-left transition-colors hover:border-blue-200 hover:bg-blue-50">
              <Icon className="mb-3 h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function SubmitDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <DialogTitle title="活动提报" onClose={onClose} />
        <div className="space-y-4">
          <input className="field" placeholder="活动名称" />
          <div className="grid grid-cols-2 gap-3">
            <select className="field" defaultValue="S">
              <option value="S">S级活动</option>
              <option value="A">A级活动</option>
              <option value="B">B级活动</option>
            </select>
            <input className="field" type="date" />
          </div>
          <textarea className="field min-h-24 resize-none" placeholder="活动背景、资源位诉求、目标城市等" />
          <button onClick={onClose} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            提交
          </button>
        </div>
      </div>
    </Modal>
  );
}

function FeedbackDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <DialogTitle title="意见反馈" onClose={onClose} />
        <textarea className="field min-h-28 resize-none" placeholder="请输入问题或建议" />
        <button onClick={onClose} className="mt-4 w-full rounded-lg bg-[#1A2B4A] px-4 py-2.5 text-sm font-medium text-white">
          提交反馈
        </button>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onMouseDown={onClose}>
      <div onMouseDown={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
}

function DialogTitle({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
