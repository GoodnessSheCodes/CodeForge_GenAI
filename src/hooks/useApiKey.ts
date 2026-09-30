import { useState, useEffect } from 'react'

const STORAGE_KEY = 'gemini_api_key'
const MODEL_KEY = 'gemini_model'

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>('')
  const [model, setModel] = useState<string>('gemini-3.8-flash')

  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_KEY)
    if (storedKey) setApiKey(storedKey)
    const storedModel = localStorage.getItem(MODEL_KEY)
    if (storedModel && storedModel.startsWith('gemini')) {
      setModel(storedModel)
    } else {
      localStorage.setItem(MODEL_KEY, 'gemini-3.8-flash')
    }
  }, [])

  const saveKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem(STORAGE_KEY, key)
  }

  const saveModel = (m: string) => {
    setModel(m)
    localStorage.setItem(MODEL_KEY, m)
  }

  const clearKey = () => {
    setApiKey('')
    localStorage.removeItem(STORAGE_KEY)
  }

  return { apiKey, saveKey, clearKey, model, saveModel }
}
