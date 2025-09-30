<script setup lang="ts">
import { useHead } from '#app';
import { onMounted } from 'vue';

// Load Ko-fi overlay widget script from CDN
useHead({
  script: [
    {
      src: 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js',
      defer: true,
    },
  ],
});

// Initialize Ko-fi widget after component is mounted
onMounted(() => {
  // Wait for Ko-fi script to load and initialize widget
  const initKofi = () => {
    // Check if Ko-fi widget is available
    if (typeof window.kofiWidgetOverlay !== 'undefined') {
      try {
        window.kofiWidgetOverlay.draw('kterr', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': '#00b9fe',
          'floating-chat.donateButton.text-color': '#fff'
        });
      } catch (error) {
        console.warn('Failed to initialize Ko-fi widget:', error);
      }
    } else {
      console.warn('Ko-fi widget failed to load. Donation button will not be available.');
    }
  };

  // Try to initialize immediately if script already loaded
  if (typeof window.kofiWidgetOverlay !== 'undefined') {
    initKofi();
  } else {
    // Otherwise wait for script to load
    setTimeout(initKofi, 1000);
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
