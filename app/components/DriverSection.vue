<script setup lang="ts">
const driver = {
  name: 'Daniel',
  availableFrom: '21:00',
  phone: '506 048 158'
}
</script>

<template>
  <section class="relative z-10 w-full bg-[#fdfbf7] pb-16 sm:pb-24 px-4">
    <div class="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-stone-200/80 text-center flex flex-col items-center">
      
      <!-- IKONKA SAMOCHODU -->
      <div class="w-16 h-16 mb-5 text-[#c89666] flex items-center justify-center bg-amber-50/80 rounded-2xl border border-amber-100">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" class="w-10 h-10">
          <path d="M12 40 L16 26 C17 22 20 20 25 20 H39 C44 20 47 22 48 26 L52 40" />
          <path d="M8 40 H56 V48 C56 50 54 52 52 52 H12 C10 52 8 50 8 48 Z" />
          <circle cx="18" cy="46" r="3" fill="currentColor" />
          <circle cx="46" cy="46" r="3" fill="currentColor" />
          <path d="M22 28 H42" />
        </svg>
      </div>

      <!-- NAGŁÓWEK -->
      <h2 class="font-serif text-3xl sm:text-4xl text-stone-800 mb-2">
        Kierowca Weselny
      </h2>
      <p class="text-stone-500 text-sm sm:text-base font-light mb-6">
        Bezpieczny powrót do miejsca noclegu
      </p>

      <!-- GODZINA DOSTĘPNOŚCI (BADGE) -->
      <div class="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6">
        <span>🚘 Dostępny od godziny {{ driver.availableFrom }}</span>
      </div>

      <!-- INFORMACJA -->
      <p class="text-stone-700 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
        Do Waszej dyspozycji będzie nasz kierowca <strong class="text-stone-900 font-semibold">{{ driver.name }}</strong>, który chętnie odwiezie Was do domu czy też miejsca noclegu.
      </p>

      <!-- PRZYCISK DZWOŃ (Dostosowany do ekranów smartfonów) -->
      <a 
        :href="`tel:${driver.phone.replace(/\s+/g, '')}`" 
        class="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-4 sm:px-8 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 text-amber-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span class="text-xs sm:text-base font-medium tracking-wide">
          Zadzwoń do Daniela: <span class="whitespace-nowrap font-semibold text-amber-200">{{ driver.phone }}</span>
        </span>
      </a>

    </div>
  </section>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>