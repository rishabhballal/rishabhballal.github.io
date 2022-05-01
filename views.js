let page = 'main';
const views = Array.from(document.querySelectorAll('.page'))
  .slice(1).map(s => s.id);

function renderPage(id) {
  if (!views.includes(window.location.hash.slice(1)))
    window.location.replace('/');
  document.getElementById(page).classList.add('hidden');
  clearInterval(interval);
  document.getElementById(id).classList.remove('hidden');
  const title = id[0].toUpperCase().concat(id.slice(1)).split('-').join(' ');
  document.title = `${title} - Rishabh Ballal`;
  page = id;
}

if (window.location.hash) {
  renderPage(window.location.hash.slice(1));
} else {
  if (window.innerWidth > breakpoint) {
    const canvas = document.getElementById('canvas-moebius1');
    canvas.remove();
    document.getElementById('main').appendChild(canvas);
  }
  document.getElementById('main').classList.remove('hidden');
}

window.addEventListener('popstate', () => {
  if (!window.location.hash) window.location.replace('/');
  renderPage(window.location.hash.slice(1));
});


let active = document.getElementById('active').value;
const subnav = document.querySelectorAll('.subnav button');
document.getElementById(active).classList.remove('hidden');
subnav.forEach(btn => {
  if (window.innerWidth < breakpoint) return;
  if (btn.value != active)
    document.getElementById(btn.value).classList.add('hidden');
  btn.addEventListener('click', e => {
    if (event.target.value == active) return;
    Array.from(subnav).find(i => i.value == active).id = '';
    e.target.id = 'active';
    document.getElementById(active).classList.add('hidden');
    document.getElementById(e.target.value).classList.remove('hidden');
    active = e.target.value;
  });
});
