<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2">
        <SideNavigation />
      </div>
      
      <!-- Center Column -->
      <div class="lg:col-span-4">
        <BandProfile />
        <TourFeed />
      </div>
    </div>
  </div>
</template>