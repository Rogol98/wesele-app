import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://irvggqouarrqdumgdzdz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydmdncW91YXJycWR1bWdkemR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjExMTY2NSwiZXhwIjoyMTAxNjg3NjY1fQ.gCCZ8vwjwCu43d-qtiVYNMN_aNaOlO0zp0ZJjrybNTo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = (query.userId as string) || ''

    // Pobieramy zdjęcia
    const { data: photos, error: photosErr } = await supabase
      .from('photos')
      .select('*')

    if (photosErr) throw photosErr

    // Pobieramy reakcje
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

    // SORTOWANIE ZDJĘĆ:
    // 1. Według łącznej liczby reakcji (malejąco - najwięcej na górze)
    // 2. Jeśli remis (np. po 0 reakcji), sortujemy po dacie dodania (od najnowszych)
    photosWithReactions.sort((a, b) => {
      const totalReactionsA = Object.values(a.reactions).reduce((acc, count) => acc + count, 0)
      const totalReactionsB = Object.values(b.reactions).reduce((acc, count) => acc + count, 0)

      if (totalReactionsA !== totalReactionsB) {
        return totalReactionsB - totalReactionsA // Sortowanie po liczbie reakcji
      }
      
      // Jeśli liczba reakcji jest taka sama, sortuj po dacie (created_at)
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })

    return photosWithReactions
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})