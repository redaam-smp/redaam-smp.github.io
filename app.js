const filterButtons = document.querySelectorAll('[data-filter]');
const grid = document.querySelector('.portfolio-grid');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.filter;
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = value !== 'all' && card.dataset.category !== value; });
  grid.classList.toggle('filtered', value !== 'all');
}));
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

const heroVideo = document.querySelector('#hero-video');
const heroVideoToggle = document.querySelector('#hero-video-toggle');
if(heroVideo && heroVideoToggle){
 const syncHeroVideoButton = () => {
  heroVideoToggle.textContent = heroVideo.paused ? '영상 재생 ▶' : '일시정지 Ⅱ';
  heroVideoToggle.setAttribute('aria-label',heroVideo.paused ? '히어로 영상 재생' : '히어로 영상 일시정지');
 };
 heroVideo.muted = true;
 heroVideo.addEventListener('play',syncHeroVideoButton);
 heroVideo.addEventListener('pause',syncHeroVideoButton);
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){heroVideo.autoplay=false;heroVideo.pause();}
 else {heroVideo.play().catch(syncHeroVideoButton);}
 heroVideoToggle.addEventListener('click',()=>{if(heroVideo.paused){heroVideo.play().catch(syncHeroVideoButton);}else{heroVideo.pause();}});
 syncHeroVideoButton();
}
