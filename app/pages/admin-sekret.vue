<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface PhotoItem {
  id: string
  created_at: string
  url: string
  author: string
}

const photos = ref<PhotoItem[]>([])
const loading = ref(true)

// Pobranie listy zdjęć
const fetchPhotos = async () => {
  loading.value = true
  try {
    const data = await $fetch<PhotoItem[]>('/api/photos')
    photos.value = data || []
  } catch (err: any) {
    console.error('Błąd pobierania zdjęć:', err)
  } finally {
    loading.value = false
  }
}

// Obsługa usuwania
const deletePhoto = async (id: string, url: string) => {
  if (!confirm('Czy na pewno chcesz na zawsze usunąć to zdjęcie?')) return

  try {
    // Odcięcie z URL-a samej końcówki z nazwą pliku (np. "123456_abc.jpg")
    const fileName = url.split('/').pop()
    if (!fileName) throw new Error('Nie można odczytać nazwy pliku')

    await $fetch(`/api/photos/${id}`, {
      method: 'DELETE',
      body: { fileName }
    })

    // Odświeżenie listy po udanym usunięciu
    await fetchPhotos()
  } catch (err: any) {
    alert('Błąd podczas usuwania: ' + (err.statusMessage || err.message))
  }
}

onMounted(() => {
  fetchPhotos()
})
</script>

<template>
  <div class="min-h-screen bg-stone-900 py-8 sm:py-16 px-4 text-stone-100">
    <div class="max-w-5xl mx-auto">
      
      <!-- PRZYCISK POWROTU -->
      <NuxtLink 
        to="/galeria" 
        class="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-400 hover:text-white mb-8 transition-colors"
      >
        <span>&larr;</span> Wróć do zwykłej galerii
      </NuxtLink>

      <!-- NAGŁÓWEK -->
      <div class="text-center mb-10 sm:mb-14">
        <h1 class="font-serif text-3xl sm:text-5xl text-red-400 mb-3 tracking-wide">
          Panel Administratora
        </h1>
        <p class="text-stone-400 text-sm sm:text-base font-light max-w-md mx-auto">
          Możesz tutaj nieodwracalnie usuwać zdjęcia przesłane przez gości.
        </p>
      </div>

      <!-- SIATKA ZDJĘĆ -->
      <div v-if="loading" class="text-center py-12 text-stone-500">
        Ładowanie bazy danych...
      </div>

      <div v-else-if="photos.length === 0" class="text-center py-12 text-stone-500 font-light">
        Brak zdjęć do usunięcia.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="photo in photos" 
          :key="photo.id"
          class="bg-stone-800 rounded-2xl overflow-hidden shadow-lg border border-stone-700 flex flex-col transition-all hover:shadow-xl relative group"
        >
          <!-- PRZYCISK USUWANIA (pokazuje się po najechaniu myszką) -->
          <button 
            @click="deletePhoto(photo.id, photo.url)"
            class="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            title="Usuń zdjęcie"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <!-- ZDJĘCIE -->
          <div class="relative aspect-square overflow-hidden bg-stone-900">
            <img 
              :src="photo.url" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              loading="lazy"
            />
          </div>

          <!-- PODPIS -->
          <div class="p-4 flex flex-col gap-1 text-xs text-stone-400 bg-stone-800 border-t border-stone-700">
            <div class="flex items-center justify-between">
              <span class="font-medium text-stone-200 truncate">
                👤 {{ photo.author }}
              </span>
              <span class="font-light shrink-0">
                {{ new Date(photo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>