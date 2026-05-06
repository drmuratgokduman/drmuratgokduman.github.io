// ─── SPA Router & App Shell ──────────────────────────────────

var isLoggedIn = false;

function showToast(message, type) {
  type = type || 'success';
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var icons = { success: '✓', error: '✗', info: 'ℹ' };
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span class="toast-icon">' + (icons[type]||icons.info) + '</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('toast-out');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

function showConfirm(title, message) {
  return new Promise(function(resolve) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal">' +
        '<div class="modal-title">' + title + '</div>' +
        '<div class="modal-body">' + message + '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" id="modal-cancel">İptal</button>' +
          '<button class="btn btn-danger" id="modal-confirm">Sil</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#modal-cancel').onclick = function() { overlay.remove(); resolve(false); };
    overlay.querySelector('#modal-confirm').onclick = function() { overlay.remove(); resolve(true); };
    overlay.addEventListener('click', function(e) { if (e.target === overlay) { overlay.remove(); resolve(false); } });
  });
}

function getAuth() { return isLoggedIn; }
function setAuth(v) { isLoggedIn = v; if(!v) store.logout(); sessionStorage.setItem('admin_auth', v ? '1' : ''); }

function navigate(path) { window.location.hash = path; }

function getRoute() { return (window.location.hash.slice(1) || '/'); }

async function routeHandler() {
  var app = document.getElementById('app');
  var route = getRoute();
  app.innerHTML = '<div style="display:flex;justify-content:center;padding:5rem;color:var(--accent)">Yükleniyor...</div>';
  app.className = 'page-enter';

  if (route === '/' || route === '') { await renderPortfolio(app); }
  else if (route.indexOf('/post/') === 0) { await renderPostDetail(app, route.split('/post/')[1]); }
  else if (route === '/admin/login') { renderLogin(app); }
  else if (route.indexOf('/admin') === 0) {
    if (!isLoggedIn) { navigate('/admin/login'); return; }
    await renderAdmin(app, route);
  }
  else { await renderPortfolio(app); }
}

document.addEventListener('DOMContentLoaded', function() {
  store.checkAuth(function(authStatus) {
    isLoggedIn = authStatus;
    if(authStatus) sessionStorage.setItem('admin_auth', '1');
    store.getSettings().then(function(settings) {
      if (settings && settings.siteTitle) document.title = settings.siteTitle;
      window.addEventListener('hashchange', routeHandler);
      routeHandler();
    });
  });
});
