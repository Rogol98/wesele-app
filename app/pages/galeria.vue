<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface PhotoItem {
  id: string
  created_at: string
  url: string
  author: string
  reactions?: Record<string, number>
  userReaction?: string | null
}

const AVAILABLE_REACTIONS = ['❤️', '🔥', '👍', '😆', '😮', '😠', '😭']

const photos = ref<PhotoItem[]>([])
const loading = ref(true)
const uploading = ref(false)
const uploadProgress = ref('')
const authorName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const userId = ref('')
const activePickerId = ref<string | null>(null)

// Zmienne dla Galerii na pełnym ekranie (Lightbox)
const lightboxOpen = ref(false)
const currentPhotoIndex = ref(0)

// Pobieranie / generowanie identyfikatora użytkownika
const getOrCreateUserId = () => {
  if (import.meta.client) {
    let id = localStorage.getItem('wedding_user_id')
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
      localStorage.setItem('wedding_user_id', id)
    }
    userId.value = id
  }
}

// Pobieranie zdjęć z bazy
const fetchPhotos = async () => {
  loading.value = true
  try {
    const data = await $fetch<PhotoItem[]>(`/api/photos?userId=${userId.value}`)
    photos.value = data || []
  } catch (err: any) {
    console.error('Błąd pobierania zdjęć:', err)
  } finally {
    loading.value = false
  }
}

// Optymistyczna obsługa reakcji (bez odświeżania strony)
const handleReaction = async (photo: PhotoItem, selectedEmoji: string) => {
  activePickerId.value = null

  if (!photo.reactions) photo.reactions = {}
  const oldReaction = photo.userReaction

  if (oldReaction === selectedEmoji) {
    // Cofnięcie reakcji
    photo.userReaction = null
    photo.reactions[selectedEmoji] = Math.max(0, (photo.reactions[selectedEmoji] || 1) - 1)
    if (photo.reactions[selectedEmoji] === 0) delete photo.reactions[selectedEmoji]
  } else {
    // Zmiana reakcji
    if (oldReaction && photo.reactions[oldReaction]) {
      photo.reactions[oldReaction] = Math.max(0, photo.reactions[oldReaction] - 1)
      if (photo.reactions[oldReaction] === 0) delete photo.reactions[oldReaction]
    }
    photo.userReaction = selectedEmoji
    photo.reactions[selectedEmoji] = (photo.reactions[selectedEmoji] || 0) + 1
  }

  // Zapis na serwerze w tle
  try {
    await $fetch('/api/reactions', {
      method: 'POST',
      body: {
        photoId: photo.id,
        reaction: selectedEmoji,
        userId: userId.value
      }
    })
  } catch (err: any) {
    console.error('Błąd zapisu reakcji:', err)
    await fetchPhotos()
  }
}

// Łączna liczba reakcji
const getTotalReactions = (reactions?: Record<string, number>) => {
  if (!reactions) return 0
  return Object.values(reactions).reduce((acc, count) => acc + count, 0)
}

// Kompresja zdjęcia w przeglądarce: max 2560px, JPEG 92% (DODANO OBSŁUGĘ BŁĘDÓW!)
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error("Wystąpił błąd podczas czytania pliku przez FileReader."))
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.onerror = () => reject(new Error("Przeglądarka nie mogła załadować danych obrazu do pamięci."))
        img.src = e.target?.result as string
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const MAX_WIDTH = 2560
            let width = img.width
            let height = img.height

            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width)
              width = MAX_WIDTH
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) return reject(new Error("Brak kontekstu 2D w Canvas (brak pamięci?)."))
            
            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob)
                else reject(new Error("toBlob zwrócił null. Safari zabiło proces z braku RAMu?"))
              },
              'image/jpeg',
              0.92
            )
          } catch (canvasErr) {
            reject(new Error("Błąd podczas rysowania na Canvas: " + canvasErr))
          }
        }
      }
    } catch (fatalErr) {
      reject(new Error("Krytyczny błąd funkcji compressImage: " + fatalErr))
    }
  })
}

