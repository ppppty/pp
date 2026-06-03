-- ============================================
-- 雅思口语笔记本 — Supabase 数据库建表 SQL
-- 请在 Supabase Dashboard → SQL Editor 中执行
-- ============================================

-- 1. 串题板块
CREATE TABLE IF NOT EXISTS speaking_qa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part INT NOT NULL CHECK (part IN (1, 2, 3)),
  season_label TEXT DEFAULT '',
  topic_tag TEXT DEFAULT '',
  question TEXT NOT NULL,
  answer TEXT DEFAULT '',
  ai_answer TEXT DEFAULT '',
  mastery_level INT DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  next_review_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 素材库
CREATE TABLE IF NOT EXISTS topic_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  content TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 表达库
CREATE TABLE IF NOT EXISTS expressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expr_type TEXT NOT NULL CHECK (expr_type IN ('vocabulary', 'sentence_pattern', 'connector', 'idiom', 'phrasal_verb')),
  term TEXT NOT NULL,
  meaning TEXT DEFAULT '',
  example TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  mastery_level INT DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  next_review_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 发音本
CREATE TABLE IF NOT EXISTS pronunciation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  phonetic TEXT DEFAULT '',
  error_type TEXT DEFAULT '' CHECK (error_type IN ('', 'vowel', 'consonant', 'stress', 'intonation', 'linking')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 快捷笔记
CREATE TABLE IF NOT EXISTS quick_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT DEFAULT '待整理',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- RLS 策略 — 允许公开读写（个人使用，URL 不公开）
-- 使用 DO 块确保可重复执行
-- ============================================

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY['speaking_qa', 'topic_materials', 'expressions', 'pronunciation', 'quick_notes'])
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "允许公开读写" ON %I', tbl);
        EXECUTE format('CREATE POLICY "允许公开读写" ON %I FOR ALL USING (true) WITH CHECK (true)', tbl);
    END LOOP;
END $$;

-- ============================================
-- 索引（IF NOT EXISTS 确保可重复执行）
-- ============================================
CREATE INDEX IF NOT EXISTS idx_speaking_qa_created ON speaking_qa (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_speaking_qa_review ON speaking_qa (next_review_at);
CREATE INDEX IF NOT EXISTS idx_topic_materials_created ON topic_materials (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expressions_created ON expressions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expressions_review ON expressions (next_review_at);
CREATE INDEX IF NOT EXISTS idx_pronunciation_created ON pronunciation (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quick_notes_created ON quick_notes (created_at DESC);
