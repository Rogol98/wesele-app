<script setup lang="ts">
interface ScheduleItem {
  time: string
  title: string
  icon: 'wishes' | 'food' | 'castle' | 'cake' | 'game' | 'photo' | 'dance' | 'night'
}

const schedule: ScheduleItem[] = [
  { time: '17:30', title: 'Życzenia', icon: 'wishes' },
  { time: '18:00', title: 'Obiad', icon: 'food' },
  { time: '18:00 – 22:00', title: 'Zamek dmuchany', icon: 'castle' },
  { time: '19:00', title: 'Tort', icon: 'cake' },
  { time: '21:30', title: 'Drugie danie', icon: 'food' },
  { time: '22:00', title: 'Kahoot! Państwo Młodzi edition', icon: 'game' },
  { time: '23:00', title: 'Wspólne zdjęcie z zimnymi ogniami', icon: 'photo' },
  { time: '00:00', title: '(Zu)Zumba', icon: 'dance' },
  { time: '00:30', title: 'Trzecie danie', icon: 'food' },
  { time: '02:30', title: 'Czwarte danie', icon: 'night' },
  { time: '04:00', title: 'Piąte danie', icon: 'night' }
]
</script>

<template>
  <section class="relative z-10 w-full bg-[#fdfbf7] py-16 sm:py-24 px-4 shadow-[0_-20px_30px_rgba(0,0,0,0.03)]">
    <div class="max-w-4xl mx-auto">
      
      <!-- Nagłówek -->
      <div class="text-center mb-16 sm:mb-20">
        <h2 class="font-serif text-3xl sm:text-5xl text-stone-800 mb-3 tracking-wide">
          Plan Uroczystości
        </h2>
        <p class="text-stone-500 text-sm sm:text-base font-light">
          Harmonogram naszego wyjątkowego dnia
        </p>
      </div>

      <!-- Kontener osi czasu -->
      <div class="relative">
        
        <!-- PIONOWA OŚ GŁÓWNA -->
        <div class="absolute top-3 bottom-3 left-6 md:left-1/2 w-[1px] bg-stone-400 -translate-x-1/2"></div>

        <!-- Lista wydarzeń -->
        <div class="space-y-10 sm:space-y-12">
          <div 
            v-for="(item, index) in schedule" 
            :key="index"
            class="relative flex items-center w-full"
          >
            <!-- STRONA WYDARZENIA -->
            <div 
              class="flex items-center w-full md:w-1/2"
              :class="index % 2 === 0 ? 'md:mr-auto md:justify-end' : 'md:ml-auto md:justify-start'"
            >
              <!-- POZIOMA KRESKA (GAŁĄZKA) -->
              <div 
                class="h-[1px] bg-stone-400 shrink-0"
                :class="index % 2 === 0 ? 'order-1 md:order-3 w-6 md:w-12' : 'order-1 w-6 md:w-12'"
              ></div>

              <!-- IKONKA -->
              <div 
                class="w-10 h-10 sm:w-12 sm:h-12 shrink-0 text-stone-800 flex items-center justify-center"
                :class="index % 2 === 0 ? 'order-2 md:order-2 ml-2 md:ml-0 mr-3 md:mr-4' : 'order-2 ml-2 md:ml-4 mr-3 sm:mr-4'"
              >
                <!-- 1. Toast / Życzenia -->
                <svg v-if="item.icon === 'wishes'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <path d="M18 16 L28 32 L28 48 M20 48 L36 48" />
                  <path d="M18 16 C12 24 22 30 28 32 C34 30 44 24 38 16 Z" />
                  <path d="M46 16 L36 32 L36 48 M28 48 L44 48" />
                  <path d="M46 16 C40 24 50 30 56 32 C62 30 72 24 66 16 Z" />
                </svg>

                <!-- 2. Obiad / Dania -->
                <svg v-else-if="item.icon === 'food'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <circle cx="32" cy="32" r="14" />
                  <circle cx="32" cy="32" r="7" />
                  <path d="M14 20 V44 M14 20 C14 26 18 28 18 34 V44 M18 20 V28" />
                  <path d="M50 20 V44 C50 44 46 36 46 28 V20 Z" />
                </svg>

                <!-- 3. Zamek Dmuchany -->
                <svg v-else-if="item.icon === 'castle'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <path d="M14 52 H50 V28 L40 20 L32 28 L24 20 L14 28 Z" />
                  <path d="M26 52 V38 H38 V52" />
                  <path d="M14 28 H50 M24 20 V12 M40 20 V12" />
                </svg>

                <!-- 4. Tort -->
                <svg v-else-if="item.icon === 'cake'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <path d="M16 48 H48 V36 H16 Z M20 36 H44 V26 H20 Z M24 26 H40 V18 H24 Z" />
                  <path d="M32 18 V12" />
                  <path d="M12 52 H52" />
                </svg>

                <!-- 5. Kahoot! / Gra -->
                <svg v-else-if="item.icon === 'game'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <rect x="14" y="22" width="36" height="22" rx="4" />
                  <path d="M22 33 H28 M25 30 V36" />
                  <circle cx="40" cy="31" r="1.5" fill="currentColor" />
                  <circle cx="44" cy="35" r="1.5" fill="currentColor" />
                </svg>

                <!-- 6. Zdjęcie / Zimne ognie -->
                <svg v-else-if="item.icon === 'photo'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <path d="M12 24 H52 V48 H12 Z" />
                  <circle cx="32" cy="36" r="7" />
                  <path d="M22 24 L26 18 H38 L42 24" />
                </svg>

                <!-- 7. Taniec / Zumba -->
                <svg v-else-if="item.icon === 'dance'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <path d="M22 48 L28 32 L36 36 L42 50" />
                  <path d="M20 26 L30 22 L40 28" />
                  <circle cx="32" cy="14" r="4" />
                </svg>

                <!-- 8. Nocne dania -->
                <svg v-else-if="item.icon === 'night'" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" class="w-9 h-9">
                  <path d="M18 42 C18 30 26 24 32 24 C38 24 46 30 46 42 Z" />
                  <path d="M14 46 H50" />
                  <path d="M32 24 V18" />
                </svg>
              </div>

              <!-- OPIS (Grajmy symetrią: md:flex-row-reverse dla lewej strony, md:flex-row dla prawej) -->
              <div 
                class="flex flex-col md:items-baseline md:gap-3"
                :class="index % 2 === 0 ? 'order-3 md:order-1 text-left md:text-right md:flex-row-reverse' : 'order-3 text-left md:flex-row'"
              >
                <span class="font-bold text-stone-900 text-sm sm:text-base tracking-wider shrink-0">
                  {{ item.time }}
                </span>
                <span class="font-serif text-xs sm:text-sm text-stone-700 uppercase tracking-widest leading-tight">
                  {{ item.title }}
                </span>
              </div>

            </div>

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