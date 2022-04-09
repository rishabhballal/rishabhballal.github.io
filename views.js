let page = 'main';
const views = Array.from(document.querySelectorAll('.page'))
  .slice(1).map(s => s.id);

function renderPage(id) {
  if (views.includes(window.location.hash.slice(1))) {
    document.getElementById(page).classList.add('hidden');
    clearInterval(interval);
    document.getElementById(id).classList.remove('hidden');
    const title = id[0].toUpperCase().concat(id.slice(1)).split('-').join(' ');
    document.title = `${title} - Rishabh Ballal`;
    page = id;
  } else {
    window.location.replace('/');
  }
}

if (window.location.hash) {
  renderPage(window.location.hash.slice(1));
} else {
  document.getElementById('main').classList.remove('hidden');
}

window.addEventListener('popstate', () => {
  if (window.location.hash) {
    renderPage(window.location.hash.slice(1));
  } else {
    window.location.replace('/');
  }
});


let active = document.getElementById('active').value;
const nav = document.querySelectorAll('nav button');
document.getElementById(active).classList.remove('hidden');
nav.forEach(btn => {
  btn.addEventListener('click', e => {
    if (event.target.value != active) {
      Array.from(nav).find(i => i.value == active).id = '';
      e.target.id = 'active';
      document.getElementById(active).classList.add('hidden');
      document.getElementById(e.target.value).classList.remove('hidden');
      active = e.target.value;
    }
  });
});
