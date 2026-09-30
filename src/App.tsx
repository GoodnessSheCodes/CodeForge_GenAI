import { useState } from 'react'
import { useApiKey } from './hooks/useApiKey'
import { useGenerations } from './hooks/useGenerations'
import { generateContent, type ContentType, type SkillLevel } from './lib/gemini'
import { ContentTypeSelector } from './components/ContentTypeSelector'
import { SettingsModal } from './components/SettingsModal'
import { GenerationCard } from './components/GenerationCard'
import { Sparkles, Settings as SettingsIcon, KeyRound, History, Loader, AlertCircle } from './components/Icons'

export default function App() {
  const { apiKey, saveKey, clearKey, model, saveModel } = useApiKey()
  const { generations, loading, addGeneration, deleteGeneration } = useGenerations()

  const [contentType, setContentType] = useState<ContentType>('code')
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('')
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create')

  const hasKey = apiKey.trim().length > 0

  const handleGenerate = async () => {
    if (!hasKey) {
      setShowSettings(true)
      return
    }
    if (!topic.trim()) {
      setError('Please describe what you want to generate.')
      return
    }

    setGenerating(true)
    setError(null)
    try {
      const result = await generateContent(
        apiKey,
        model,
        contentType,
        topic,
        language,
        skillLevel,
      )
      await addGeneration({
        content_type: contentType,
        topic: topic.trim(),
        language: language.trim() || null,
        skill_level: skillLevel,
        result,
        model,
      })
      setTopic('')
      setActiveTab('history')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong during generation.'
      setError(msg)
    } finally {
      setGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={24} />
            </div>
            <div>
              <h1>CodeForge AI</h1>
              <p className="brand-tag">Coding content generator</p>
            </div>
          </div>
          <button
            className={`btn-ghost ${hasKey ? '' : 'btn-ghost-warn'}`}
            onClick={() => setShowSettings(true)}
            type="button"
          >
            {hasKey ? <SettingsIcon size={18} /> : <KeyRound size={18} />}
            <span>{hasKey ? 'Settings' : 'Add API key'}</span>
          </button>
        </div>
      </header>

      <main className="main">
        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
            type="button"
          >
            <Sparkles size={16} /> Create
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            type="button"
          >
            <History size={16} /> History
            {generations.length > 0 && <span className="tab-count">{generations.length}</span>}
          </button>
        </nav>

        {activeTab === 'create' && (
          <div className="create-panel">
            {!hasKey && (
              <div className="setup-banner" onClick={() => setShowSettings(true)} role="button" tabIndex={0}>
                <KeyRound size={20} />
                <div>
                  <strong>Add your Google AI Studio API key to get started</strong>
                  <span>Click here to enter your key — it's stored only in your browser.</span>
                </div>
              </div>
            )}
            <section className="card">
              <label className="field-label">What do you want to generate?</label>
              <ContentTypeSelector value={contentType} onChange={setContentType} />
            </section>

            <section className="card">
              <label className="field-label" htmlFor="topic">
                Describe your topic
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  contentType === 'code'
                    ? 'e.g. A Python function that reads a CSV file and calculates the average of a column'
                    : contentType === 'tutorial'
                      ? 'e.g. How to build a REST API with Express and Node.js'
                      : 'e.g. Understanding JavaScript closures with practical examples'
                }
                rows={4}
              />
              <div className="row-2">
                <div className="field">
                  <label htmlFor="language">Language / technology (optional)</label>
                  <input
                    id="language"
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Python, React, Go, ..."
                    spellCheck={false}
                  />
                </div>
                <div className="field">
                  <label htmlFor="skill">Skill level</label>
                  <select
                    id="skill"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </section>

            {error && (
              <div className="error-banner">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn-primary btn-generate"
              onClick={handleGenerate}
              disabled={generating}
              type="button"
            >
              {generating ? (
                <>
                  <Loader size={18} /> Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate content
                </>
              )}
            </button>
            <p className="hint">Press Cmd/Ctrl + Enter to generate</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-panel">
            {loading && (
              <div className="empty-state">
                <Loader size={28} />
                <p>Loading history...</p>
              </div>
            )}
            {!loading && generations.length === 0 && (
              <div className="empty-state">
                <Sparkles size={40} />
                <h3>No generations yet</h3>
                <p>Create your first piece of coding content to see it here.</p>
                <button className="btn-primary" onClick={() => setActiveTab('create')} type="button">
                  Start creating
                </button>
              </div>
            )}
            {!loading && generations.length > 0 && (
              <div className="gen-list">
                {generations.map((g) => (
                  <GenerationCard key={g.id} generation={g} onDelete={deleteGeneration} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          model={model}
          onSaveKey={saveKey}
          onSaveModel={saveModel}
          onClearKey={clearKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
