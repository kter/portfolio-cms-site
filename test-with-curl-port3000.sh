#!/bin/bash

echo "🧪 Testing Legal Disclosure Page Implementation"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PASSED=0
TOTAL=0

# Test 1: Homepage is accessible
echo -e "\n📋 Test 1: Homepage Accessibility"
((TOTAL++))
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
    echo -e "  ${GREEN}✅ Homepage returns 200 OK${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Homepage not accessible${NC}"
fi

# Test 2: Legal disclosure page is accessible
echo -e "\n📋 Test 2: Legal Disclosure Page Accessibility"
((TOTAL++))
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal-disclosure | grep -q "200"; then
    echo -e "  ${GREEN}✅ Legal disclosure page returns 200 OK${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Legal disclosure page not accessible${NC}"
fi

# Get the legal page content for testing
PAGE_CONTENT=$(curl -s http://localhost:3000/legal-disclosure)

# Test 3: Page title contains required text
echo -e "\n📋 Test 3: Page Title"
((TOTAL++))
if echo "$PAGE_CONTENT" | grep -q "特定商取引法に基づく表記"; then
    echo -e "  ${GREEN}✅ Page contains '特定商取引法に基づく表記'${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Page title not found${NC}"
fi

# Test 4: Check for mandatory fields
echo -e "\n📋 Test 4: Mandatory Legal Fields"
MANDATORY_FIELDS=(
    "販売業者の名称"
    "運営統括責任者"
    "メールアドレス"
    "所在地"
    "電話番号"
    "追加手数料"
    "返品・交換"
    "引渡時期"
    "決済手段"
    "販売価格"
)

FIELDS_FOUND=0
for field in "${MANDATORY_FIELDS[@]}"; do
    if echo "$PAGE_CONTENT" | grep -q "$field"; then
        echo -e "  ✓ $field"
        ((FIELDS_FOUND++))
    else
        echo -e "  ✗ $field"
    fi
done

((TOTAL++))
if [ $FIELDS_FOUND -eq ${#MANDATORY_FIELDS[@]} ]; then
    echo -e "  ${GREEN}✅ All ${#MANDATORY_FIELDS[@]} mandatory fields found${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Only $FIELDS_FOUND/${#MANDATORY_FIELDS[@]} mandatory fields found${NC}"
fi

# Test 5: Business information
echo -e "\n📋 Test 5: Business Information"
((TOTAL++))
if echo "$PAGE_CONTENT" | grep -q "高橋智彦"; then
    echo -e "  ${GREEN}✅ Business name '高橋智彦' found${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Business name not found${NC}"
fi

# Test 6: Contact email
echo -e "\n📋 Test 6: Contact Email"
((TOTAL++))
if echo "$PAGE_CONTENT" | grep -q "contact@tomohiko.io"; then
    echo -e "  ${GREEN}✅ Email 'contact@tomohiko.io' found${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Contact email not found${NC}"
fi

# Test 7: Privacy protection notice
echo -e "\n📋 Test 7: Privacy Protection"
((TOTAL++))
if echo "$PAGE_CONTENT" | grep -q "請求があったら遅滞なく開示します"; then
    echo -e "  ${GREEN}✅ Privacy protection notice found${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Privacy protection notice not found${NC}"
fi

# Test 8: Legal compliance notice
echo -e "\n📋 Test 8: Legal Compliance Notice"
((TOTAL++))
if echo "$PAGE_CONTENT" | grep -q "特定商取引法第11条"; then
    echo -e "  ${GREEN}✅ Legal compliance notice found${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Legal compliance notice not found${NC}"
fi

# Test 9: Footer navigation on homepage
echo -e "\n📋 Test 9: Footer Navigation"
((TOTAL++))
HOME_CONTENT=$(curl -s http://localhost:3000/)
if echo "$HOME_CONTENT" | grep -q 'href="/legal-disclosure"'; then
    echo -e "  ${GREEN}✅ Footer link to legal disclosure found${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Footer link not found${NC}"
fi

# Test 10: Return policy sections
echo -e "\n📋 Test 10: Return Policy"
((TOTAL++))
if echo "$PAGE_CONTENT" | grep -q "お客様都合" && echo "$PAGE_CONTENT" | grep -q "不備がある場合"; then
    echo -e "  ${GREEN}✅ Return policy sections found${NC}"
    ((PASSED++))
else
    echo -e "  ${RED}❌ Return policy sections incomplete${NC}"
fi

# Summary
echo -e "\n=================================================="
echo "📊 TEST RESULTS SUMMARY"
echo "=================================================="
echo -e "✅ Passed: ${GREEN}$PASSED/$TOTAL${NC} tests"
PERCENTAGE=$((PASSED * 100 / TOTAL))
echo "Success rate: $PERCENTAGE%"

if [ $PASSED -eq $TOTAL ]; then
    echo -e "\n${GREEN}🎉 All tests passed! The legal disclosure page is fully functional.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please review the implementation.${NC}"
    exit 1
fi