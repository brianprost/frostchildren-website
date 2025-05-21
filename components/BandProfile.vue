<script setup>
const bandName = "Frost Children";
</script>

<template>
  <div class="overflow-hidden">
    <div class="md:flex">
      <div class="p-4 w-full">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <h1 class="text-3xl font-bold -ml-2">{{ bandName }}</h1>
          <div class="text-sm sm:text-base flex flex-wrap items-center gap-x-1.5 text-center">
            <span>text</span>
            <a href="tel:4573877488" class="whitespace-nowrap">
              <span class="hover:text-sister-red hover:underline">(457) 387-7488</span>
            </a>
            <span class="whitespace-nowrap">for a surprise</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

