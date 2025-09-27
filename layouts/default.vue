<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-auto">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8">
          <!-- About Section -->
          <div>
            <h3 class="text-lg font-semibold mb-4">高橋智彦</h3>
            <p class="text-gray-400 text-sm">
              魚とお茶と富士山と車と新しいもの好きエンジニア
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Links</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="/" class="text-gray-400 hover:text-white transition-colors">
                  ホーム
                </a>
              </li>
              <li>
                <a href="https://github.com/kter" target="_blank" class="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://qiita.com/kter" target="_blank" class="text-gray-400 hover:text-white transition-colors">
                  Qiita
                </a>
              </li>
              <li>
                <a href="mailto:takahashi@tomohiko.io" class="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal Section -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Legal</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink
                  to="/legal-disclosure"
                  class="text-gray-400 hover:text-white transition-colors"
                  :aria-label="'特定商取引法に基づく表記ページへ移動'"
                >
                  特定商取引法に基づく表記
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 高橋智彦 (Takahashi Tomohiko). All rights reserved.
            </p>
            <div class="text-gray-400 text-sm">
              <NuxtLink
                to="/legal-disclosure"
                class="hover:text-white transition-colors underline"
              >
                通信販売に関する表示事項
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Footer component logic
</script>

<style scoped>
/* Ensure footer stays at bottom */
.container {
  max-width: 1200px;
}

/* Focus styles for accessibility */
a:focus {
  @apply outline-2 outline-offset-2 outline-blue-500;
}

/* Print styles - hide footer in print */
@media print {
  footer {
    display: none;
  }
}
</style>