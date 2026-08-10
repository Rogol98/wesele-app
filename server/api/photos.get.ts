import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://irvggqouarrqdumgdzdz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydmdncW91YXJycWR1bWdkemR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjExMTY2NSwiZXhwIjoyMTAxNjg3NjY1fQ.gCCZ8vwjwCu43d-qtiVYNMN_aNaOlO0zp0ZJjrybNTo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = (query.userId as string) || ''

    const { data: photos, error: photosErr } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (photosErr) throw photosErr

    const { data: reactions, error: reactErr } = await supabase
      .from('photo_reactions')
      .select('*')

    if (reactErr) throw reactErr

    // Przypisanie liczników reakcji do poszczególnych zdjęć
    const photosWithReactions = (photos || []).map(photo => {
      const photoReacts = (reactions || []).filter(r => r.photo_id === photo.id)
      
      const counts: Record<string, number> = {}
      let userReaction: string | null = null

      photoReacts.forEach(r => {
        counts[r.reaction] = (counts[r.reaction] || 0) + 1
        if (r.user_id === userId) {
          userReaction = r.reaction
        }
      })

      return {
        ...photo,
        reactions: counts,
        userReaction
      }
    })

    return photosWithReactions
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})