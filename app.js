const filterButtons = document.querySelectorAll('[data-filter]');
let galleryCategory='women';
let galleryLimit=4;
function showCases(category, reset=true) {
 galleryCategory=category;
 if(reset) galleryLimit=4;
 const cards=[...document.querySelectorAll('[data-category]')];
 const matches=cards.filter(card=>card.dataset.category===category);
 cards.forEach(card=>{card.hidden=card.dataset.category!==category || matches.indexOf(card)>=galleryLimit;});
 filterButtons.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 document.querySelector('#gallery-count').textContent=`${category==='women'?'여자':'남자'} 시술 사진 ${matches.length}장`;
 const more=document.querySelector('#gallery-more');
 more.hidden=galleryLimit>=matches.length;
 more.innerHTML=`사진 더 보기 <span>+${Math.min(4,Math.max(0,matches.length-galleryLimit))}</span>`;
}
filterButtons.forEach(button=>button.addEventListener('click',()=>showCases(button.dataset.filter)));
document.querySelector('#gallery-more').addEventListener('click',()=>{galleryLimit+=4;showCases(galleryCategory,false);});
showCases('women');
window.addEventListener('pageshow', () => { document.querySelectorAll('#faq details').forEach(item => { item.open = false; }); });
document.querySelector('#year').textContent = new Date().getFullYear();
const photoDialog = document.querySelector('#photo-dialog');
let photoTrigger;
document.querySelectorAll('[data-full]').forEach(button => button.addEventListener('click', () => {
 photoTrigger = button;
 const picture = document.querySelector('#full-photo');
 picture.src = button.dataset.full;
 picture.alt = button.dataset.caption + ' 실제 시술 전후 사진';
 document.querySelector('#photo-caption').textContent = button.dataset.caption;
 photoDialog.showModal();
}));
photoDialog.querySelector('.dialog-close').addEventListener('click',()=>photoDialog.close());
photoDialog.addEventListener('click',e=>{if(e.target===photoDialog)photoDialog.close();});
photoDialog.addEventListener('close',()=>photoTrigger?.focus());
// Observe individual text blocks so long sections animate as each line enters view.
if ('IntersectionObserver' in window) {
 const textObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('text-in-view'); textObserver.unobserve(entry.target); }
 }), { threshold:0.12, rootMargin:'0px 0px -24px 0px' });
 const sectionMotions = {approach:'soft-focus',concerns:'side-reveal','dot-design':'curtain-reveal',method:'step-rise',portfolio:'gentle-zoom',faq:'side-reveal',menu:'step-rise',space:'soft-focus',contact:'curtain-reveal'};
 document.querySelectorAll('main section:not(#top)').forEach(section => {
  section.querySelectorAll('h2,h3,p,summary,dt,dd,.section-label,.signature,.eyebrow,.dot-label').forEach((element,index) => {
   if (element.closest('#top') || element.querySelector('h2,h3,p,summary,dt,dd') || element.classList.contains('section-label') && element.parentElement.closest('.section-label')) return;
   element.classList.add('text-motion');
   element.dataset.motion = element.matches('h2,h3') ? (sectionMotions[section.id] || 'gentle-zoom') : element.matches('dt,.eyebrow,.section-label') ? 'letter-settle' : 'copy-rise';
   element.style.setProperty('--text-delay', `${(index%3)*0.08}s`);
   textObserver.observe(element);
  });
 });
 const imageObserver = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); imageObserver.unobserve(entry.target); } }),{threshold:0.08});
 document.querySelectorAll('.studio-photo,.director-portrait,.case-photo,.process-film').forEach(element=>{element.classList.add('reveal');imageObserver.observe(element);});
}

