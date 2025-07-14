<template>
  <nav class="flex items-center justify-between bg-teltonika-blue px-20 py-3">
    <img class="h-auto w-100 object-contain" src="../../assets/Logo.png" alt="Logo" />
    <div class="flex space-x-40 text-2xl text-white font-semibold">
      <RouterLink to="/" class="hover:text-gray-300 transition-colors">Kontaktai</RouterLink>
      <RouterLink to="/companies" class="hover:text-gray-300 transition-colors">Įmonės</RouterLink>
      <RouterLink to="/structure" class="hover:text-gray-300 transition-colors"
        >Struktūra</RouterLink
      >
      <RouterLink to="/admin" class="hover:text-gray-300 transition-colors">Paskyros</RouterLink>
      <RouterLink to="/login" class="hover:text-gray-300 transition-colors">Prisijungti</RouterLink>
    </div>
  </nav>
</template>
