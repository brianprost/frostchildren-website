<template>
  <div class="bg-white shadow rounded-md overflow-hidden mt-6">
    <div class="section-header">
      <span class="transform rotate-90 inline-flex mr-2">▼</span>
      Latest Updates
    </div>
    
    <div class="p-4">
      <div v-for="(update, index) in updates" :key="index" class="feed-item">
        <div class="flex">
          <div class="w-10 h-10 flex-shrink-0">
            <div v-if="update.type === 'video'" class="w-8 h-8 bg-sister-red-lighter text-white flex items-center justify-center rounded">
              🎬
            </div>
            <div v-else-if="update.type === 'event'" class="w-8 h-8 bg-sister-red-lighter text-white flex items-center justify-center rounded">
              📅
            </div>
            <div v-else-if="update.type === 'photo'" class="w-8 h-8 bg-sister-red-lighter text-white flex items-center justify-center rounded">
              📷
            </div>
            <div v-else class="w-8 h-8 bg-sister-red-lighter text-white flex items-center justify-center rounded">
              📢
            </div>
          </div>
          
          <div class="ml-2">
            <p class="text-gray-800">
              <span class="font-semibold">{{ bandName }}</span> 
              {{ update.action }}
            </p>
            
            <div v-if="update.type === 'video'" class="mt-2">
              <h4 class="font-semibold">{{ update.title }}</h4>
              <p class="text-sm text-gray-600 mb-2">{{ update.description }}</p>
              <div class="relative w-full bg-black aspect-video rounded overflow-hidden group">
                <img :src="update.thumbnail" :alt="update.title" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                  <div class="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                    <div class="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-sister-red border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="update.type === 'photo'" class="mt-2 grid grid-cols-3 gap-1">
              <img 
                v-for="(img, i) in update.images" 
                :key="i" 
                :src="img" 
                :alt="`Gallery image ${i+1}`" 
                class="w-full aspect-square object-cover rounded hover:opacity-90 transition-opacity duration-200"
              />
            </div>
            
            <div class="mt-2 flex items-center space-x-2">
              <button class="share-button text-sm">
                Share
              </button>
              <span class="text-xs text-gray-500">{{ update.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const bandName = "Frost Children";

const updates = [
  {
    type: 'video',
    action: 'posted a new music video.',
    title: 'Stellar Dreams - Official Music Video',
    description: 'Our latest single from the upcoming album "Cosmic Illusions"',
    thumbnail: 'https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    time: '2 days ago'
  },
  {
    type: 'event',
    action: 'announced a new tour date in Los Angeles.',
    time: '4 days ago'
  },
  {
    type: 'photo',
    action: 'added new studio session photos.',
    images: [
      'https://images.pexels.com/photos/4932184/pexels-photo-4932184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    time: '1 week ago'
  }
]
</script>

<style scoped>
.border-l-12 {
  border-left-width: 12px;
}
</style>