const filterButtons = document.querySelectorAll('[data-filter]');
const grid = document.querySelector('.portfolio-grid');
const moreCases = document.querySelector('#more-cases');
let activeFilter = 'all';
let expandedCases = false;
function updateCases() {
 const matches = [...document.querySelectorAll('[data-category]')].filter(card => activeFilter === 'all' || card.dataset.category === activeFilter);
 document.querySelectorAll('[data-category]').forEach(card => { card.hidden = !matches.includes(card) || (!expandedCases && matches.indexOf(card) >= 3); });
 grid.classList.toggle('filtered', activeFilter !== 'all');
 moreCases.hidden = matches.length <= 3;
 moreCases.setAttribute('aria-expanded', String(expandedCases));
 moreCases.innerHTML = expandedCases ? '시술 사례 접기 <span>−</span>' : `시술 사례 더 보기 <span>+${Math.max(0,matches.length - 3)}</span>`;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
 activeFilter = button.dataset.filter;
 expandedCases = false;
 filterButtons.forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
 updateCases();
}));
moreCases.addEventListener('click', () => { expandedCases = !expandedCases; updateCases(); });
updateCases();
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
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
 const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
 }),{threshold:0.08});
 document.querySelectorAll('.intro-grid,.principles,.section-heading,.case,.menu-grid,.director-grid,.steps,.hygiene,.faq-grid,.contact-grid,.studio-photo').forEach(element=>{
  element.classList.add('reveal');revealObserver.observe(element);
 });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('#hero-video');
if (heroVideo) { heroVideo.muted = true; if(reducedMotion.matches){ heroVideo.autoplay = false; heroVideo.pause(); } else { heroVideo.play().catch(()=>{}); } }
const processVideos = document.querySelectorAll('video[data-src]');
if ('IntersectionObserver' in window) {
 const filmObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  const video = entry.target;
  if(entry.isIntersecting) {
   if(!video.getAttribute('src')) video.src = video.dataset.src;
   if(video.readyState === 0) video.load();
   video.muted = true;
   if(!reducedMotion.matches) video.play().catch(()=>{});
  } else video.pause();
 }), {threshold:0.15});
 processVideos.forEach(video => { if(reducedMotion.matches) video.autoplay=false; filmObserver.observe(video); });
} else processVideos.forEach(video => { video.src = video.dataset.src; video.muted = true; });
document.addEventListener('visibilitychange',()=>{
 document.querySelectorAll('video').forEach(video=>{if(document.hidden)video.pause();else if(!reducedMotion.matches){const r=video.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)video.play().catch(()=>{});}});
});
