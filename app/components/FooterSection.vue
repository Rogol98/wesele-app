<template>
  <footer class="relative z-10 w-full bg-[#fdfbf7] border-t border-stone-200/60 py-16 px-4 text-center">
    <div class="max-w-2xl mx-auto flex flex-col items-center">
      
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