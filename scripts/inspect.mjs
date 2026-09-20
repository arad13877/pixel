import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const context = await browser.newContext({viewport:{width:768,height:1000}});
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173');
  console.log('Overflow:',await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const rect=el.getBoundingClientRect();return rect.width>0&&(rect.left < -1 || rect.right > innerWidth+1)}).map(el=>({tag:el.tagName,class:el.className,left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)})).slice(0,20)));
  await page.setViewportSize({width:1440,height:1000});
  const {violations} = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  console.log(JSON.stringify(violations.map(({id,nodes})=>({id,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))})),null,2));
}finally{await browser.close()}
