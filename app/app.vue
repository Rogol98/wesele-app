<template>
  <div class="min-h-screen font-sans bg-amber-50/20 text-gray-800 antialiased">
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400;500&family=Playfair Display:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

/* Płynne przewijanie i stałe tło pod pasek */
html {
  scroll-behavior: smooth;
  overflow-y: scroll;
}

body {
  font-family: 'Montserrat', sans-serif;
}

/* NOWOCZESNY STANDARD (Chrome 121+, Firefox, Edge, Safari) */
:root {
  scrollbar-color: #b8a388 #fdfbf7; /* [kolor suwaka] [kolor tła] */
  scrollbar-width: auto;
}

/* STYL DLA STARSZYCH PRZEGLĄDAREK WEBKIT */
::-webkit-scrollbar {
  width: 14px;
}

::-webkit-scrollbar-track {
  background: #fdfbf7;
}

::-webkit-scrollbar-thumb {
  background-color: #b8a388;
  border-radius: 8px;
  border: 3px solid #fdfbf7;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #968269;
}
</style>