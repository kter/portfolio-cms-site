// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-02',
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/', '/legal-disclosure'],
      crawlLinks: true
    },
    output: {
      dir: 'dist',
      publicDir: 'dist/public'
    }
  },
  app: {
    head: {
      title: '高橋智彦のポートフォリオ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '魚とお茶と富士山と車と新しいもの好きエンジニア' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true }
})
