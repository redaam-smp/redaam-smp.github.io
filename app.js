const filterButtons = document.querySelectorAll('[data-filter]');
function showCases(category) {
 document.querySelectorAll('[data-category]').forEach(card => {card.hidden = card.dataset.category !== category;});
 filterButtons.forEach(button => {const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
filterButtons.forEach(button => button.addEventListener('click',()=>showCases(button.dataset.filter)));
showCases('part');
document.querySelector('#copy-address').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  const address = '경기 화성시 효행구 봉담읍 와우안길 80 서후 팰리스 3층 301호';
  try { await navigator.clipboard.writeText(address); status.textContent = '주소를 복사했습니다.'; }
  catch { status.textContent = address; }
});
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
if ('IntersectionObserver' in window) {
 const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('is-visible', entry.isIntersecting);
 }),{threshold:0.08});
 document.querySelectorAll('.intro-grid,.principles,.section-heading,.case,.menu-grid,.director-grid,.steps,.hygiene,.faq-grid,.contact-grid,.studio-photo,.process-films').forEach(element=>{
  element.classList.add('reveal');revealObserver.observe(element);
 });
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
