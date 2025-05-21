<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://widget.seated.com/app.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
<template>
  <section class="">
    <ClientOnly>
      <div
        id="seated-55fdf2c0"
        data-artist-id="0dd41d4d-c9b0-41a5-b3a1-49f5d9d810b1"
        data-css-version="2"
      ></div>

      <template #fallback>
        <p>Loading tour feed...</p>
      </template>
    </ClientOnly>
  </section>
</template>