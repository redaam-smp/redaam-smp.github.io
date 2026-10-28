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
