<template>
  <section class="relative z-10 w-full bg-[url('/kahoot_background.png')] bg-cover bg-center bg-no-repeat pb-16 sm:pb-24 px-4 sm:pt-12 pt-8">
    <div class="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-200/80 text-center flex flex-col items-center">
      
      <!-- LOGO KAHOOTA -->
      <div class="mb-6 flex justify-center">
        <img src="/kahoot.png" alt="Kahoot!" class="h-14 sm:h-16 object-contain hover:scale-105 transition-transform duration-300" />
      </div>

      <!-- NAGŁÓWEK I CZAS -->
      <h2 class="font-serif text-3xl sm:text-4xl text-stone-800 mb-2 tracking-wide">
        Sprawdźcie swoją wiedzę!
      </h2>
      <div class="inline-flex items-center justify-center bg-amber-50 text-amber-800 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-amber-200">
        🕒 Start: orientacyjnie o 22:00
      </div>

      <!-- WIZUALNA INSTRUKCJA KROK PO KROKU (4 KOLUMNY) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl mb-10 text-stone-700">
        
        <!-- KROK 1 -->
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-2xl mb-3 shadow-sm border border-amber-100">
            📱
          </div>
          <p class="text-sm font-semibold text-stone-800">1. Zainstaluj apkę</p>
          <p class="text-xs text-stone-500 mt-1 mb-2">Najlepiej zrób to już teraz!</p>
          <div class="mt-auto flex flex-col w-full gap-2 px-2">
            <a href="https://apps.apple.com/app/kahoot-play-create-quizzes/id1131203560" target="_blank" rel="noopener noreferrer" class="text-[10px] bg-stone-800 hover:bg-stone-700 text-white py-1.5 px-2 rounded-lg transition-colors font-medium">
              Pobierz na iOS
            </a>
            <a href="https://play.google.com/store/apps/details?id=no.mobitroll.kahoot.android" target="_blank" rel="noopener noreferrer" class="text-[10px] bg-stone-800 hover:bg-stone-700 text-white py-1.5 px-2 rounded-lg transition-colors font-medium">
              Pobierz na Android
            </a>
          </div>
        </div>
        
        <!-- KROK 2 -->
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-2xl mb-3 shadow-sm border border-amber-100">
            🎭
          </div>
          <p class="text-sm font-semibold text-stone-800">2. Wybierz Nick</p>
          <p class="text-xs text-stone-500 mt-1">6 cyfrowy kod do gry podamy na sali. Koniecznie wpisz nick, po którym łatwo Cię rozpoznamy!</p>
        </div>
        
        <!-- KROK 3 -->
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-2xl mb-3 shadow-sm border border-amber-100">
            ⏱️
          </div>
          <p class="text-sm font-semibold text-stone-800">3. Zbieraj punkty</p>
          <p class="text-xs text-stone-500 mt-1">Czeka na Was 25 pytań. Liczy się poprawna odpowiedź, ale też i czas!</p>
        </div>

        <!-- KROK 4 -->
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-2xl mb-3 shadow-sm border border-amber-100">
            🏆
          </div>
          <p class="text-sm font-semibold text-stone-800">4. Zgarnij nagrodę</p>
          <p class="text-xs text-stone-500 mt-1">Jest o co walczyć🔥. Za zajęcie 1. miejsca przewidzieliśmy Nagrodę Główną!</p>
        </div>
      </div>

      <!-- TEKST ZACHĘCAJĄCY -->
      <p class="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg border-t border-stone-100 pt-6 mt-2">
        Pytania będą dotyczyć oczywiście <span class="font-semibold text-stone-800">Państwa Młodych</span>. Polecamy również zapoznać się z pozostałą treścią tej strony 😉
      </p>
      
    </div>
  </section>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>