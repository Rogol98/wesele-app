import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  try {
    const body = await readMultipartFormData(event)
    
    if (!body || body.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Brak danych pliku' })
    }

    const fileItems = body.filter(item => item.name === 'file' && item.data)
    const authorItem = body.find(item => item.name === 'author')

    if (fileItems.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Brak plików w formularzu' })
    }

    const author = authorItem ? authorItem.data.toString('utf-8') : 'Anonim'

    // Pętla wgrywająca każdy plik przesłany w formularzu
    for (const fileItem of fileItems) {
      // Weryfikacja typu pliku (odrzuca nie-obrazy)
      if (!fileItem.type || !fileItem.type.startsWith('image/')) {
        continue
      }

      const rawExt = fileItem.filename ? fileItem.filename.split('.').pop() : 'jpg'
      const cleanExt = (rawExt || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${cleanExt}`
      const mimeType = fileItem.type || 'image/jpeg'

      console.log(`[API UPLOAD] Wgrywanie ${fileName} do Supabase...`)

      // 1. Wgrywanie pliku do Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, fileItem.data, {
          contentType: mimeType,
          upsert: true
        })

      if (uploadError) {
        console.error('[API UPLOAD ERROR - STORAGE]:', uploadError)
        throw uploadError
      }

      // 2. Pobranie publicznego adresu URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      // 3. Zapis do bazy danych
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          url: urlData.publicUrl,
          author: author || 'Anonim'
        })

      if (dbError) {
        console.error('[API UPLOAD ERROR - DB]:', dbError)
        throw dbError
      }
    }

    console.log(`[API UPLOAD] Wgrano pomyślnie ${fileItems.length} zdjęć!`)
    return { success: true }
  } catch (err: any) {
    const detailMsg = err?.message || err?.statusMessage || 'Nieznany błąd serwera'
    console.error('[API UPLOAD ERROR CATCH]:', detailMsg)

    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: detailMsg
    })
  }
})