import { useState, type ReactNode } from 'react';
import {
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
  Users,
  Wrench,
  X,
} from 'lucide-react';

type Role = 'business' | 'approval' | 'operation';
type BusinessTab = 'marketing' | 'progress';
type ApprovalTab = 'assign' | 'calendar';
type OperationTab = 'queue' | 'manage';
type ActivityStatus = '待审批' | '待排期' | '待上线' | '已上线';

interface Activity {
  id: string;
  title: string;
  level: 'S' | 'A' | 'B';
  category: string;
  city: string;
  submitter: string;
  operator: string;
  startDate: string;
  endDate: string;
  status: ActivityStatus;
  resource: string;
}

const activities: Activity[] = [
  {
    id: 'A-2026-0618',
    title: '暑期亲子景区联动',
    level: 'S',
    category: '七节两月',
    city: '全国',
    submitter: '业务方A',
    operator: '运营A',
    startDate: '2026-06-18',
    endDate: '2026-06-30',
    status: '待审批',
    resource: '顶通 + 中通',
  },
  {
    id: 'A-2026-0701',
    title: '江浙沪周边游榜单',
    level: 'A',
    category: '超级大牌',
    city: '上海/杭州/苏州',
    submitter: '业务方B',
    operator: '运营B',
    startDate: '2026-07-01',
    endDate: '2026-07-10',
    status: '待排期',
    resource: '侧边栏',
  },
  {
    id: 'A-2026-0715',
    title: '夜游门票限时活动',
    level: 'B',
    category: '日常长促',
    city: '广州/深圳',
    submitter: '业务方C',
    operator: '运营C',
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    status: '待上线',
    resource: '弹窗',
  },
  {
    id: 'A-2026-0801',
    title: '避暑山水目的地专题',
    level: 'A',
    category: '暑期专题',
    city: '成都/贵阳/昆明',
    submitter: '业务方D',
    operator: '运营A',
    startDate: '2026-08-01',
    endDate: '2026-08-12',
    status: '已上线',
    resource: '中通',
  },
];

