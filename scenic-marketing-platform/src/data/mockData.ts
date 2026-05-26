import { Schedule, Submission, SlotConfig } from '../types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return fmt(d);
};

export const defaultSchedules: Schedule[] = [
  {
    id: 's1',
    activityName: '上海迪士尼乐园',
    slotType: '顶通',
    region: '全国',
    startDate: day(-3),
    endDate: day(4),
    remark: '暑期特别活动推广',
    createdAt: day(-7),
  },
  {
    id: 's2',
    activityName: '北京环球影城',
    slotType: '顶通',
    region: '京津冀',
    startDate: day(5),
    endDate: day(12),
    remark: '哈利波特主题区开放',
    createdAt: day(-5),
  },
  {
    id: 's3',
    activityName: '广州长隆欢乐世界',
    slotType: '中通',
    region: '广东',
    startDate: day(-1),
    endDate: day(6),
    remark: '夏日水上乐园活动',
    createdAt: day(-4),
  },
  {
    id: 's4',
    activityName: '三亚亚龙湾',
    slotType: '弹窗',
    region: '全国',
    startDate: day(0),
    endDate: day(3),
    remark: '海岛度假特惠',
    createdAt: day(-2),
  },
  {
    id: 's5',
    activityName: '成都大熊猫繁育研究基地',
    slotType: '侧边栏',
    region: '川渝',
    startDate: day(-5),
    endDate: day(2),
    remark: '',
    createdAt: day(-10),
  },
  {
    id: 's6',
    activityName: '西安兵马俑',
    slotType: '中通',
    region: '陕西',
    startDate: day(7),
    endDate: day(14),
    remark: '文化遗产特展',
    createdAt: day(-1),
  },
  {
    id: 's7',
    activityName: '杭州西湖风景区',
    slotType: '侧边栏',
    region: '江浙沪',
    startDate: day(2),
    endDate: day(9),
    remark: '春季赏花季',
    createdAt: day(-3),
  },
  {
    id: 's8',
    activityName: '深圳欢乐谷',
    slotType: '弹窗',
    region: '广东',
    startDate: day(-2),
    endDate: day(5),
    remark: '万圣节主题活动',
    createdAt: day(-6),
  },
];

export const defaultSubmissions: Submission[] = [
  {
    id: 'sub1',
    name: '张家界天门山推广',
    misId: 'zhangsan',
    description: '推广张家界天门山景区，配合暑期旅游旺季',
    positions: [{ slotType: '顶通', region: '全国' }],
    status: '待审核',
    createdAt: day(-2),
  },
  {
    id: 'sub2',
    name: '桂林漓江漂流季',
    misId: 'lisi',
    description: '漓江漂流旺季推广，主要针对华南地区',
    positions: [
      { slotType: '中通', region: '广东' },
      { slotType: '弹窗', region: '广西' },
    ],
    status: '待审核',
    createdAt: day(-1),
  },
  {
    id: 'sub3',
    name: '拉萨布达拉宫文化周',
    misId: 'wangwu',
    description: '布达拉宫文化遗产展示推广',
    positions: [{ slotType: '顶通', region: '全国' }],
    status: '已通过',
    createdAt: day(-5),
    scheduleId: 's1',
  },
  {
    id: 'sub4',
    name: '云南丽江古城音乐节',
    misId: 'zhaoliu',
    description: '丽江古城户外音乐节活动推广',
    positions: [
      { slotType: '弹窗', region: '云南' },
      { slotType: '侧边栏', region: '全国' },
    ],
    status: '已拒绝',
    rejectReason: '排期已满，建议改期',
    createdAt: day(-4),
  },
];

export const defaultConfigs: SlotConfig[] = [
  { type: '顶通', configUrl: 'https://admin.example.com/config/top-banner', sopUrl: 'https://wiki.example.com/sop/top-banner' },
  { type: '中通', configUrl: 'https://admin.example.com/config/mid-banner', sopUrl: 'https://wiki.example.com/sop/mid-banner' },
  { type: '弹窗', configUrl: 'https://admin.example.com/config/popup', sopUrl: 'https://wiki.example.com/sop/popup' },
  { type: '侧边栏', configUrl: 'https://admin.example.com/config/sidebar', sopUrl: 'https://wiki.example.com/sop/sidebar' },
];

export const adminPassword = 'admin123';

export const activityOptions = [
  '上海迪士尼乐园',
  '北京环球影城',
  '广州长隆欢乐世界',
  '深圳欢乐谷',
  '杭州西湖风景区',
  '成都大熊猫繁育研究基地',
  '西安兵马俑',
  '三亚亚龙湾',
  '张家界天门山',
  '桂林漓江',
  '拉萨布达拉宫',
  '云南丽江古城',
  '苏州园林',
  '黄山风景区',
  '厦门鼓浪屿',
];

export const regionOptions = [
  '全国',
  '京津冀',
  '江浙沪',
  '广东',
  '川渝',
  '陕西',
  '云南',
  '广西',
  '海南',
];
