<script setup>
const links = [
  { label: 'Music', url: 'https://songwhip.com/frostchildren' },
  { label: "Merch (us)", url: "https://frost-children.myshopify.com/" },
  { label: "Merch (eu/uk)", url: "https://stores.allotment.pro/frost-children/" },
  { label: 'Newsletter', url: 'https://digital.umusic.com/frostchildren-signup' },
  { label: 'Discord', url: 'https://discord.gg/qZn6BqJXej' },
  { label: 'Patreon', url: 'https://www.patreon.com/FROSTCHILDREN907' },
]
</script>

<template>
  <div>
    <img 
      src="/lulu-angel.jpeg" 
      alt="Lulu and Angel Prost of Frost Children"
      class="w-full aspect-square object-cover rounded-md shadow-md hover:opacity-95 transition-opacity duration-300 mb-4"
    />
    
    <div class="overflow-hidden">      
      <nav class="py-0.5">
        <ul>
          <li v-for="(link, index) in links" :key="index">
            <NuxtLink :to="link.url" class="py-1 text-sm profile-link">
              {{ link.label }}
            </NuxtLink>
            <div v-if="index < links.length - 1" class="border-b border-gray-200"></div>
          </li>
        </ul>
      </nav>
      
      <div class="mt-4 section-header bg-fb-red p-2 text-white font-medium text-sm flex items-center">
        <span class="transform inline-flex mr-2">▼</span>
        Upcoming release
      </div>
        <div class="flex items-center p-3">
          <img 
            src="/sister-cover.png" 
            alt="Album Cover" 
            class="w-12 h-12 object-cover rounded"
          />
          <div class="ml-3">
            <h4 class="font-semibold text-sm">Sister</h4>
            <p class="text-xs text-gray-600 mt-0.5">Coming: August 2025</p>
            <a href="https://songwhip.com/frostchildren" target="_blank" class="mt-1 text-xs hover:underline font-medium">
              Pre-save now (i hate this fucking term)
            </a>
          </div>
      </div>
    </div>
  </div>
</template>