const operators = [
  { name: '运营A', tag: '七节两月', color: 'bg-blue-50 text-blue-600', queue: activities.filter((item) => item.operator === '运营A' && item.status === '待排期') },
  { name: '运营B', tag: '超级大牌', color: 'bg-violet-50 text-violet-600', queue: activities.filter((item) => item.operator === '运营B' && item.status === '待排期') },
  { name: '运营C', tag: '日常长促', color: 'bg-emerald-50 text-emerald-600', queue: activities.filter((item) => item.operator === '运营C' && item.status === '待排期') },
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
  const [businessTab, setBusinessTab] = useState<BusinessTab>('marketing');
  const [approvalTab, setApprovalTab] = useState<ApprovalTab>('assign');
  const [operationTab, setOperationTab] = useState<OperationTab>('queue');
  const [passwordFor, setPasswordFor] = useState<Role | null>(null);
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const requestRole = (nextRole: Role) => {
    if (nextRole === 'business') {
      setRole('business');
      return;
    }
    setPasswordFor(nextRole);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#101828]">
      <header className="bg-[#1A2B4A] shadow-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="shrink-0 whitespace-nowrap text-[18px] font-bold tracking-wide text-white sm:text-[22px]">点评景点营销平台</h1>
            <button
              onClick={() => setToolboxOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">运营工具箱</span>
            </button>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-white/10 p-1">
            {[
              ['business', '业务侧'],
              ['approval', '审批侧'],
              ['operation', '运营侧'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => requestRole(key as Role)}
                className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:px-4 sm:text-base ${
                  role === key ? 'bg-white text-[#1A2B4A] shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-5">
        <RoleTabs
          role={role}
          businessTab={businessTab}
          approvalTab={approvalTab}
          operationTab={operationTab}
          setBusinessTab={setBusinessTab}
          setApprovalTab={setApprovalTab}
          setOperationTab={setOperationTab}
        />

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {role === 'business' && businessTab === 'marketing' && <BusinessMarketing onSubmit={() => setSubmitOpen(true)} />}
          {role === 'business' && businessTab === 'progress' && <BusinessProgress />}
          {role === 'approval' && approvalTab === 'assign' && <ApprovalAssign />}
          {role === 'approval' && approvalTab === 'calendar' && <ApprovalCalendar />}
          {role === 'operation' && operationTab === 'queue' && <OperationQueue />}
          {role === 'operation' && operationTab === 'manage' && <OperationManage />}
        </div>
      </div>

      <button
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#1A2B4A] px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 sm:text-lg"
      >
        <MessageSquare className="h-5 w-5" />
        意见反馈
      </button>

      {passwordFor && (
        <PasswordDialog
          title={passwordFor === 'approval' ? '进入审批侧' : '进入运营侧'}
          onClose={() => setPasswordFor(null)}
          onSuccess={() => {
            setRole(passwordFor);
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

function RoleTabs({
  role,
  businessTab,
  approvalTab,
  operationTab,
  setBusinessTab,
  setApprovalTab,
  setOperationTab,
}: {
  role: Role;
  businessTab: BusinessTab;
  approvalTab: ApprovalTab;
  operationTab: OperationTab;
  setBusinessTab: (tab: BusinessTab) => void;
  setApprovalTab: (tab: ApprovalTab) => void;
  setOperationTab: (tab: OperationTab) => void;
}) {
  return (
    <div className="mb-5 rounded-xl border border-gray-100 bg-white px-5 shadow-sm">
      <nav className="flex gap-5">
        {role === 'business' && (
          <>
            <TopTab active={businessTab === 'marketing'} icon={<FileText className="h-5 w-5" />} onClick={() => setBusinessTab('marketing')}>
              营销活动
            </TopTab>
            <TopTab active={businessTab === 'progress'} icon={<Clock className="h-5 w-5" />} onClick={() => setBusinessTab('progress')}>
              活动进展
            </TopTab>
          </>
        )}
        {role === 'approval' && (
          <>
            <TopTab active={approvalTab === 'assign'} icon={<Users className="h-6 w-6" />} onClick={() => setApprovalTab('assign')}>
              审批分配
            </TopTab>
            <TopTab active={approvalTab === 'calendar'} icon={<Calendar className="h-6 w-6" />} onClick={() => setApprovalTab('calendar')}>
              活动日历
            </TopTab>
          </>
        )}
        {role === 'operation' && (
          <>
            <TopTab active={operationTab === 'queue'} icon={<ListChecks className="h-6 w-6" />} onClick={() => setOperationTab('queue')}>
              待排期
            </TopTab>
            <TopTab active={operationTab === 'manage'} icon={<Settings className="h-6 w-6" />} onClick={() => setOperationTab('manage')}>
              活动管理
            </TopTab>
          </>
        )}
      </nav>
    </div>
  );
}

function TopTab({ active, icon, children, onClick }: { active: boolean; icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 py-3.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2B4A]/25 sm:text-lg ${
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
                {index < processSteps.length - 1 && <div className="flex w-4 shrink-0 justify-center pt-3 text-base font-light leading-none text-gray-300">›</div>}
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
        <button onClick={onSubmit} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
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
              <span className={`mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${card.tag}`}>{card.level}</span>
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

function BusinessProgress() {
  const mine = activities.filter((item) => item.submitter === '业务方A' || item.submitter === '业务方B');
  return (
    <Workspace title="活动进展" subtitle="查看您的活动当前状态和进度">
      <StatusSummary rows={mine} />
      <ActivityList rows={mine} />
    </Workspace>
  );
}

function ApprovalAssign() {
  const pending = activities.filter((item) => item.status === '待审批');
  return (
    <Workspace title="审批分配" subtitle="将业务方提报的活动分配给对应运营人员">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        {pending.map((item) => (
          <CaseCard key={item.id} item={item} action="分配给运营A" />
        ))}
      </div>
    </Workspace>
  );
}

function ApprovalCalendar() {
  return (
    <Workspace title="活动日历" subtitle="所有活动的状态总览">
      <StatusSummary rows={activities} />
      <ActivityList rows={activities} />
    </Workspace>
  );
}

function OperationQueue() {
  return (
    <Workspace title="待排期" subtitle="对已分配的活动进行定级和资源位确认">
      <div className="mx-auto w-full max-w-[1450px] space-y-10">
        {operators.map((operator) => (
          <OperatorBlock key={operator.name} operator={operator} mode="schedule" />
        ))}
      </div>
    </Workspace>
  );
}

function OperationManage() {
  return (
    <Workspace title="活动管理" subtitle="查看各运营负责的待上线活动">
      <div className="mx-auto w-full max-w-[1450px] space-y-10">
        {operators.map((operator) => (
          <OperatorBlock key={operator.name} operator={operator} mode="online" />
        ))}
      </div>
    </Workspace>
  );
}

function Workspace({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="px-5 py-8 sm:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-base text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function StatusSummary({ rows }: { rows: Activity[] }) {
  const statuses: ActivityStatus[] = ['待审批', '待排期', '待上线', '已上线'];
  return (
    <div className="mx-auto mb-6 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
      {statuses.map((status) => (
        <div key={status} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
          <div className="mb-1 text-2xl font-bold text-[#1A2B4A]">{rows.filter((item) => item.status === status).length}</div>
          <p className="text-sm text-gray-500">{status}</p>
        </div>
      ))}
    </div>
  );
}

function ActivityList({ rows }: { rows: Activity[] }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-4">
      {rows.map((item) => (
        <CaseCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function CaseCard({ item, action }: { item: Activity; action?: string }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">{item.level}级</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{item.category}</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {item.city} · {item.resource} · {item.startDate} - {item.endDate}
          </p>
        </div>
        {action ? (
          <button className="rounded-lg bg-[#1A2B4A] px-4 py-2 text-sm font-medium text-white">{action}</button>
        ) : (
          <span className="text-sm text-gray-400">负责人：{item.operator}</span>
        )}
      </div>
    </article>
  );
}

function OperatorBlock({ operator, mode }: { operator: (typeof operators)[number]; mode: 'schedule' | 'online' }) {
  const rows = mode === 'schedule'
    ? activities.filter((item) => item.operator === operator.name && item.status === '待排期')
    : activities.filter((item) => item.operator === operator.name && item.status === '待上线');

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={`grid h-11 w-11 place-items-center rounded-full ${operator.color}`}>
            <Users className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">{operator.name}</h3>
            <span className="text-base text-gray-400">{operator.tag}</span>
          </div>
        </div>
        <span className="text-base text-gray-400">{rows.length} 个{mode === 'schedule' ? '待排期' : '待上线'}</span>
      </div>
      <div className="space-y-3 px-6 py-6">
        {rows.length === 0 ? (
          <div className="py-8 text-center text-base text-gray-400">暂无{mode === 'schedule' ? '待排期' : '待上线'}活动</div>
        ) : (
          rows.map((item) => (
            <CaseCard key={item.id} item={item} action={mode === 'schedule' ? '确认排期' : '确认上线'} />
          ))
        )}
      </div>
    </section>
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
  const items = ['景点频道排期', '活动SOP', '资源位配置SOP', '人群圈选', '景频数据看板', 'SQL跑数', 'NEXT营销平台', '银河营销系统', 'AI生图'];
  return (
    <div className="fixed inset-0 z-[120] bg-white">
      <header className="flex h-24 items-center justify-between border-b border-gray-100 px-8">
        <div className="flex items-center gap-4">
          <Wrench className="h-9 w-9 text-[#1A2B4A]" />
          <h2 className="text-4xl font-bold text-gray-900">运营工具箱</h2>
          <p className="text-2xl text-gray-400">日常运营工具、文档和链接的统一入口</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-10 w-10" />
        </button>
      </header>
      <main className="px-8 py-14">
        <h3 className="text-4xl font-bold text-gray-900">运营工具箱</h3>
        <p className="mt-3 text-2xl text-gray-400">常用工具快速入口</p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item) => (
            <a key={item} className="flex h-24 items-center justify-between rounded-3xl border border-gray-100 px-8 text-2xl text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
              {item}
              <ExternalLink className="h-8 w-8 text-gray-300" />
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

function SubmitDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <DialogTitle title="活动提报" onClose={onClose} />
        <div className="space-y-4">
          <input className="field" placeholder="活动名称" defaultValue="暑期亲子景区联动" />
          <div className="grid grid-cols-2 gap-3">
            <select className="field" defaultValue="S">
              <option value="S">S级活动</option>
              <option value="A">A级活动</option>
              <option value="B">B级活动</option>
            </select>
            <input className="field" type="date" defaultValue="2026-06-18" />
          </div>
          <textarea className="field min-h-24 resize-none" defaultValue="申请顶通与中通资源，承接暑期亲子景区活动流量。" />
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
