/**
 * Legal disclosure data for Japanese Specified Commercial Transaction Act
 * 特定商取引法に基づく表記データ
 */

import type { LegalDisclosure } from '~/types/legal-disclosure'

export const legalDisclosureData: LegalDisclosure = {
  businessName: '高橋智彦',

  businessAddress: {
    fullAddress: null,
    isProtected: true,
    disclosureNote: '請求があったら遅滞なく開示します'
  },

  contactInfo: {
    email: 'contact@tomohiko.io',
    phone: {
      number: null,
      isProtected: true,
      disclosureNote: '請求があったら遅滞なく開示します',
      operatingHours: '平日 10:00-18:00'
    },
    businessHours: '平日 10:00-18:00（土日祝を除く）'
  },

  administrativeSupervisor: '高橋智彦',

  additionalFees: [
    {
      feeType: 'プラットフォーム手数料',
      amount: 'Ko-fi規定に準拠',
      description: 'Ko-fi.comプラットフォームの利用に関する手数料はKo-fiの規定に従います。詳細はKo-fi.comをご確認ください。',
      currency: 'JPY'
    },
    {
      feeType: '配送料',
      amount: '実費',
      description: 'デジタルサービス・ポートフォリオサイトのため、物理的な商品の配送は行いません。すべてのサービスはオンラインで提供されます。',
      currency: 'JPY'
    }
  ],

  returnPolicy: {
    customerInitiated: {
      timeLimit: '契約成立から7日以内',
      conditions: [
        'デジタルサービス・コンサルティングサービスの場合、サービス開始前に限り可能',
        '既にサービスが開始された場合は原則として返品・キャンセル不可',
        '継続契約の場合は契約期間途中でのキャンセルは原則不可'
      ],
      costResponsibility: 'お客様都合によるキャンセルの場合、発生した費用はお客様負担',
      process: 'contact@tomohiko.io までメールにてご連絡ください'
    },
    defectiveProduct: {
      timeLimit: 'サービス提供後30日以内',
      coverageScope: 'サービス内容が事前の説明と著しく異なる場合、技術的な問題によりサービスが提供できない場合',
      costResponsibility: '当方の責任による場合、返金または代替サービスの提供',
      process: 'contact@tomohiko.io までメールにてご連絡いただき、内容を確認の上対応いたします'
    },
    generalTerms: 'デジタルサービス・コンサルティングサービスの特性をご理解の上、ご契約ください。詳細は個別契約時に説明いたします。'
  },

  deliveryInfo: {
    processingTime: 'ご契約成立後即座',
    deliveryTime: 'サービス提供は契約内容に応じて即座〜数営業日以内に開始',
    serviceProvision: 'オンライン（メール、ビデオ会議、オンラインツール等）にて提供',
    specialConditions: [
      'インターネット接続環境が必要',
      'ビデオ会議が可能な環境（コンサルティングサービスの場合）',
      '日本時間での対応となります'
    ]
  },

  paymentMethods: [
    {
      methodName: 'Ko-fi（チップ）',
      description: 'Ko-fi.comプラットフォーム経由でのチップ受け取り',
      processingTime: 'Ko-fiでの決済完了後即座',
      additionalFees: 'Ko-fiプラットフォーム手数料が適用される場合があります'
    }
  ],

  pricingInfo: {
    displayFormat: 'チップ（任意の金額）',
    taxInclusive: true,
    currency: 'JPY',
    priceLocation: 'Ko-fi.comページにて任意の金額をお選びいただけます'
  }
}

/**
 * Validation functions for legal disclosure data
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateBusinessAddress = (address: typeof legalDisclosureData.businessAddress): boolean => {
  if (!address.isProtected && !address.fullAddress) {
    return false
  }
  if (address.isProtected && !address.disclosureNote) {
    return false
  }
  return true
}

export const validateContactInformation = (contact: typeof legalDisclosureData.contactInfo): boolean => {
  if (!contact.email || !validateEmailFormat(contact.email)) {
    return false
  }
  if (!contact.businessHours) {
    return false
  }
  return true
}

export const validateCompleteLegalDisclosure = (disclosure: LegalDisclosure): boolean => {
  return !!(
    disclosure.businessName &&
    validateBusinessAddress(disclosure.businessAddress) &&
    validateContactInformation(disclosure.contactInfo) &&
    disclosure.administrativeSupervisor &&
    disclosure.additionalFees.length > 0 &&
    disclosure.returnPolicy &&
    disclosure.deliveryInfo &&
    disclosure.paymentMethods.length > 0 &&
    disclosure.pricingInfo
  )
}

// Validate the data structure
if (!validateCompleteLegalDisclosure(legalDisclosureData)) {
  console.warn('Legal disclosure data validation failed')
}