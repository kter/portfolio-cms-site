/**
 * TypeScript interfaces for Japanese Specified Commercial Transaction Act disclosure
 * 特定商取引法に基づく表記のデータ構造
 */

export interface PhoneContact {
  number: string | null;
  isProtected: boolean;
  disclosureNote: string;
  operatingHours: string;
}

export interface BusinessAddress {
  fullAddress: string | null;
  isProtected: boolean;
  disclosureNote: string;
}

export interface ContactInformation {
  email: string;
  phone: PhoneContact | null;
  businessHours: string;
}

export interface AdditionalFee {
  feeType: string;
  amount: string;
  description: string;
  currency: string;
}

export interface CustomerReturnPolicy {
  timeLimit: string;
  conditions: string[];
  costResponsibility: string;
  process: string;
}

export interface DefectReturnPolicy {
  timeLimit: string;
  coverageScope: string;
  costResponsibility: string;
  process: string;
}

export interface ReturnPolicy {
  customerInitiated: CustomerReturnPolicy;
  defectiveProduct: DefectReturnPolicy;
  generalTerms: string;
}

export interface DeliveryInformation {
  processingTime: string;
  deliveryTime: string;
  serviceProvision: string;
  specialConditions: string[];
}

export interface PaymentMethod {
  methodName: string;
  description: string;
  processingTime: string;
  additionalFees: string;
}

export interface PricingInformation {
  displayFormat: string;
  taxInclusive: boolean;
  currency: string;
  priceLocation: string;
}

export interface LegalDisclosure {
  businessName: string;
  businessAddress: BusinessAddress;
  contactInfo: ContactInformation;
  administrativeSupervisor: string;
  additionalFees: AdditionalFee[];
  returnPolicy: ReturnPolicy;
  deliveryInfo: DeliveryInformation;
  paymentMethods: PaymentMethod[];
  pricingInfo: PricingInformation;
}

/**
 * Validation functions for legal disclosure data
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface LegalDisclosureValidator {
  validateBusinessAddress(address: BusinessAddress): ValidationResult;
  validateContactInformation(contact: ContactInformation): ValidationResult;
  validateEmailFormat(email: string): ValidationResult;
  validateAdditionalFees(fees: AdditionalFee[]): ValidationResult;
  validateReturnPolicy(policy: ReturnPolicy): ValidationResult;
  validatePaymentMethods(methods: PaymentMethod[]): ValidationResult;
  validateCompleteLegalDisclosure(disclosure: LegalDisclosure): ValidationResult;
}