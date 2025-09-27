<template>
  <article class="legal-disclosure max-w-4xl mx-auto px-4 py-8 lg:px-8">
    <!-- Main Heading -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4 lg:text-4xl">
        特定商取引法に基づく表記
      </h1>
      <p class="text-gray-600 text-lg">
        Specified Commercial Transaction Act Disclosure
      </p>
    </header>

    <!-- Business Information Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
        事業者情報
      </h2>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Business Name -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">販売業者の名称</h3>
          <p class="text-gray-700">{{ legalData.businessName }}</p>
        </div>

        <!-- Administrative Supervisor -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">運営統括責任者</h3>
          <p class="text-gray-700">{{ legalData.administrativeSupervisor }}</p>
        </div>
      </div>
    </section>

    <!-- Contact Information Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
        連絡先情報
      </h2>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Address -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">所在地</h3>
          <div v-if="legalData.businessAddress.isProtected" class="text-gray-700">
            <p class="text-sm text-blue-600 font-medium">{{ legalData.businessAddress.disclosureNote }}</p>
          </div>
          <div v-else class="text-gray-700">
            <p>{{ legalData.businessAddress.fullAddress }}</p>
          </div>
        </div>

        <!-- Phone -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">電話番号</h3>
          <div v-if="legalData.contactInfo.phone?.isProtected" class="text-gray-700">
            <p class="text-sm text-blue-600 font-medium">{{ legalData.contactInfo.phone.disclosureNote }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ legalData.contactInfo.phone.operatingHours }}</p>
          </div>
          <div v-else-if="legalData.contactInfo.phone?.number" class="text-gray-700">
            <p>{{ legalData.contactInfo.phone.number }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ legalData.contactInfo.phone.operatingHours }}</p>
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">メールアドレス</h3>
          <p class="text-gray-700">
            <a
              :href="`mailto:${legalData.contactInfo.email}`"
              class="text-blue-600 hover:text-blue-800 underline"
              :aria-label="`メール送信: ${legalData.contactInfo.email}`"
            >
              {{ legalData.contactInfo.email }}
            </a>
          </p>
          <p class="text-xs text-gray-500">{{ legalData.contactInfo.businessHours }}</p>
        </div>
      </div>
    </section>

    <!-- Additional Fees Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
        追加手数料等の追加料金
      </h2>

      <div class="space-y-4">
        <div
          v-for="(fee, index) in legalData.additionalFees"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div class="flex flex-wrap gap-4 items-start">
            <div class="min-w-0 flex-1">
              <h3 class="text-lg font-medium text-gray-900">{{ fee.feeType }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ fee.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-gray-900">{{ fee.amount }}</p>
              <p class="text-xs text-gray-500">{{ fee.currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Return Policy Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
        返品・交換について
      </h2>

      <div class="space-y-6">
        <!-- General Terms -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-blue-800">{{ legalData.returnPolicy.generalTerms }}</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Customer Initiated Returns -->
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">お客様都合による返品・交換</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-600">期限</dt>
                <dd class="text-gray-800">{{ legalData.returnPolicy.customerInitiated.timeLimit }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">条件</dt>
                <dd class="text-gray-800">
                  <ul class="list-disc list-inside space-y-1">
                    <li v-for="condition in legalData.returnPolicy.customerInitiated.conditions" :key="condition">
                      {{ condition }}
                    </li>
                  </ul>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">費用負担</dt>
                <dd class="text-gray-800">{{ legalData.returnPolicy.customerInitiated.costResponsibility }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">手続き</dt>
                <dd class="text-gray-800">{{ legalData.returnPolicy.customerInitiated.process }}</dd>
              </div>
            </dl>
          </div>

          <!-- Defective Product Returns -->
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">商品・サービスに不備がある場合</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-600">期限</dt>
                <dd class="text-gray-800">{{ legalData.returnPolicy.defectiveProduct.timeLimit }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">対象範囲</dt>
                <dd class="text-gray-800">{{ legalData.returnPolicy.defectiveProduct.coverageScope }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">費用負担</dt>
                <dd class="text-gray-800">{{ legalData.returnPolicy.defectiveProduct.costResponsibility }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">手続き</dt>
                <dd class="text-gray-800">{{ legalData.returnPolicy.defectiveProduct.process }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- Delivery Information Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
        引渡時期・サービス提供時期
      </h2>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">処理時間</h3>
          <p class="text-gray-700">{{ legalData.deliveryInfo.processingTime }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">提供方法</h3>
          <p class="text-gray-700">{{ legalData.deliveryInfo.serviceProvision }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">提供開始</h3>
          <p class="text-gray-700">{{ legalData.deliveryInfo.deliveryTime }}</p>
        </div>
      </div>

      <div v-if="legalData.deliveryInfo.specialConditions.length > 0" class="mt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-3">特別な条件</h3>
        <ul class="list-disc list-inside space-y-1 text-gray-700">
          <li v-for="condition in legalData.deliveryInfo.specialConditions" :key="condition">
            {{ condition }}
          </li>
        </ul>
      </div>
    </section>

    <!-- Payment Methods Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
        受け付け可能な決済手段・決済期間
      </h2>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(method, index) in legalData.paymentMethods"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ method.methodName }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ method.description }}</p>
          <dl class="space-y-2 text-sm">
            <div>
              <dt class="font-medium text-gray-600">処理時期</dt>
              <dd class="text-gray-800">{{ method.processingTime }}</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-600">追加手数料</dt>
              <dd class="text-gray-800">{{ method.additionalFees }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Pricing Information Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
        販売価格・消費税について
      </h2>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">表示形式</h3>
          <p class="text-gray-700">{{ legalData.pricingInfo.displayFormat }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">消費税</h3>
          <p class="text-gray-700">
            {{ legalData.pricingInfo.taxInclusive ? '税込価格' : '税抜価格' }}
          </p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">通貨</h3>
          <p class="text-gray-700">{{ legalData.pricingInfo.currency }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">価格表示場所</h3>
          <p class="text-gray-700">{{ legalData.pricingInfo.priceLocation }}</p>
        </div>
      </div>
    </section>

    <!-- Footer Information -->
    <footer class="border-t border-gray-200 pt-6 mt-12">
      <div class="text-center text-sm text-gray-500">
        <p class="mb-2">
          この表記は特定商取引法第11条に基づく表示です。
        </p>
        <p>
          ご不明な点がございましたら、上記連絡先までお気軽にお問い合わせください。
        </p>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { LegalDisclosure } from '~/types/legal-disclosure'

interface Props {
  legalData: LegalDisclosure
}

// Define props with validation
const props = withDefaults(defineProps<Props>(), {
  legalData: () => {
    throw new Error('legalData prop is required')
  }
})

// Validate props
if (!props.legalData) {
  throw new Error('Legal disclosure data is required')
}

// Add structured data for SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: props.legalData.businessName,
        email: props.legalData.contactInfo.email,
        address: props.legalData.businessAddress.isProtected
          ? undefined
          : {
              '@type': 'PostalAddress',
              addressCountry: 'JP',
              streetAddress: props.legalData.businessAddress.fullAddress
            },
        contactPoint: {
          '@type': 'ContactPoint',
          email: props.legalData.contactInfo.email,
          availableLanguage: 'Japanese'
        }
      })
    }
  ]
})
</script>

<style scoped>
/* Additional custom styles if needed */
.legal-disclosure {
  line-height: 1.7;
}

.legal-disclosure h2 {
  scroll-margin-top: 2rem;
}

.legal-disclosure h3 {
  scroll-margin-top: 2rem;
}

/* Print styles */
@media print {
  .legal-disclosure {
    @apply text-black bg-white;
  }

  .legal-disclosure a {
    @apply text-black no-underline;
  }

  .legal-disclosure .border-blue-600 {
    @apply border-black;
  }

  .legal-disclosure .text-blue-600,
  .legal-disclosure .text-blue-800 {
    @apply text-black;
  }

  .legal-disclosure .bg-blue-50 {
    @apply bg-white border-2 border-black;
  }
}

/* Focus styles for accessibility */
.legal-disclosure a:focus {
  @apply outline-2 outline-offset-2 outline-blue-600;
}

/* High contrast mode support */
@media (prefers-contrast: high) {

  .legal-disclosure .border-gray-200 {
    @apply border-gray-400;
  }

  .legal-disclosure .text-gray-600 {
    @apply text-gray-800;
  }
}
</style>