// Keep decorative motion preferences separate from the requested studio films.
const films = [...document.querySelectorAll('video')];
function playFilm(video) {
 video.muted = true;
 video.defaultMuted = true;
 video.loop = true;
 video.playsInline = true;
 if (!document.hidden) video.play().catch(()=>{});
}
films.forEach(video => {
 video.addEventListener('loadeddata', () => { const r=video.getBoundingClientRect(); if(r.bottom>0 && r.top<innerHeight) playFilm(video); });
});
const heroVideo = document.querySelector('#hero-video');
if(heroVideo) { heroVideo.autoplay = true; playFilm(heroVideo); }
if ('IntersectionObserver' in window) {
 const filmObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  const video = entry.target;
  if(entry.isIntersecting) {
   if(!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
   playFilm(video);
  } else video.pause();
 }), {threshold:0.1});
 films.forEach(video => filmObserver.observe(video));
}
function resumeVisibleFilms() {
 films.forEach(video => {
  if(document.hidden) video.pause();
  else { const r=video.getBoundingClientRect(); if(r.bottom>0 && r.top<innerHeight) playFilm(video); }
 });
}
document.addEventListener('visibilitychange',resumeVisibleFilms);
window.addEventListener('pageshow',resumeVisibleFilms);
document.addEventListener('pointerdown',resumeVisibleFilms,{once:true,passive:true});

// One concern at a time keeps the image and its explanation connected.
document.querySelectorAll('[data-concern]').forEach(button => {
 button.addEventListener('click', () => {
  document.querySelectorAll('[data-concern]').forEach(item => {
   const active = item === button;
   item.setAttribute('aria-pressed', String(active));
   item.classList.toggle('active', active);
  });
  document.querySelectorAll('.concern-panel').forEach(panel => { panel.hidden = panel.id !== button.getAttribute('aria-controls'); });
 });
});

// Consultation CTAs outside the hero; fixed dock animates only its text.
document.querySelectorAll('a[href="https://pf.kakao.com/_tzHvn"]').forEach(link => { if (!link.closest('#top, .header, .mobile-dock')) link.classList.add('consult-bounce'); });

// Add the Bongdam Naver booking URL here when it becomes available.
const branchBookingLinks = { bongdam: '' };
const bongdamPending = document.querySelector('.branch-booking-pending');
if (bongdamPending && branchBookingLinks.bongdam) {
 try {
  const bookingURL = new URL(branchBookingLinks.bongdam);
  if (bookingURL.protocol === 'https:' && (bookingURL.hostname === 'naver.com' || bookingURL.hostname.endsWith('.naver.com') || bookingURL.hostname === 'naver.me')) {
   const bookingLink = document.createElement('a');
   bookingLink.href = bookingURL.href;
   bookingLink.target = '_blank';
   bookingLink.rel = 'noopener noreferrer';
   bookingLink.dataset.branch = 'bongdam';
   const bookingLabel = bongdamPending.querySelector('.booking-label');
   if (bookingLabel) bookingLink.append(bookingLabel);
   else bookingLink.textContent = '봉담점 네이버 예약';
   bongdamPending.replaceWith(bookingLink);
  }
 } catch (_) { /* Keep the pending state for an invalid URL. */ }
}

// One delegated event per interaction, including dynamically revealed gallery controls.
document.addEventListener('click', event => {
 const control = event.target.closest('a,button,summary,[role="button"]');
 if (!control || control.matches(':disabled,[aria-disabled="true"]') || typeof window.fbq !== 'function') return;
 const href = control.getAttribute('href') || '';
 const section = control.closest('section')?.id || (control.closest('.mobile-dock') ? 'fixed_dock' : control.closest('.header') ? 'header' : 'footer');
 const action = href.startsWith('tel:') ? 'phone' : href.includes('pf.kakao.com') ? 'kakao' : href.includes('naver.com') ? 'naver_booking' : control.matches('.case-photo') ? 'photo_open' : control.matches('.dialog-close') ? 'photo_close' : control.hasAttribute('data-filter') ? 'gallery_filter' : control.hasAttribute('data-concern') ? 'concern_tab' : control.matches('summary') ? 'accordion_toggle' : href.startsWith('#') ? 'navigation' : 'button';
 const label = (control.getAttribute('aria-label') || control.textContent || action).replace(/01[016789][-\s]?\d{3,4}[-\s]?\d{4}/g,'매장 전화').replace(/\s+/g,' ').trim().slice(0,100);
 const data = {button_name:label,button_action:action,section:section};
 window.fbq('trackCustom','ButtonClick',data);
 if (action === 'phone' || action === 'kakao') window.fbq('track','Contact',{content_name:action,content_category:section});
});
