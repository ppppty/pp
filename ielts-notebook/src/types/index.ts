// === 数据库表类型 ===

export interface SpeakingAnnotation {
  id: string
  selected_text: string
  comment: string
  created_at: string
}

export interface SpeakingQA {
  id: string
  part: 1 | 2 | 3
  season_label: '保留题' | '新题' | '预测题' | ''
  topic_tag: string
  question: string
  answer: string
  ai_answer: string
  mastery_level: number
  next_review_at: string | null
  annotations: SpeakingAnnotation[]
  created_at: string
  updated_at: string
}

export interface TopicMaterial {
  id: string
  title: string
  category: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export type ExpressionType = 'word' | 'phrase' | 'connector'

export interface Expression {
  id: string
  expr_type: ExpressionType
  term: string
  meaning: string
  example: string
  notes: string
  mastery_level: number
  next_review_at: string | null
  created_at: string
  updated_at: string
}

export interface Pronunciation {
  id: string
  word: string
  phonetic: string
  notes: string
  created_at: string
}

export interface QuickNote {
  id: string
  content: string
  category: string
  created_at: string
}

// === 插入类型（新建时没有 id 和时间戳） ===

export type SpeakingQAInsert = Pick<SpeakingQA, 'part' | 'topic_tag' | 'question' | 'answer'> & { part: 1 | 2 | 3 }
export type TopicMaterialInsert = Pick<TopicMaterial, 'title' | 'category' | 'content' | 'tags'>
export type ExpressionInsert = Pick<Expression, 'expr_type' | 'term' | 'meaning' | 'notes'>
export type PronunciationInsert = Pick<Pronunciation, 'word' | 'phonetic' | 'notes'>
export type QuickNoteInsert = Pick<QuickNote, 'content' | 'category'>

// === 表达式类型标签映射 ===

export const EXPRESSION_TYPE_LABELS: Record<ExpressionType, string> = {
  word: '单词',
  phrase: '短语短句',
  connector: '连接词',
}

export const EXPRESSION_TYPE_OPTIONS = Object.entries(EXPRESSION_TYPE_LABELS).map(([value, label]) => ({ value: value as ExpressionType, label }))

// === Part 映射 ===

export const PART_OPTIONS = [
  { value: 1, label: 'Part 1' },
  { value: 2, label: 'Part 2' },
  { value: 3, label: 'Part 3' },
] as const

// === 当季标签 ===

export const SEASON_LABELS = ['保留题', '新题', '预测题'] as const
