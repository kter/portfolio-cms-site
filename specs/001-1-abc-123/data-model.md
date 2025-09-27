# Data Model: 特定商取引法に基づく表記ページ

## Overview
Data model for the Japanese Specified Commercial Transaction Act disclosure page. This is a static content model with no database persistence required.

## Entities

### LegalDisclosure
The primary entity containing all mandatory business information required by Japanese law.

**Fields**:
- `businessName`: string - Business operator name (company or individual)
- `businessAddress`: BusinessAddress - Physical business location
- `contactInfo`: ContactInformation - Customer communication details
- `administrativeSupervisor`: string - Person responsible for operations
- `additionalFees`: AdditionalFee[] - Array of additional charges
- `returnPolicy`: ReturnPolicy - Return and exchange policies
- `deliveryInfo`: DeliveryInformation - Timing and delivery details
- `paymentMethods`: PaymentMethod[] - Accepted payment options
- `pricingInfo`: PricingInformation - Price display requirements

**Validation Rules**:
- All fields are mandatory except where privacy protection applies
- Text fields must not be empty or contain only whitespace
- Contact information must be valid and responsive
- Return policy must distinguish between customer and defect scenarios

### BusinessAddress
Physical business location with privacy protection options.

**Fields**:
- `fullAddress`: string | null - Complete address or null if protected
- `isProtected`: boolean - Whether individual privacy protection is applied
- `disclosureNote`: string - Note about request-based disclosure if protected

**Validation Rules**:
- If `isProtected` is false, `fullAddress` must be provided
- If `isProtected` is true, `disclosureNote` must explain disclosure process
- Address format must follow Japanese postal standards when provided

### ContactInformation
Customer communication methods with privacy considerations.

**Fields**:
- `email`: string - Email address for customer inquiries (always required)
- `phone`: PhoneContact | null - Phone number with privacy protection option
- `businessHours`: string - Operating hours for customer support

**Validation Rules**:
- Email must be valid format and monitored for responses
- Phone information follows same privacy rules as address
- Business hours must be clearly specified

### PhoneContact
Phone number information with privacy protection.

**Fields**:
- `number`: string | null - Phone number or null if protected
- `isProtected`: boolean - Whether individual privacy protection applies
- `disclosureNote`: string - Request-based disclosure note if protected
- `operatingHours`: string - Phone support availability

### AdditionalFee
Additional charges beyond product/service base price.

**Fields**:
- `feeType`: string - Type of fee (shipping, processing, etc.)
- `amount`: string - Fee amount or calculation method
- `description`: string - Detailed explanation of when fee applies
- `currency`: string - Currency code (JPY)

**Validation Rules**:
- Fee type must be clearly categorized
- Amount must be specific or provide clear calculation method
- Description must explain all conditions for fee application

### ReturnPolicy
Return and exchange policy with distinct scenarios.

**Fields**:
- `customerInitiated`: CustomerReturnPolicy - Customer convenience returns
- `defectiveProduct`: DefectReturnPolicy - Product defect returns
- `generalTerms`: string - Overall policy statement

**Validation Rules**:
- Both customer and defect scenarios must be clearly defined
- Time limits must be specific and reasonable
- Responsibility for costs must be clearly assigned

### CustomerReturnPolicy
Return policy for customer convenience.

**Fields**:
- `timeLimit`: string - Time period for returns
- `conditions`: string[] - Conditions for return acceptance
- `costResponsibility`: string - Who pays return shipping
- `process`: string - How to initiate return

### DefectReturnPolicy
Return policy for defective products.

**Fields**:
- `timeLimit`: string - Time period for defect claims
- `coverageScope`: string - What constitutes a defect
- `costResponsibility`: string - Company responsibility for costs
- `process`: string - How to report and resolve defects

### DeliveryInformation
Product delivery or service provision timing.

**Fields**:
- `processingTime`: string - Order processing timeframe
- `deliveryTime`: string - Shipping/delivery timeframe
- `serviceProvision`: string - When services become available
- `specialConditions`: string[] - Any special delivery considerations

### PaymentMethod
Accepted payment options and their requirements.

**Fields**:
- `methodName`: string - Payment method name
- `description`: string - How the payment method works
- `processingTime`: string - When payment is processed
- `additionalFees`: string - Any fees specific to this method

**Validation Rules**:
- Method name must be clear and unambiguous
- Processing time must specify when charges occur
- Any additional fees must be clearly disclosed

### PricingInformation
Price display and tax information.

**Fields**:
- `displayFormat`: string - How prices are shown (tax-inclusive, etc.)
- `taxInclusive`: boolean - Whether displayed prices include tax
- `currency`: string - Currency used (JPY)
- `priceLocation`: string - Where to find specific pricing

**Validation Rules**:
- Tax treatment must be clearly specified
- Price location must be accurate and accessible
- Currency must match business operations

## Relationships

### Primary Relationships
- LegalDisclosure contains one BusinessAddress
- LegalDisclosure contains one ContactInformation
- LegalDisclosure contains multiple AdditionalFee entities
- LegalDisclosure contains one ReturnPolicy
- LegalDisclosure contains one DeliveryInformation
- LegalDisclosure contains multiple PaymentMethod entities
- LegalDisclosure contains one PricingInformation

### Dependency Relationships
- ContactInformation contains one PhoneContact
- ReturnPolicy contains one CustomerReturnPolicy and one DefectReturnPolicy

## State Transitions

### Content States
1. **Draft**: Information being prepared and reviewed
2. **Legal Review**: Content under legal compliance verification
3. **Approved**: Content approved for publication
4. **Published**: Live on website and accessible to users
5. **Update Required**: Changes needed due to business changes

### State Transition Rules
- Draft → Legal Review: All mandatory fields completed
- Legal Review → Approved: Legal compliance verified
- Approved → Published: Technical implementation complete
- Published → Update Required: Business information changes
- Update Required → Draft: Updates initiated

## Privacy Protection Implementation

### Individual Business Operator Rules
For individual business operators (sole proprietors):
- Business address may be protected with request-based disclosure
- Phone number may be protected with request-based disclosure
- Email address must always be provided
- All other information must be displayed

### Request-Based Disclosure Process
When privacy protection is applied:
1. Display note: "請求があったら遅滞なく開示します" (Will be disclosed promptly upon request)
2. Provide clear contact method for requests
3. Maintain ability to provide information within reasonable timeframe

## Validation and Compliance

### Legal Compliance Checks
- All mandatory fields present per Japanese law
- Contact information is monitored and responsive
- Return policies are fair and clearly stated
- Pricing information is accurate and current
- Privacy protection properly implemented where applicable

### Data Quality Requirements
- All text in proper Japanese language
- Contact information tested and verified
- Legal terminology used correctly
- Information kept current and accurate

## Implementation Notes

### Static Content Structure
Since this is static content with no database:
- Information stored in Vue.js component data or JSON configuration
- Version controlled for audit trail
- Updates require code deployment
- No dynamic content management system needed

### Maintenance Considerations
- Regular review schedule for information accuracy
- Legal compliance verification process
- Update workflow for business changes
- Backup and recovery procedures for legal documentation