interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

function getFunctionUrl(): string {
  const url = localStorage.getItem('ielts_supabase_url') || ''
  if (!url) throw new Error('Supabase URL 未配置')
  return `${url}/functions/v1/deepseek-proxy`
}

export async function callDeepSeek(prompt: string): Promise<string> {
  const fnUrl = getFunctionUrl()

  const response = await fetch(fnUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`DeepSeek API 调用失败 (${response.status}): ${errText}`)
  }

  const data: DeepSeekResponse = await response.json()
  if (!data?.choices?.[0]?.message?.content) {
    throw new Error('DeepSeek 返回内容为空')
  }

  return data.choices[0].message.content
}

/** AI 生成雅思口语参考答案 */
export function buildAnswerPrompt(question: string, part: 1 | 2 | 3, bandScore: number = 7): string {
  const partGuide: Record<number, string> = {
    1: '这是 Part 1 题目。只需要回答 2-3 句，简短自然，像日常对话，不要扩展。',
    2: '这是 Part 2 题目。做一个 1.5-2 分钟的完整独白，包含时间/地点/人物/感受，结构清晰，有开头-主体-结尾。',
    3: '这是 Part 3 题目。做一个 45-60 秒的分析性回答，给出明确观点+原因+具体例证，展现思辨深度。',
  }

  return `你是一位雅思口语考官。请为以下 Part ${part} 题目生成一份 Band ${bandScore} 的高分参考答案。

${partGuide[part]}
题目：${question}

注意：
- 只输出 Part ${part} 的答案，不要输出其他 Part 的内容
- 使用自然口语化表达，避免过于书面化的词汇
- 包含 1-2 个可迁移的万能表达（idiom/phrasal verb/discourse marker）
- 故事要真实可信

请严格按照以下格式输出：
【参考答案】
{答案正文}

【亮点表达】
- {词汇或短语}：{解释和适用场景}`
}

/** AI 词汇升级 */
export function buildUpgradePrompt(input: string, bandScore: number = 7): string {
  return `你是一位雅思口语词汇教练。请帮我升级以下表达，目标分数为 Band ${bandScore}。

原始输入：
${input}

要求：
- 不改变原意和口语化的语气
- 输出对照表格式：原表达 → 升级表达 → 为什么更好
- 明确标注每个升级表达是"口语适用"还是"偏书面慎用"
- 额外推荐 1-2 个可以替代的相关地道表达

请严格按照以下格式输出：
【升级对照】
| 原表达 | 升级表达 | 为什么更好 | 适用性 |
|--------|----------|------------|--------|
| ... | ... | ... | 口语适用/偏书面慎用 |

【额外推荐】
- {地道表达}：{使用场景}`
}
