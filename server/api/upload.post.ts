import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  console.log(`[API START] Otrzymano żądanie /api/upload`)
  try {
    const body = await readMultipartFormData(event)
    console.log(`[API LOG] Sparsowano dane z żądania. Czy body istnieje? ${!!body}`)
    
    if (!body || body.length === 0) {
      console.log(`[API ERROR] Body jest puste!`)
      throw createError({ statusCode: 400, statusMessage: 'Brak danych pliku' })
    }

    const fileItems = body.filter(item => item.name === 'file' && item.data)
    const authorItem = body.find(item => item.name === 'author')

    console.log(`[API LOG] Znaleziono plików do wgrania: ${fileItems.length}`)

    if (fileItems.length === 0) {
      console.log(`[API ERROR] Brak elementów typu 'file' w FormData!`)
      throw createError({ statusCode: 400, statusMessage: 'Brak plików w formularzu' })
    }

    const author = authorItem ? authorItem.data.toString('utf-8') : 'Anonim'
    console.log(`[API LOG] Autor: ${author}`)

    for (const fileItem of fileItems) {
      const mimeType = fileItem.type || 'image/jpeg'
      console.log(`[API LOG] Przetwarzanie pliku - Typ: ${mimeType}, Rozmiar: ${fileItem.data.length} bajtów`)

      if (!mimeType.startsWith('image/')) {
        console.log(`[API LOG] Pomijam plik, bo to nie obraz (typ: ${mimeType})`)
        continue
      }

      const rawExt = fileItem.filename ? fileItem.filename.split('.').pop() : 'jpg'
      const cleanExt = (rawExt || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${cleanExt}`

      console.log(`[API LOG] Zaczynam wysyłkę do Supabase Storage jako: ${fileName}`)

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, fileItem.data, {
          contentType: mimeType,
          upsert: true
        })

      if (uploadError) {
        console.error('[API FATAL STORAGE ERROR]:', uploadError)
        throw uploadError
      }
      console.log(`[API LOG] Sukces Supabase Storage!`)

      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName)
      console.log(`[API LOG] Wygenerowano Public URL: ${urlData.publicUrl}`)

      const { error: dbError } = await supabase.from('photos').insert({
        url: urlData.publicUrl,
        author: author || 'Anonim'
      })

      if (dbError) {
        console.error('[API FATAL DB ERROR]:', dbError)
        throw dbError
      }
      console.log(`[API LOG] Zapisano rekord w bazie danych!`)
    }

    console.log(`[API END] Operacja uploadu zakończona sukcesem!`)
    return { success: true }
  } catch (err: any) {
    const detailMsg = err?.message || err?.statusMessage || 'Nieznany błąd serwera'
    console.error('[API GLOBAL CATCH]:', detailMsg, err)

    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: detailMsg
    })
  }
})