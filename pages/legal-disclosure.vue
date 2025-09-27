<template>
  <div class="min-h-screen bg-gray-50">
    <LegalDisclosure :legal-data="legalDisclosureData" />
  </div>
</template>

<script setup lang="ts">
import { legalDisclosureData } from '~/data/legal-disclosure'

// Page metadata for SEO and social sharing
useHead({
  title: '特定商取引法に基づく表記 | 高橋智彦ポートフォリオ',
  meta: [
    {
      name: 'description',
      content: '高橋智彦のポートフォリオサイトにおける特定商取引法に基づく表記。事業者情報、連絡先、返品・交換規約、決済方法等の法的表示事項。'
    },
    {
      name: 'keywords',
      content: '特定商取引法, 法的表示, 事業者情報, 高橋智彦, ポートフォリオ, 連絡先'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Open Graph / Facebook
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:title',
      content: '特定商取引法に基づく表記 | 高橋智彦ポートフォリオ'
    },
    {
      property: 'og:description',
      content: '高橋智彦のポートフォリオサイトにおける特定商取引法に基づく表記。事業者情報、連絡先、返品・交換規約、決済方法等の法的表示事項。'
    },
    {
      property: 'og:locale',
      content: 'ja_JP'
    },
    // Twitter
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:title',
      content: '特定商取引法に基づく表記 | 高橋智彦ポートフォリオ'
    },
    {
      name: 'twitter:description',
      content: '高橋智彦のポートフォリオサイトにおける特定商取引法に基づく表記。事業者情報、連絡先、返品・交換規約、決済方法等の法的表示事項。'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.tomohiko.io/legal-disclosure'
    }
  ]
})

// Define page route meta
definePageMeta({
  layout: 'default'
})
</script>

<style>
/* Ensure proper font rendering for Japanese text */
body {
  font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', 'MS PGothic', sans-serif;
}

/* Override any global styles that might interfere with legal page */
.legal-disclosure * {
  box-sizing: border-box;
}
</style>