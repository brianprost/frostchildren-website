<template>
  <div class="min-h-screen bg-sister-bg">
    
    
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false);
</script>