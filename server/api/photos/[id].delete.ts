import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://irvggqouarrqdumgdzdz.supabase.co'
// Klucz service_role pozwalający na nadpisywanie uprawnień RLS
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydmdncW91YXJycWR1bWdkemR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjExMTY2NSwiZXhwIjoyMTAxNjg3NjY1fQ.gCCZ8vwjwCu43d-qtiVYNMN_aNaOlO0zp0ZJjrybNTo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const fileName = body?.fileName

    if (!id || !fileName) {
      throw createError({ statusCode: 400, statusMessage: 'Brak ID lub nazwy pliku' })
    }

    console.log(`[API DELETE] Usuwanie zdjęcia: ID=${id}, Plik=${fileName}`)

    // 1. Usunięcie z bazy danych
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    // 2. Usunięcie z Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([fileName])

    if (storageError) throw storageError

    console.log('[API DELETE] Sukces!')
    return { success: true }
  } catch (err: any) {
    console.error('[API DELETE ERROR]:', err?.message)
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Błąd podczas usuwania'
    })
  }
})