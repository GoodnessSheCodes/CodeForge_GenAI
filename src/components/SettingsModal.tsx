import { useState } from 'react'
import { Eye, EyeOff, X } from './Icons'

interface Props {
  apiKey: string
  model: string
  onSaveKey: (key: string) => void
  onSaveModel: (model: string) => void
  onClearKey: () => void
  onClose: () => void
}

export function SettingsModal({ apiKey, model, onSaveKey, onSaveModel, onClearKey, onClose }: Props) {
  const [keyInput, setKeyInput] = useState(apiKey)
  const [modelInput, setModelInput] = useState(model)
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    onSaveKey(keyInput.trim())
    onSaveModel(modelInput.trim())
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label htmlFor="api-key">Google AI Studio API Key</label>
            <p className="field-hint">
              Your key is stored only in this browser (localStorage). It is sent directly to
              Google AI Studio and never touches our server.
            </p>
            <div className="input-with-action">
              <input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIza..."
                autoComplete="off"
                spellCheck={false}
              />
              <button
                className="icon-btn"
                onClick={() => setShowKey((s) => !s)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
                type="button"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="model">Google AI Model</label>
            <p className="field-hint">
              Choose a Gemini model. Newer models may not be available for all API keys.
            </p>
            <select
              id="model"
              value={modelInput}
              onChange={(e) => setModelInput(e.target.value)}
            >
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (fast, recommended)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (highest quality)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn-danger" onClick={onClearKey} type="button">
              Clear stored key
            </button>
            <button className="btn-primary" onClick={handleSave} type="button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
