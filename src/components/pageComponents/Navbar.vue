<template>
  <nav class="flex bg-blue-900 max-h-25">
    <img class="h-auto w-auto object-contain object-left" src="../../../public/Logo.png" />
    <div class="flex">
      <RouterLink to="/" class="font-bold rounded-lg px-3 py-2 text-lg text-white m-7"
        >Kontaktai</RouterLink
      >
      <RouterLink to="/companies" class="font-bold text-white text-lg rounded-lg px-3 py-2 m-7"
        >Įmonės</RouterLink
      >
      <RouterLink to="/structure" class="font-bold text-lg text-white rounded-lg px-3 py-2 m-7"
        >Struktūra</RouterLink
      >
      <RouterLink to="/admin" class="font-bold text-lg rounded-lg text-white px-3 py-2 m-7"
        >Paskyros</RouterLink
      >
      <RouterLink to="/login" class="font-bold text-lg text-lgrounded-lg text-white px-3 py-2 m-7"
        >Prisijungti</RouterLink
      >
    </div>
  </nav>
</template>
