// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-02',
  ssr: false,
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  app: {
    head: {
      title: '高橋智彦のポートフォリオ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '魚とお茶と富士山と車と新しいもの好きエンジニア' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true }
})
