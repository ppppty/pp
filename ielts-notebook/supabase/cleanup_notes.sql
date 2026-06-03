-- 清理表达库中的"来源"类备注
UPDATE expressions
SET notes = '', updated_at = now()
WHERE notes LIKE '%来自%'
   OR notes LIKE '%来源%'
   OR notes ILIKE '%home%';

-- 确认清理结果
SELECT COUNT(*) AS remaining_with_source_notes
FROM expressions
WHERE notes LIKE '%来自%'
   OR notes LIKE '%来源%'
   OR notes ILIKE '%home%';
