import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
const base=process.env.PIXEL_BASE_URL || 'http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const context=await browser.newContext({reducedMotion:'reduce'});
 const page=await context.newPage(); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 for(const width of [360,390,768,1024,1200,1440]) {
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+'/contact/',{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  assert.equal(await page.locator('h1').innerText(),'ارتباط با ما');
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('.contact-channel').count(),3);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
  const menu=page.locator('.menu-toggle');
  if(await menu.isVisible()) {
   await menu.click(); await page.locator('#mobile-menu a[href="/contact/"]').waitFor({state:'visible'});
   assert.equal(await page.locator('#mobile-menu a[href="/contact/"]').getAttribute('aria-current'),'page');
   await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');
  } else {
   const link=page.locator('.desktop-links a[href="/contact/"]');
   await link.waitFor({state:'visible'});assert.equal(await link.getAttribute('aria-current'),'page');
   const nav=await page.locator('.desktop-links a').evaluateAll(links=>links.map(a=>a.getBoundingClientRect().height));
   assert.ok(nav.every(h=>h<40),`wrapped header at ${width}`);
  }
  assert.equal(await page.locator('footer a[href="/contact/"]').count(),1);
  assert.deepEqual((await new AxeBuilder({page}).analyze()).violations.map(v=>v.id),[]);
  console.log(`PASS contact ${width}: RTL, layout, navigation and accessibility.`);
 }
 await page.evaluate(()=>{window.contactEvents=[];window.addEventListener('pixel:contact-click',e=>window.contactEvents.push(e.detail));document.querySelector('.contact-channels').addEventListener('click',e=>e.preventDefault(),true);});
 for(const [channel,url] of [['whatsapp','https://wa.me/989937825753'],['telegram','https://t.me/+989937825753'],['bale','https://ble.ir/aradlll']]){
  const link=page.locator(`[data-contact-location="contact-${channel}"]`);
  const href=await link.getAttribute('href');assert.ok(channel==='whatsapp'?href.startsWith(url+'?text='):href===url);
  assert.equal(await link.getAttribute('target'),'_blank');assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
  await link.focus();assert.ok(await link.evaluate(a=>a.matches(':focus-visible')));
  await link.click();
 }
 assert.deepEqual(await page.evaluate(()=>window.contactEvents.map(e=>e.channel)),['whatsapp','telegram','bale']);
 const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();
 await staticPage.goto(base+'/contact/');assert.equal(await staticPage.locator('.contact-channel').count(),3);
 assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'),'https://pxlgrid.design/contact/');
 assert.equal(await staticPage.title(),'ارتباط با پیکسل | واتساپ، تلگرام و بله');
 assert.ok((await (await fetch(base+'/sitemap.xml')).text()).includes('https://pxlgrid.design/contact/'));
 await page.setViewportSize({width:390,height:900});await page.locator('.contact-page').evaluate(el=>el.style.fontSize='200%');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.goto(base+'/');assert.equal(await page.locator('.desktop-links a[href="/contact/"]').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS static HTML, metadata, sitemap, focus, click events, links and homepage navigation.');
} finally {await browser.close();}
