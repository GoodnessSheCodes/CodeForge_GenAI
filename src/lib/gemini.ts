export type ContentType = 'code' | 'tutorial' | 'blog'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

const SYSTEM_PROMPT = `You are an expert software developer, technical writer, and coding educator.

Your task is to generate high-quality coding content based on the user's request. The user may ask you to generate either:

1. CODE — working code for a specified programming task.
2. CODING TUTORIAL — a complete, beginner-friendly tutorial explaining how to build or understand something with code.
3. BLOG — an informative coding blog/article that teaches a programming concept, technology, tool, or development practice.

Your goal is to produce content that is technically accurate, practical, easy to understand, and suitable for the user's requested skill level.

## CODE QUALITY REQUIREMENTS
- Use the programming language requested by the user.
- Follow common conventions and best practices for that language.
- Use meaningful variable, class, method, and function names.
- Keep code readable and appropriately structured.
- Include comments only where they improve understanding.
- Consider basic error handling.
- Never invent libraries, APIs, functions, or commands.

## TEACHING STYLE
- Clear explanations, short paragraphs, practical examples, step-by-step reasoning.
- Use simple terminology, proper headings, and code blocks.
- When introducing a technical term, briefly explain what it means.
- Do not overwhelm beginners with unnecessary theory.

## ACCURACY
- Prioritize technical correctness over producing an impressive-looking answer.
- If uncertain about a technical detail, clearly identify the uncertainty.

## OUTPUT RULE
Always produce a complete, self-contained response in well-formatted Markdown.
Do not ask follow-up questions. If information is missing, make a reasonable assumption and state it.`

function buildUserPrompt(
  contentType: ContentType,
  topic: string,
  language: string,
  skillLevel: SkillLevel,
): string {
  const typeLabel =
    contentType === 'code' ? 'CODE' : contentType === 'tutorial' ? 'CODING TUTORIAL' : 'BLOG'

  let prompt = `Generate a ${typeLabel} about the following topic:\n\n"${topic}"\n\n`

  if (language.trim()) {
    prompt += `Programming language / technology: ${language}\n`
  } else {
    prompt += `Programming language / technology: choose the most appropriate one for the topic and state your choice.\n`
  }

  prompt += `Target audience skill level: ${skillLevel}\n\n`

  if (contentType === 'code') {
    prompt += `Structure your response as:
1. **What the code does** — briefly explain the purpose.
2. **Complete Code** — provide complete, runnable code with syntax highlighting. Do not provide unnecessary fragments.
3. **How It Works** — explain the important parts in simple language.
4. **How to Run It** — provide the commands or steps to run the code.
5. **Example Output** — show an example of expected output.
6. **Improvements** — suggest 2–3 practical improvements or next steps.

Do not claim the code was tested unless it actually was.`
  } else if (contentType === 'tutorial') {
    prompt += `Structure your tutorial as:
# Title
## Introduction — what the reader will learn and why it's useful.
## Prerequisites — required knowledge, software, tools.
## What We Are Building — describe the final result.
## Step 1: Setup — environment and dependencies.
## Step 2: Implementation — code for each step with explanations of what it does, important syntax, and why the approach is used.
## Step 3: Testing — how to test with example inputs and expected outputs.
## Common Errors — likely beginner mistakes and fixes.
## Best Practices — practical recommendations.
## Conclusion — summarize what was learned.
## Next Steps — suggest projects or concepts to explore next.

Teach rather than simply dump code. Explanations should appear alongside the relevant code.`
  } else {
    prompt += `Structure your blog as:
# Title
## Introduction — explain the topic and why developers should care.
## Main Concepts — explain important concepts in logical sections.
## Practical Example — include a realistic coding example.
## Code Explanation — explain the example and identify important parts.
## Common Mistakes — explain problems developers may encounter.
## Best Practices — provide practical recommendations.
## Conclusion — summarize key takeaways.
## Further Learning — suggest related concepts or technologies.

The writing should be educational and engaging without unnecessary jargon.`
  }

  return prompt
}

export async function generateContent(
  apiKey: string,
  model: string,
  contentType: ContentType,
  topic: string,
  language: string,
  skillLevel: SkillLevel,
): Promise<string> {
  const userPrompt = buildUserPrompt(contentType, topic, language, skillLevel)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    let message = `Google AI request failed (${response.status})`
    try {
      const parsed = JSON.parse(errorBody)
      if (parsed?.error?.message) message = parsed.error.message
    } catch {
      // keep default message
    }
    throw new Error(message)
  }

  const data = await response.json()
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) throw new Error('Google AI returned an empty response.')
  return content as string
}
