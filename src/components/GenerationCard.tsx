import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, Trash } from './Icons'
import type { Generation } from '../lib/supabase'

interface Props {
  generation: Generation
  onDelete: (id: string) => void
}

const typeBadge: Record<Generation['content_type'], string> = {
  code: 'Code',
  tutorial: 'Tutorial',
  blog: 'Blog',
}

const skillBadge: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function GenerationCard({ generation, onDelete }: Props) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generation.result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  const date = new Date(generation.created_at).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="gen-card">
      <div className="gen-card-header">
        <div className="gen-card-meta">
          <span className={`badge badge-${generation.content_type}`}>
            {typeBadge[generation.content_type]}
          </span>
          <span className="badge badge-skill">{skillBadge[generation.skill_level]}</span>
          {generation.language && <span className="badge badge-lang">{generation.language}</span>}
          <span className="gen-card-date">{date}</span>
        </div>
        <div className="gen-card-actions">
          <button className="icon-btn" onClick={handleCopy} title="Copy content" type="button">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button
            className="icon-btn"
            onClick={() => onDelete(generation.id)}
            title="Delete"
            type="button"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      <h3 className="gen-card-topic">{generation.topic}</h3>

      <div className={`gen-card-content ${expanded ? 'expanded' : 'collapsed'}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{generation.result}</ReactMarkdown>
      </div>

      {!expanded && (
        <button className="expand-btn" onClick={() => setExpanded(true)} type="button">
          Show full content
        </button>
      )}
    </div>
  )
}
