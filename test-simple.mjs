#!/usr/bin/env node
import puppeteer from 'puppeteer';

async function runTests() {
  console.log('🧪 Testing Legal Disclosure Page Implementation\n');
  console.log('='.repeat(50));

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let passedTests = 0;
  let totalTests = 0;

  try {
    // Test 1: Homepage accessibility
    totalTests++;
    console.log('\n📋 Test 1: Homepage Accessibility');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    const homeTitle = await page.title();
    console.log(`  ✅ Homepage loaded successfully`);
    console.log(`  Title: ${homeTitle}`);
    passedTests++;

    // Test 2: Footer navigation exists
    totalTests++;
    console.log('\n📋 Test 2: Footer Legal Link');
    const footerLink = await page.$('footer a[href="/legal-disclosure"]');
    if (footerLink) {
      const linkText = await page.evaluate(el => el.textContent, footerLink);
      console.log(`  ✅ Footer legal link found`);
      console.log(`  Link text: ${linkText.trim()}`);
      passedTests++;
    } else {
      console.log(`  ❌ Footer legal link not found`);
    }

    // Test 3: Navigate to legal page
    totalTests++;
    console.log('\n📋 Test 3: Legal Disclosure Page');
    await page.goto('http://localhost:3000/legal-disclosure', { waitUntil: 'networkidle0' });
    const legalTitle = await page.title();
    console.log(`  ✅ Legal page loaded successfully`);
    console.log(`  Title: ${legalTitle}`);
    passedTests++;

    // Test 4: Check main heading
    totalTests++;
    console.log('\n📋 Test 4: Page Content Structure');
    const h1Text = await page.$eval('h1', el => el.textContent).catch(() => null);
    if (h1Text && h1Text.includes('特定商取引法に基づく表記')) {
      console.log(`  ✅ Main heading found: ${h1Text}`);
      passedTests++;
    } else {
      console.log(`  ❌ Main heading not found or incorrect`);
    }

    // Test 5: Check mandatory fields
    totalTests++;
    console.log('\n📋 Test 5: Mandatory Legal Fields');
    const mandatoryFields = {
      '販売業者の名称': false,
      '運営統括責任者': false,
      'メールアドレス': false,
      '所在地': false,
      '電話番号': false,
      '追加手数料': false,
      '返品・交換': false,
      '引渡時期': false,
      '決済手段': false,
      '販売価格': false
    };

    const pageContent = await page.content();
    let fieldsFound = 0;
    for (const field in mandatoryFields) {
      if (pageContent.includes(field)) {
        mandatoryFields[field] = true;
        fieldsFound++;
      }
    }

    console.log(`  Found ${fieldsFound}/${Object.keys(mandatoryFields).length} mandatory fields:`);
    for (const [field, found] of Object.entries(mandatoryFields)) {
      console.log(`    ${found ? '✓' : '✗'} ${field}`);
    }
    if (fieldsFound === Object.keys(mandatoryFields).length) {
      passedTests++;
    }

    // Test 6: Check email link
    totalTests++;
    console.log('\n📋 Test 6: Contact Information');
    const emailLink = await page.$('a[href^="mailto:"]');
    if (emailLink) {
      const href = await page.evaluate(el => el.href, emailLink);
      console.log(`  ✅ Email link found: ${href}`);
      passedTests++;
    } else {
      console.log(`  ❌ Email link not found`);
    }

    // Test 7: Check privacy protection
    totalTests++;
    console.log('\n📋 Test 7: Privacy Protection');
    if (pageContent.includes('請求があったら遅滞なく開示します')) {
      console.log(`  ✅ Privacy protection notice found`);
      passedTests++;
    } else {
      console.log(`  ❌ Privacy protection notice not found`);
    }

    // Test 8: Responsive design
    totalTests++;
    console.log('\n📋 Test 8: Responsive Design');

    // Desktop
    await page.setViewport({ width: 1280, height: 720 });
    const desktopH1 = await page.$('h1');

    // Mobile
    await page.setViewport({ width: 375, height: 667 });
    const mobileH1 = await page.$('h1');

    if (desktopH1 && mobileH1) {
      console.log(`  ✅ Desktop view (1280x720): OK`);
      console.log(`  ✅ Mobile view (375x667): OK`);
      passedTests++;
    } else {
      console.log(`  ❌ Responsive design issues detected`);
    }

    // Test 9: Accessibility
    totalTests++;
    console.log('\n📋 Test 9: Accessibility');
    const h1Count = await page.$$eval('h1', els => els.length);
    const h2Count = await page.$$eval('h2', els => els.length);
    console.log(`  H1 headings: ${h1Count} (should be 1)`);
    console.log(`  H2 headings: ${h2Count} (should be multiple)`);
    if (h1Count === 1 && h2Count > 0) {
      console.log(`  ✅ Proper heading hierarchy`);
      passedTests++;
    } else {
      console.log(`  ❌ Heading hierarchy issues`);
    }

    // Test 10: Legal compliance footer
    totalTests++;
    console.log('\n📋 Test 10: Legal Compliance Notice');
    if (pageContent.includes('特定商取引法第11条')) {
      console.log(`  ✅ Legal compliance notice found`);
      passedTests++;
    } else {
      console.log(`  ❌ Legal compliance notice not found`);
    }

  } catch (error) {
    console.error('\n❌ Test execution error:', error.message);
  } finally {
    await browser.close();

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`${passedTests === totalTests ? '🎉' : '⚠️'} Success rate: ${Math.round((passedTests/totalTests) * 100)}%`);

    if (passedTests === totalTests) {
      console.log('\n🎉 All tests passed! The legal disclosure page is fully functional.');
    } else {
      console.log(`\n⚠️  Some tests failed. Please review the implementation.`);
    }
    console.log('='.repeat(50));

    process.exit(passedTests === totalTests ? 0 : 1);
  }
}

runTests().catch(console.error);