const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const verifyRevealContent = require('./reveal-content.cjs');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page = await browser.newPage({viewport:{width:1440,height:900}});
 try {
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());
 await page.route('https://fonts.gstatic.com/**',r=>r.abort());
 await page.clock.install();
 await page.goto(process.env.PRESENTATION_URL || 'http://127.0.0.1:8000/');
 await page.waitForSelector('.progress-dot');
 assert.equal(await page.locator('#guided-tour').isVisible(),false);
 const counts=await page.evaluate(()=>Object.keys(GUIDE_NOTES).map(stage=>({stage:Number(stage),notes:GUIDE_NOTES[stage].length,steps:steps.filter(s=>s.stage===Number(stage)).length})));
 for(const {notes,steps} of counts) assert.equal(notes,steps);
 const last=await page.evaluate(()=>steps.findIndex(s=>s.stage===10)-1);
 assert.equal(last,56);
 await page.locator('#guide-toggle').click();
 assert.equal(await page.locator('#guide-back').isDisabled(),true);
 // Every note must match the visual step, including backwards traversal.
 const verify = async()=> {
   const expected=await page.evaluate(()=>{const stage=steps[currentStep].stage;return GUIDE_NOTES[stage][currentStep-steps.findIndex(s=>s.stage===stage)][0]});
   assert.equal(await page.locator('#guide-heading').textContent(),expected);
   await verifyRevealContent(page);
 };
 for(let i=0;i<last;i++){await verify();await page.locator('#guide-next').click()}
 await verify();
 assert.equal(await page.locator('#guide-status').textContent(),'Tour complete');
 assert.ok(await page.locator('#guide-next').isDisabled());
 assert.ok(await page.locator('#guide-play').isDisabled());
 await page.locator('#guide-playback').click();
 assert.equal(await page.evaluate(()=>steps[currentStep].stage),10);
 await page.locator('#guide-next').click();
 assert.equal(await page.locator('#playback-feed').evaluate(el=>el.children.length),1);
 await page.locator('#guide-back').click();
 await page.locator('#guide-back').click();
 assert.equal(await page.evaluate(()=>currentStep),last);
 for(let i=last;i>0;i--){await verify();await page.locator('#guide-back').click()}
 await verify();
 const messagesAfterRewind=await page.locator('#chat-messages .message').count();
 assert.equal(messagesAfterRewind,0,'rewinding must clear the chat');
 // Autoplay advances after the reading time and pauses cleanly.
 await page.locator('#guide-play').click();
 await page.clock.runFor(30000);
 assert.ok(await page.evaluate(()=>currentStep)>0);
 await page.locator('#guide-play').click();
 const paused=await page.evaluate(()=>currentStep);
 await page.clock.runFor(60000);
 assert.equal(await page.evaluate(()=>currentStep),paused);
 await page.locator('#guide-play').click();
 await page.keyboard.press('ArrowRight');
 assert.equal(await page.locator('#guide-play').getAttribute('aria-pressed'),'false');
 await page.locator('#guide-play').click();
 await page.locator('[data-stage="5"]').click();
 assert.equal(await page.locator('#guide-play').getAttribute('aria-pressed'),'false');
 await page.locator('#guide-play').click();
 await page.locator('#guide-toggle').click();
 const disabledAt=await page.evaluate(()=>currentStep);
 await page.clock.runFor(60000);
 assert.equal(await page.evaluate(()=>currentStep),disabledAt);
 await page.locator('#guide-toggle').click();
 await page.locator('#guide-restart').click();
 assert.equal(await page.evaluate(()=>currentStep),0);
 assert.equal(await page.locator('#chat-messages .message').count(),0);
 // Run autoplay through the conclusion; it must never enter playback.
 await page.locator('#guide-play').click();
 await page.clock.runFor(30*60*1000);
 assert.equal(await page.evaluate(()=>currentStep),last);
 assert.equal(await page.locator('#guide-play').getAttribute('aria-pressed'),'false');
 // Space activates the focused button once, rather than also advancing the deck.
 await page.locator('#guide-restart').click();
 await page.locator('#guide-toggle').focus();
 await page.keyboard.press('Space');
 assert.equal(await page.evaluate(()=>currentStep),0);
 assert.equal(await page.locator('#guided-tour').isVisible(),false);
 await page.keyboard.press('Space');
 assert.equal(await page.locator('#guided-tour').isVisible(),true);
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.locator('#guide-toggle').isVisible());
 await page.locator('#guide-toggle').click();
 assert.ok((await page.locator('#guide-toggle').boundingBox()).y < 844);
 await page.locator('#guide-toggle').click();
 const layout=await page.evaluate(()=>{
   const app=document.getElementById('app').getBoundingClientRect();
   const guide=document.getElementById('guided-tour').getBoundingClientRect();
   const controls=document.getElementById('progress-bar').getBoundingClientRect();
   return {appHeight:app.height,guideTop:guide.top,appBottom:app.bottom,controlsBottom:controls.bottom,width:document.documentElement.scrollWidth};
 });
 assert.ok(layout.appHeight>200);
 assert.ok(layout.guideTop>=layout.appBottom-1);
 assert.ok(layout.controlsBottom<=845);
 assert.ok(layout.width<=390);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({counts,steps:57,autoplay:'passed',pause:'passed',backwards:'passed',playback:'passed',mobile:layout,errors}));
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
