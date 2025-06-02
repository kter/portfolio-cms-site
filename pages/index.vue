<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Hero Section -->
    <section class="section relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image Slideshow -->
      <div class="absolute inset-0 z-0">
        <div
          v-for="(image, index) in galleryImages"
          :key="image"
          class="absolute inset-0 transition-opacity duration-1000"
          :class="{ 'opacity-100': index === currentImageIndex, 'opacity-0': index !== currentImageIndex }"
        >
          <img 
            :src="image" 
            :alt="`Background ${index + 1}`" 
            class="w-full h-full object-cover"
          />
        </div>
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <!-- Content -->
      <div class="container relative z-20">
        <div class="text-center">
          <div class="mb-8">
            <div class="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full shadow-2xl border-4 border-white relative z-30 bg-white">
              <img 
                src="/profile.jpg" 
                alt="高橋智彦のプロフィール写真" 
                class="w-full h-full object-cover relative z-40"
                loading="eager"
              />
            </div>
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              高橋智彦のポートフォリオ
            </h1>
            <p class="text-xl md:text-2xl text-white max-w-3xl mx-auto drop-shadow-md mb-4">
              魚とお茶と富士山と車と新しいもの好きエンジニア
            </p>
            <p class="text-lg text-white text-opacity-90 drop-shadow-md">
              Takahashi Tomohiko
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Work Experience Section -->
    <section class="section">
      <div class="container">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Work Experience</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="card">
            <div class="h-2 bg-orange-500 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">AWS / Linux インフラエンジニア</h3>
            <p class="text-3xl font-bold text-orange-500 mb-2">10年以上</p>
            <p class="text-gray-600">クラウドインフラストラクチャの設計・構築・運用</p>
          </div>
          
          <div class="card">
            <div class="h-2 bg-red-500 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Ruby on Rails バックエンドエンジニア</h3>
            <p class="text-3xl font-bold text-red-500 mb-2">2年</p>
            <p class="text-gray-600">Webアプリケーションのバックエンド開発</p>
          </div>
          
          <div class="card">
            <div class="h-2 bg-purple-500 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">チームマネジメント</h3>
            <p class="text-3xl font-bold text-purple-500 mb-2">3年</p>
            <p class="text-gray-600">SREグループのマネジメント・プロジェクト管理等</p>
          </div>
          
          <div class="card">
            <div class="h-2 bg-blue-500 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">JavaScript / PHP フルスタックエンジニア</h3>
            <p class="text-3xl font-bold text-blue-500 mb-2">3年</p>
            <p class="text-gray-600">jQuery, SCSS / Laravel を用いたフロント・バックエンド開発</p>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <p class="text-gray-600 max-w-2xl mx-auto">
            詳しい経験は個別に返信させていただいております。ご連絡お待ちしております。
          </p>
        </div>
      </div>
    </section>

    <!-- Links Section -->
    <section class="section bg-white">
      <div class="container">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Links</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="https://qiita.com/kter" target="_blank" class="card hover:scale-105 transition-transform">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">Q</div>
              <div>
                <h3 class="font-bold text-gray-900">Qiita</h3>
                <p class="text-gray-600 text-sm">技術記事</p>
              </div>
            </div>
          </a>
          
          <a href="https://github.com/kter" target="_blank" class="card hover:scale-105 transition-transform">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold mr-4">G</div>
              <div>
                <h3 class="font-bold text-gray-900">GitHub</h3>
                <p class="text-gray-600 text-sm">ソースコード</p>
              </div>
            </div>
          </a>
          
          <a href="https://www.slideshare.net/tomohicotakahashi" target="_blank" class="card hover:scale-105 transition-transform">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">S</div>
              <div>
                <h3 class="font-bold text-gray-900">SlideShare</h3>
                <p class="text-gray-600 text-sm">プレゼンテーション</p>
              </div>
            </div>
          </a>
          
          <a href="https://www.linkedin.com/in/ttakahashi0806/" target="_blank" class="card hover:scale-105 transition-transform">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold mr-4">L</div>
              <div>
                <h3 class="font-bold text-gray-900">LinkedIn</h3>
                <p class="text-gray-600 text-sm">プロフィール</p>
              </div>
            </div>
          </a>
          
          <a href="https://blog.tomohiko.io/" target="_blank" class="card hover:scale-105 transition-transform">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">B</div>
              <div>
                <h3 class="font-bold text-gray-900">Blog</h3>
                <p class="text-gray-600 text-sm">個人ブログ</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="section">
      <div class="container">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">自作サービス</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a href="https://aws-icon-quiz.tomohiko.io/" target="_blank" class="card hover:scale-105 transition-transform">
            <div class="h-2 bg-orange-400 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">AWS アイコンクイズ</h3>
            <p class="text-gray-600">AWSサービスのアイコンを覚えるクイズアプリ</p>
          </a>
          
          <div class="card">
            <div class="h-2 bg-indigo-400 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">開発者ツール（仮）</h3>
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">開発中</span>
            </div>
            <p class="text-gray-600">開発者向け開発効率向上化ツール</p>
          </div>
          
          <div class="card opacity-60">
            <div class="h-2 bg-green-400 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900 line-through">一日一善</h3>
              <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">運用終了</span>
            </div>
            <p class="text-gray-600 line-through">日々の良い行いを記録するアプリ</p>
          </div>
          
          <div class="card opacity-60">
            <div class="h-2 bg-blue-400 rounded-t-lg -mt-6 -mx-6 mb-6"></div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900 line-through">ｼﾝｶﾝｾﾝｽｺﾞｸｶﾀｲｱｲｽbot</h3>
              <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">運用終了</span>
            </div>
            <p class="text-gray-600 line-through">新幹線のカタイアイスを紹介するTwitter Bot</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications Section -->
    <section class="section bg-white">
      <div class="container">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Certifications</h2>
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="card">
              <h3 class="text-lg font-bold text-gray-900 mb-4">基本情報・応用情報</h3>
              <ul class="space-y-2 text-gray-600">
                <li>• 基本情報技術者</li>
                <li>• 応用情報技術者</li>
              </ul>
            </div>
            
            <div class="card">
              <h3 class="text-lg font-bold text-gray-900 mb-4">AWS認定資格</h3>
              <ul class="space-y-2 text-gray-600">
                <li>• Solutions Architect - Associate</li>
                <li>• Developer - Associate</li>
                <li>• Solutions Architect - Professional</li>
                <li>• Security – Specialty</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section bg-gray-900 text-white">
      <div class="container">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Contact Me</h2>
        <div class="max-w-2xl mx-auto text-center">
          <div class="grid md:grid-cols-2 gap-8">
            <a href="mailto:takahashi@tomohiko.io" class="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-all">
              <div class="text-2xl mb-2">✉️</div>
              <h3 class="font-bold mb-2">Email</h3>
              <p class="text-gray-300">takahashi@tomohiko.io</p>
            </a>
            
            <a href="https://twitter.com/kter" target="_blank" class="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-all">
              <div class="text-2xl mb-2">🐦</div>
              <h3 class="font-bold mb-2">Twitter</h3>
              <p class="text-gray-300">@kter</p>
            </a>
          </div>
          
          <div class="mt-12 text-gray-400">
            <p>お気軽にお声がけください</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 画像スライドショーの設定
const galleryImages = [
  '/gallery-1.jpg',
  '/gallery-2.jpg',
  '/gallery-3.jpg',
  '/gallery-4.jpg',
  '/gallery-5.jpg'
]

const currentImageIndex = ref(0)
let slideInterval = null

// 画像を自動で切り替える関数
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % galleryImages.length
}

// コンポーネントがマウントされたときにスライドショーを開始
onMounted(() => {
  slideInterval = setInterval(nextImage, 4000) // 4秒ごとに切り替え
})

// コンポーネントがアンマウントされたときにタイマーをクリア
onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})

// メタデータの設定
useSeoMeta({
  title: '高橋智彦のポートフォリオ',
  ogTitle: '高橋智彦のポートフォリオ',
  description: '魚とお茶と富士山と車と新しいもの好きエンジニア - AWS/Linux インフラエンジニア、Ruby on Rails、JavaScript/PHPの経験があります',
  ogDescription: '魚とお茶と富士山と車と新しいもの好きエンジニア - AWS/Linux インフラエンジニア、Ruby on Rails、JavaScript/PHPの経験があります',
  ogImage: '/profile.jpg',
  twitterCard: 'summary_large_image',
})
</script> 