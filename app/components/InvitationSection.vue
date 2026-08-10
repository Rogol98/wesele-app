<script setup lang="ts">
// Dane uroczystości
const weddingData = {
  date: '5 września 2026',
  time: '16:15',
  place: 'Kościół Miłosierdzia Bożego w Mszanie Dolnej',
  couple: 'Karol & Sandra'
}
</script>

<template>
  <section class="py-12 sm:py-20 px-4 flex justify-center items-center">
    <!-- Elegancki kafelek z cieniem i delikatną ramką -->
    <div class="bg-white max-w-2xl w-full p-8 sm:p-14 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 text-center flex flex-col items-center">
      
      <!-- Ozdobny motyw roślinny (SVG) -->
      <div class="w-16 h-16 mb-6 text-[#c89666] opacity-90">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 85 C 50 60, 50 40, 50 15" />
          <path d="M50 70 C 40 65, 30 65, 25 58 C 30 50, 42 58, 50 70" />
          <path d="M50 70 C 60 65, 70 65, 75 58 C 70 50, 58 58, 50 70" />
          <path d="M50 50 C 38 45, 28 42, 22 33 C 30 27, 40 36, 50 50" />
          <path d="M50 50 C 62 45, 72 42, 78 33 C 70 27, 60 36, 50 50" />
          <path d="M50 30 C 42 22, 35 20, 32 12 C 40 8, 46 16, 50 30" />
          <path d="M50 30 C 58 22, 65 20, 68 12 C 60 8, 54 16, 50 30" />
        </svg>
      </div>

      <!-- Nagłówek -->
      <h2 class="font-serif text-3xl sm:text-5xl text-stone-700 mb-6 font-normal tracking-wide">
        Bądźcie z nami!
      </h2>

      <p class="text-stone-600 text-sm sm:text-base mb-6 font-light">
        Z radością zapraszamy na naszą uroczystość!
      </p>

      <!-- Sekcja ze szczegółami (Data / Godzina / Miejsce) -->
      <div class="space-y-2 text-stone-700 text-sm sm:text-base mb-8 leading-relaxed">
        <p><span class="font-semibold text-stone-800">Data:</span> {{ weddingData.date }}</p>
        <p><span class="font-semibold text-stone-800">Godzina:</span> {{ weddingData.time }}</p>
        <p><span class="font-semibold text-stone-800">Miejsce:</span> {{ weddingData.place }}</p>
      </div>

      <!-- Treść zaproszenia -->
      <div class="space-y-3 text-stone-600 text-xs sm:text-sm font-light max-w-lg mb-8 leading-relaxed">
        <p>Będzie nam bardzo miło spędzić z wami ten dzień</p>
        <p>Z góry dziękujemy i z niecierpliwością czekamy na wspólnie spędzony czas!</p>
      </div>

      <!-- Kaligraficzny podpis -->
      <p class="font-script text-4xl sm:text-6xl text-stone-700 pt-2">
        {{ weddingData.couple }}
      </p>

    </div>
  </section>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}

.font-script {
  font-family: 'Great Vibes', cursive;
}
</style>