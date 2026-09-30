import { useState, useEffect, useCallback } from 'react'
import { supabase, type Generation } from '../lib/supabase'

export function useGenerations() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGenerations = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Failed to load history:', error.message)
    } else {
      setGenerations((data as Generation[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchGenerations()
  }, [fetchGenerations])

  const addGeneration = useCallback(
    async (gen: Omit<Generation, 'id' | 'created_at'>): Promise<Generation | null> => {
      const { data, error } = await supabase
        .from('generations')
        .insert({
          content_type: gen.content_type,
          topic: gen.topic,
          language: gen.language,
          skill_level: gen.skill_level,
          result: gen.result,
          model: gen.model,
        })
        .select('*')
        .single()

      if (error) {
        console.error('Failed to save generation:', error.message)
        return null
      }
      const saved = data as Generation
      setGenerations((prev) => [saved, ...prev])
      return saved
    },
    [],
  )

  const deleteGeneration = useCallback(async (id: string) => {
    const { error } = await supabase.from('generations').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete:', error.message)
      return false
    }
    setGenerations((prev) => prev.filter((g) => g.id !== id))
    return true
  }, [])

  return { generations, loading, fetchGenerations, addGeneration, deleteGeneration }
}
