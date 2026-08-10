import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://irvggqouarrqdumgdzdz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydmdncW91YXJycWR1bWdkemR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjExMTY2NSwiZXhwIjoyMTAxNjg3NjY1fQ.gCCZ8vwjwCu43d-qtiVYNMN_aNaOlO0zp0ZJjrybNTo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { photoId, reaction, userId } = body

    if (!photoId || !reaction || !userId) {
      throw createError({ statusCode: 400, statusMessage: 'Brak danych' })
    }

    // Sprawdzenie, czy użytkownik już zareagował na to zdjęcie
    const { data: existing } = await supabase
      .from('photo_reactions')
      .select('*')
      .eq('photo_id', photoId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      if (existing.reaction === reaction) {
        // Ponowne kliknięcie tej samej reakcji -> usunięcie reakcji
        await supabase
          .from('photo_reactions')
          .delete()
          .eq('id', existing.id)
      } else {
        // Kliknięcie innej reakcji -> zmiana na nową
        await supabase
          .from('photo_reactions')
          .update({ reaction })
          .eq('id', existing.id)
      }
    } else {
      // Pierwsza reakcja użytkownika
      await supabase
        .from('photo_reactions')
        .insert({ photo_id: photoId, user_id: userId, reaction })
    }

    return { success: true }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})