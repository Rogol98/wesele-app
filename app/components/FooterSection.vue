<template>
  <footer class="relative z-10 w-full bg-[#fdfbf7] border-t border-stone-200/60 py-16 px-4 text-center">
    <div class="max-w-2xl mx-auto flex flex-col items-center">
      
      <!-- EASTER EGG: Podpowiedź do Kahoota -->
      <div class="relative group mb-12 sm:mb-16">
        <!-- Subtelna poświata z tyłu (rośnie przy najechaniu) -->
        <div class="absolute -inset-1 bg-gradient-to-r from-amber-200 to-orange-300 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        
        <!-- Główny kafelek podpowiedzi -->
        <div class="relative bg-white border border-orange-100/80 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-sm flex items-center gap-3 transform transition-transform duration-300 hover:scale-[1.02] cursor-default">
          <span class="text-xl sm:text-2xl animate-[bounce_2s_infinite]">🍊</span>
          <p class="text-orange-800 text-xs sm:text-sm font-medium tracking-wide">
            Psst! Odpowiedź na pytanie nr 7 w Kahootcie to <span class="font-bold">pomarańcza</span>!
          </p>
        </div>
      </div>

      <!-- Istniejąca treść stopki -->
      <p class="font-serif text-2xl sm:text-3xl text-stone-800 mb-2">
        Do zobaczenia!
      </p>
      <p class="text-stone-500 text-sm font-light mb-8">
        Nie możemy się doczekać, aż będziemy świętować razem z Wami.
      </p>

      <!-- Odnośnik na dole strony -->
      <NuxtLink 
        to="/galeria" 
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-800 hover:bg-stone-900 text-white text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg mb-12"
      >
        <span>PRZEJDŹ DO GALERII ZDJĘĆ</span>
        <span class="text-base">📸</span>
      </NuxtLink>

      <p class="font-script text-3xl sm:text-4xl text-stone-700">
        Sandra & Karol
      </p>
      
    </div>
  </footer>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
.font-script {
  font-family: 'Great Vibes', cursive;
}
</style>