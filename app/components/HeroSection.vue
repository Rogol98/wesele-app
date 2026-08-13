<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// --- KONFIGURACJA DANYCH ---
const names = 'Sandra & Karol'
const subtitle = 'BIERZEMY ŚLUB! 😮'
const targetDate = new Date('2026-09-05T16:00:00').getTime()

// --- LOGIKA ODLICZANIA ---
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let timerInterval: ReturnType<typeof setInterval> | null = null

const updateCountdown = () => {
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance < 0) {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  timeLeft.value = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  }
}

onMounted(() => {
  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <section 
    class="relative w-full h-screen flex flex-col justify-between items-center text-white text-center px-4 py-12
           bg-cover bg-center bg-no-repeat
           bg-[url('/wakacje_pion.png')] md:bg-[url('/wakacje_poziom.png')]"
  >
    <!-- Ciemny overlay dla czytelności tekstu -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[0.2px]"></div>

    <!-- Zawartość Hero (wyciągnięte do góry przez -translate-y-4) -->
    <div class="relative z-10 my-auto -translate-y-4 md:translate-y-3 flex flex-col items-center max-w-4xl w-full">      
      
      <!-- Subtitle -->
      <p class="tracking-[0.3em] text-sm sm:text-base uppercase mb-4 font-light drop-shadow">
        {{ subtitle }}
      </p>

      <!-- Imiona -->
      <h1 class="font-serif text-5xl sm:text-6xl md:text-7xl font-light mb-4 tracking-wide drop-shadow-md">
        {{ names }}
      </h1>

      <!-- Data -->
      <p class="font-serif text-xl sm:text-2xl italic mb-10 opacity-90 drop-shadow">
        5 Września 2026
      </p>

      <!-- Licznik Odliczania -->
      <div class="grid grid-cols-4 gap-4 sm:gap-8 max-w-md w-full mb-10">
        <div class="flex flex-col items-center">
          <span class="font-serif text-3xl sm:text-4xl font-light">{{ timeLeft.days }}</span>
          <span class="text-xs sm:text-sm tracking-widest uppercase mt-1 opacity-80">Dni</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-serif text-3xl sm:text-4xl font-light">{{ timeLeft.hours }}</span>
          <span class="text-xs sm:text-sm tracking-widest uppercase mt-1 opacity-80">Godziny</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-serif text-3xl sm:text-4xl font-light">{{ timeLeft.minutes }}</span>
          <span class="text-xs sm:text-sm tracking-widest uppercase mt-1 opacity-80">Minuty</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-serif text-3xl sm:text-4xl font-light">{{ timeLeft.seconds }}</span>
          <span class="text-xs sm:text-sm tracking-widest uppercase mt-1 opacity-80">Sekundy</span>
        </div>
      </div>

      <NuxtLink 
        to="/galeria" 
        class="px-5 sm:px-8 py-3.5 rounded-full border border-white/80 bg-white/10 hover:bg-white hover:text-gray-900 transition-all duration-300 text-xs sm:text-sm tracking-wider backdrop-blur-sm whitespace-nowrap"
      >
        ZROBIŁEŚ/AŚ FAJNE FOTY? WRZUĆ TUTAJ! 🔥
      </NuxtLink>

    </div>
  </section>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>