// Masowe wgrywanie wielu zdjęć (Z LOGAMI ŚLEDCZYMI)
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const rawFiles = Array.from(target.files)
  const imageFiles = rawFiles.filter(f => f.type.startsWith('image/'))

  if (imageFiles.length === 0) {
    alert('Można wrzucać wyłącznie zdjęcia! Wideo nie są obsługiwane.')
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  uploading.value = true
  let successCount = 0

  try {
    const currentAuthor = authorName.value.trim() || 'Anonim'

    // Pętla wysyłająca z systemem śledzenia postępów
    for (let i = 0; i < imageFiles.length; i++) {
      let debugStep = "Start"
      const file = imageFiles[i]
      if (!file) continue

      try {
        uploadProgress.value = `Wysyłanie ${i + 1} z ${imageFiles.length}...`
        
        debugStep = `Kompresja pliku ${file.name} (Rozmiar: ${(file.size / 1024 / 1024).toFixed(2)} MB)`
        const compressedBlob = await compressImage(file)
        
        debugStep = `Tworzenie FormData dla ${file.name}`
        const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
          type: 'image/jpeg'
        })

        const singleFormData = new FormData()
        singleFormData.append('author', currentAuthor)
        singleFormData.append('file', compressedFile)

        debugStep = `Wysyłka (fetch) pliku ${file.name} do API`
        await $fetch('/api/upload', {
          method: 'POST',
          body: singleFormData
        })
        
        successCount++
      } catch (innerErr: any) {
        // Jeśli JEDNO zdjęcie z paczki wybuchnie, pokażemy DOKŁADNIE dlaczego i na jakim etapie!
        alert(`🚨 ŚLEDZTWO (Zdjęcie ${i + 1} z ${imageFiles.length}):\n\nKrok: ${debugStep}\n\nTreść błędu: ${innerErr.message || innerErr}`)
        throw innerErr // Przerywamy pętlę po pierwszym krytycznym błędzie, żeby zobaczyć powód
      }
    }

    authorName.value = ''
    if (fileInput.value) fileInput.value.value = ''
    await fetchPhotos()
  } catch (err: any) {
    alert(`Zatrzymano operację. Wysłano ${successCount} zdjęć.`)
  } finally {
    uploading.value = false
    uploadProgress.value = ''
  }
}
// --- LOGIKA LIGHTBOXA ---
const openLightbox = (index: number) => {
  currentPhotoIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const nextPhoto = () => {
  if (photos.value.length > 0) {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.value.length
  }
}

const prevPhoto = () => {
  if (photos.value.length > 0) {
    currentPhotoIndex.value = (currentPhotoIndex.value - 1 + photos.value.length) % photos.value.length
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
}

onMounted(() => {
  getOrCreateUserId()
  fetchPhotos()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] py-8 sm:py-16 px-4 text-stone-800">
    <div class="max-w-5xl mx-auto">
      
      <!-- PRZYCISK POWROTU -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-900 mb-8 transition-colors"
      >
        <span>&larr;</span> Wróć na stronę główną
      </NuxtLink>

      <!-- NAGŁÓWEK -->
      <div class="text-center mb-10 sm:mb-14">
        <h1 class="font-serif text-3xl sm:text-5xl text-stone-800 mb-3 tracking-wide">
          Galeria Wspomnień
        </h1>
        <p class="text-stone-500 text-sm sm:text-base font-light max-w-md mx-auto">
          Podziel się z nami swoimi zdjęciami z tego wyjątkowego dnia! 📸
        </p>
      </div>

      <!-- KAFELEK WGRYWANIA ZDJĘCIA -->
      <div class="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80 mb-12 sm:mb-16">
        <h2 class="font-serif text-xl sm:text-2xl text-stone-800 mb-4 text-center">
          Dodaj swoje zdjęcia
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-xs uppercase tracking-wider text-stone-500 font-medium mb-1 text-left">
              Twoje imię / podpis
            </label>
            <input 
              v-model="authorName"
              type="text" 
              placeholder="np. Ania i Tomek"
              class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
            />
          </div>

          <div>
            <!-- PRZYCISK Z ATRYBUTEM multiple -->
            <input 
              ref="fileInput"
              type="file" 
              accept="image/jpeg,image/png,image/webp,image/heic"
              multiple
              class="hidden" 
              id="photo-upload"
              @change="handleFileUpload"
              :disabled="uploading"
            />
            
            <label 
              for="photo-upload"
              class="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': uploading }"
            >
              <svg v-if="!uploading" class="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>

              <svg v-else class="animate-spin h-5 w-5 text-amber-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>

              <span>{{ uploading ? uploadProgress : 'Wybierz zdjęcia (można kilka!) / Zrób fotkę 🔥' }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- SIATKA ZDJĘĆ -->
      <div v-if="loading" class="text-center py-12 text-stone-400">
        Ładowanie zdjęć...
      </div>

      <div v-else-if="photos.length === 0" class="text-center py-12 text-stone-400 font-light">
        Brak zdjęć w galerii. Bądź pierwszy i wrzuć fotkę! 📸
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Zmiana: v-for wyciąga też 'index', żeby działał nam lightbox -->
        <div 
          v-for="(photo, index) in photos" 
          :key="photo.id"
          class="bg-white rounded-2xl overflow-hidden shadow-md border border-stone-200/60 flex flex-col transition-all hover:shadow-lg"
        >
          <!-- ZDJĘCIE (dodano akcje i podświetlenie do kliknięcia) -->
          <div 
            class="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
            @click="openLightbox(index)"
          >
            <img 
              :src="photo.url" 
              :alt="`Zdjęcie od ${photo.author}`"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            
            <!-- Ikonka nakładki z lupką dla lepszego efektu wizualnego po najechaniu (opcjonalnie) -->
            <div class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span class="bg-white/90 text-stone-800 p-3 rounded-full shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              </span>
            </div>
          </div>

          <!-- PASEK REAKCJI -->
          <div class="p-3 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between relative">
            
            <div 
              class="relative group"
              @mouseleave="activePickerId = null"
            >
              <div 
                class="absolute bottom-full left-0 pb-2 transition-all duration-200 z-30 origin-bottom-left"
                :class="(activePickerId === photo.id) 
                  ? 'opacity-100 scale-100 pointer-events-auto' 
                  : 'opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto'"
              >
                <div class="p-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-stone-200 flex items-center gap-1">
                  <button
                    v-for="emoji in AVAILABLE_REACTIONS"
                    :key="emoji"
                    @click="handleReaction(photo, emoji)"
                    class="w-8 h-8 flex items-center justify-center text-lg hover:scale-125 transition-transform duration-150 rounded-full hover:bg-stone-100"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>

              <button 
                @click="activePickerId = activePickerId === photo.id ? null : photo.id"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border"
                :class="photo.userReaction 
                  ? 'bg-amber-100 border-amber-300 text-stone-900 shadow-sm' 
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'"
              >
                <span>{{ photo.userReaction || '❤️' }}</span>
                <span>{{ photo.userReaction ? 'Twoja reakcja' : 'Zareaguj' }}</span>
              </button>
            </div>

            <!-- LICZNIKI REAKCJI Z DODANYM TOOLTIPEM -->
            <div class="flex items-center gap-1 text-xs text-stone-500 relative group/tooltip cursor-help">
              <template v-if="getTotalReactions(photo.reactions) > 0">
                <div class="flex items-center -space-x-1">
                  <span 
                    v-for="(count, emoji) in photo.reactions" 
                    :key="emoji"
                    v-show="count > 0"
                    class="text-xs"
                  >
                    {{ emoji }}
                  </span>
                </div>
                <span class="font-medium text-stone-700 ml-1">
                  {{ getTotalReactions(photo.reactions) }}
                </span>

                <!-- TOOLTIP SZCZEGÓŁOWY (pokazuje się tylko po najechaniu) -->
                <div class="absolute bottom-full right-0 mb-2 w-max bg-stone-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 pointer-events-none transition-all duration-200 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 z-10 shadow-lg flex flex-col gap-1.5">
                  <div 
                    v-for="(count, emoji) in photo.reactions" 
                    :key="`tt-${emoji}`" 
                    v-show="count > 0" 
                    class="flex items-center justify-between gap-4"
                  >
                    <span class="text-sm">{{ emoji }}</span>
                    <span class="font-bold">{{ count }}</span>
                  </div>
                  <!-- Mały trójkącik pod tooltipem -->
                  <div class="absolute top-full right-3 -mt-1 w-2 h-2 bg-stone-800 rotate-45"></div>
                </div>
              </template>
              <span v-else class="text-[11px] text-stone-400 font-light cursor-default">
                Bądź pierwszy!
              </span>
            </div>

          </div>

          <!-- PODPIS -->
          <div class="p-4 flex items-center justify-between text-xs text-stone-600 bg-white">
            <span class="font-medium text-stone-900 truncate">
              👤 {{ photo.author }}
            </span>
            <span class="text-stone-400 font-light shrink-0">
              {{ new Date(photo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- NAKŁADKA PEŁNOEKRANOWA (LIGHTBOX) -->
    <Teleport to="body">
      <div 
        v-if="lightboxOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        @click="closeLightbox"
      >
        <!-- Zamknij (X) -->
        <button 
          class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-stone-400 hover:text-white transition-colors z-[110]"
          @click.stop="closeLightbox"
        >
          <svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Poprzednie zdjęcie -->
        <button 
          v-if="photos.length > 1" 
          class="absolute left-2 sm:left-8 p-3 text-stone-400 hover:text-white transition-all transform hover:scale-110 z-[110]"
          @click.stop="prevPhoto"
        >
          <svg class="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <!-- Główne powiększone zdjęcie -->
        <img 
          v-if="photos[currentPhotoIndex]"
          :src="photos[currentPhotoIndex].url" 
          class="max-h-[90vh] max-w-[90vw] object-contain select-none shadow-2xl rounded-sm transition-transform duration-300"
          @click.stop
        />

        <!-- Następne zdjęcie -->
        <button 
          v-if="photos.length > 1" 
          class="absolute right-2 sm:right-8 p-3 text-stone-400 hover:text-white transition-all transform hover:scale-110 z-[110]"
          @click.stop="nextPhoto"
        >
          <svg class="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>