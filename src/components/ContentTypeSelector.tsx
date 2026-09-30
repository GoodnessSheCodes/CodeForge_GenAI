import { Code, BookOpen, FileText } from './Icons'
import type { ContentType } from '../lib/gemini'

interface Props {
  value: ContentType
  onChange: (type: ContentType) => void
}

const OPTIONS: {
  type: ContentType
  label: string
  desc: string
  Icon: typeof Code
}[] = [
  { type: 'code', label: 'Code', desc: 'Working, runnable code with explanation', Icon: Code },
  { type: 'tutorial', label: 'Tutorial', desc: 'Step-by-step beginner-friendly guide', Icon: BookOpen },
  { type: 'blog', label: 'Blog', desc: 'Polished technical article', Icon: FileText },
]

export function ContentTypeSelector({ value, onChange }: Props) {
  return (
    <div className="type-selector">
      {OPTIONS.map(({ type, label, desc, Icon }) => (
        <button
          key={type}
          className={`type-card ${value === type ? 'active' : ''}`}
          onClick={() => onChange(type)}
          type="button"
        >
          <div className="type-card-icon">
            <Icon size={22} />
          </div>
          <div className="type-card-text">
            <span className="type-card-label">{label}</span>
            <span className="type-card-desc">{desc}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
