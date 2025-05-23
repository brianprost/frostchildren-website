<script setup>
import { ref } from 'vue';

const showMerchDialog = ref(false);

const links = [
  { label: 'Music', url: 'https://songwhip.com/frostchildren' },
  { label: "Merch", url: null, action: () => showMerchDialog.value = true },
];

const navigateToStore = (url) => {
  window.open(url, '_blank');
  showMerchDialog.value = false;
};
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
            <NuxtLink 
              v-if="link.url" 
              :to="link.url" 
              class="py-1 text-sm profile-link"
            >
              {{ link.label }}
            </NuxtLink>
            <a 
              v-else 
              href="#" 
              @click.prevent="link.action" 
              class="py-1 text-sm profile-link"
            >
              {{ link.label }}
            </a>
            <div v-if="index < links.length - 1" class="border-b border-gray-200"></div>
          </li>
        </ul>
      </nav>
      

    </div>
  </div>
  
  <!-- Merchandise Store Selection Dialog -->
  <div v-if="showMerchDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Select Store</h3>
      <p class="text-sm text-gray-600 mb-4">Please select your preferred store based on your location:</p>
      
      <div class="grid grid-cols-2 gap-4">
        <button 
          @click="navigateToStore('https://frost-children.myshopify.com/')"
          class="bg-fb-red hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium"
        >
          US Store
        </button>
        <button 
          @click="navigateToStore('https://stores.allotment.pro/frost-children/')"
          class="bg-fb-red hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium"
        >
          EU/UK Store
        </button>
      </div>
      
      <button 
        @click="showMerchDialog = false"
        class="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm py-1"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
.bg-fb-red {
  background-color: #B22222;
}
</style>

