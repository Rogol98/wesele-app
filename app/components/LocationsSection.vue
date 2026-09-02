<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface LocationCard {
  title: string
  subtitle: string
  time?: string
  breakfast?: string
  placeName: string
  address: string
  city: string
  googleMapsUrl: string
  mapEmbedUrl: string
  phone?: string
  website?: string
  bgImage: string
  type: 'rings' | 'cheers' | 'home' | 'hotel'
}

const locations: LocationCard[] = [
  {
    type: 'rings',
    title: 'Ślub',
    subtitle: 'Sobota, 5 Września 2026',
    time: '16:15 – 17:00',
    placeName: 'Kościół Miłosierdzia Bożego',
    address: 'plac św. Faustyny 1',
    city: '34-730 Mszana Dolna',
    googleMapsUrl: 'https://maps.google.com/?q=plac+sw.+Faustyny+1,+34-730+Mszana+Dolna',
    mapEmbedUrl: 'https://maps.google.com/maps?q=plac+sw.+Faustyny+1,+34-730+Mszana+Dolna&t=&z=15&ie=UTF8&iwloc=&output=embed',
    bgImage: '/kosciol.png'
  },
  {
    type: 'cheers',
    title: 'Wesele',
    subtitle: 'Sobota, 5 Września 2026',
    time: '17:30 – do oporu',
    placeName: 'Karcma nad Podołem',
    address: 'Poręba Wielka 662',
    city: '34-735 Poręba Wielka',
    googleMapsUrl: 'https://maps.google.com/?q=Poręba+Wielka+662,+34-735+Poręba+Wielka',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Por%C4%99ba+Wielka+662,+34-735+Por%C4%99ba+Wielka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    bgImage: '/karcma.png'
  },
  {
    type: 'home',
    title: 'Noclegi u Zapały',
    subtitle: 'Noclegi dla gości',
    breakfast: 'Śniadanie (Hotel Górski Raj): 8:00 – 10:00',
    placeName: 'U Zapały',
    address: 'Poręba Wielka 182',
    city: '34-735 Poręba Wielka',
    phone: '694 004 391',
    website: 'http://www.u-zapaly.pl/',
    googleMapsUrl: 'https://maps.google.com/?q=Poręba+Wielka+182,+34-735+Poręba+Wielka',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Por%C4%99ba+Wielka+182,+34-735+Por%C4%99ba+Wielka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    bgImage: '/zapala.png'
  },
  {
    type: 'hotel',
    title: 'Hotel Górski Raj',
    subtitle: 'Noclegi dla gości',
    breakfast: 'Śniadanie: 8:00 – 10:00',
    placeName: 'Górski Raj',
    address: 'Poręba Wielka 765',
    city: '34-735 Niedźwiedź',
    phone: '18 331 80 11',
    website: 'https://www.gorskiraj.com/',
    googleMapsUrl: 'https://maps.google.com/?q=Poręba+Wielka+765,+34-735+Niedźwiedź',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Por%C4%99ba+Wielka+765,+34-735+Nied%C5%BAwied%C5%BA&t=&z=15&ie=UTF8&iwloc=&output=embed',
    bgImage: '/gorski_raj.png'
  }
]

// LOGIKA ZMIANY TŁA PODCZAS PRZEWIJANIA
const activeIndex = ref(0)
const cardRefs = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardRefs.value[index] = el as HTMLElement
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'))
          if (!isNaN(index)) {
            activeIndex.value = index
          }
        }
      })
    },
    {
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.1
    }
  )

  cardRefs.value.forEach((card) => {
    if (card) observer?.observe(card)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <section class="relative w-full">
    
    <!-- NAGŁÓWEK SEKCJI (Wyciągnięty na czyste tło przed zdjęciami) -->
    <div class="pt-24 sm:pt-36 pb-12 sm:pb-16 text-center text-stone-800 px-4">
        <h2 class="font-serif text-3xl sm:text-5xl mb-3 font-normal tracking-wide">
        Lokalizacje & Dojazd
      </h2>
      <p class="text-stone-600 text-sm sm:text-base font-light">
        Przewijaj w dół, aby zobaczyć szczegóły i mapy dojazdu
      </p>
    </div>

    <!-- SEKCJA PRZEWIJANA ZE STICKY BACKGROUND -->
    <div class="relative w-full min-h-screen">
      
      <!-- STICKY BACKGROUND -->
      <div class="sticky top-0 h-screen w-full overflow-hidden -mb-[100vh] z-0">
        <div 
          v-for="(loc, idx) in locations" 
          :key="loc.title"
          class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          :class="activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'"
          :style="{ backgroundImage: 'url(' + loc.bgImage + ')' }"
        >
          <div class="absolute inset-0 bg-black/55 backdrop-blur-[2px]"></div>
        </div>
      </div>

      <!-- KARTY PRZEWIJANE -->
      <div class="relative z-10 max-w-3xl mx-auto px-4 pt-12 sm:pt-16 pb-28">
        <div class="space-y-28 sm:space-y-40">
          <div 
            v-for="(loc, index) in locations" 
            :key="index"
            :ref="(el) => setCardRef(el, index)"
            :data-index="index"
            class="bg-white/75 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-10 text-center flex flex-col items-center transition-all duration-500"
          >
            <!-- IKONKA -->
            <div class="w-14 h-14 mb-3 text-[#c89666] flex items-center justify-center">
              <svg v-if="loc.type === 'rings'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" class="w-10 h-10">
                <circle cx="26" cy="36" r="14" /><circle cx="38" cy="36" r="14" />
                <path d="M26 22 L24 16 L28 16 Z" /><path d="M38 22 L36 16 L40 16 Z" />
              </svg>
              <svg v-else-if="loc.type === 'cheers'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" class="w-10 h-10">
                <path d="M18 16 L28 32 L28 48 M20 48 L36 48" />
                <path d="M18 16 C12 24 22 30 28 32 C34 30 44 24 38 16 Z" />
                <path d="M46 16 L36 32 L36 48 M28 48 L44 48" />
                <path d="M46 16 C40 24 50 30 56 32 C62 30 72 24 66 16 Z" />
              </svg>
              <svg v-else-if="loc.type === 'home'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" class="w-10 h-10">
                <path d="M12 28 L32 12 L52 28 V50 A2 2 0 0 1 50 52 H14 A2 2 0 0 1 12 50 Z" />
                <path d="M26 52 V36 H38 V52" />
              </svg>
              <svg v-else-if="loc.type === 'hotel'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" class="w-10 h-10">
                <path d="M10 48 V20 A2 2 0 0 1 12 18 H52 A2 2 0 0 1 54 20 V48" />
                <path d="M6 48 H58" />
                <path d="M16 28 H24 V34 H16 Z M40 28 H48 V34 H40 Z" />
                <path d="M16 38 H24 V44 H16 Z M40 38 H48 V44 H40 Z" />
              </svg>
            </div>

            <!-- DANE KARTY -->
            <h3 class="font-serif text-3xl sm:text-4xl text-stone-800 mb-1">
              {{ loc.title }}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 mb-4 font-light">
              {{ loc.subtitle }}
            </p>

            <p v-if="loc.time" class="inline-block text-amber-900 bg-amber-100/90 font-semibold text-xs sm:text-sm px-4 py-1.5 rounded-full mb-4">
              ⏱️ {{ loc.time }}
            </p>

            <div class="text-stone-700 text-sm sm:text-base space-y-1 mb-6 mt-2">
              <p class="font-semibold text-stone-900 text-base sm:text-lg">{{ loc.placeName }}</p>
              <p>{{ loc.address }}</p>
              <p class="text-stone-500">{{ loc.city }}</p>
              
              <!-- INFORMACJA O ŚNIADANIU WTOPIANA W TEKST -->
              <p v-if="loc.breakfast" class="text-stone-600 font-medium pt-2">
                ☕ {{ loc.breakfast }}
              </p>

              <div v-if="loc.phone || loc.website" class="pt-3 flex flex-wrap justify-center gap-4 text-xs sm:text-sm border-t border-stone-200 mt-4">
                <p v-if="loc.phone">
                  📞 <span class="font-medium">Tel:</span> 
                  <a :href="`tel:${loc.phone.replace(/\s+/g, '')}`" class="hover:underline font-semibold text-stone-800">{{ loc.phone }}</a>
                </p>
                <p v-if="loc.website">
                  🌐 <a :href="loc.website" target="_blank" rel="noopener" class="text-amber-800 hover:underline font-medium">Strona WWW &rarr;</a>
                </p>
              </div>
            </div>

            <!-- MAPA GOOGLE (IFRAME) -->
            <div class="w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-stone-200 shadow-inner mb-6 relative">
              <iframe
                :src="loc.mapEmbedUrl"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <!-- PRZYCISK NAWIGACJI -->
            <a 
              :href="loc.googleMapsUrl" 
              target="_blank" 
              rel="noopener"
              class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>Otwórz nawigację w Mapach Google</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>