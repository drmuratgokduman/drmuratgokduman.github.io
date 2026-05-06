// ─── Admin Panel ─────────────────────────────────────────────

function renderLogin(container) {
  container.innerHTML =
    '<div class="login-page"><div class="login-card">' +
      '<div class="login-logo"><h1>⚡ Admin Paneli</h1><p>Portfolyonuzu yönetin</p></div>' +
      '<div class="login-error" id="login-error">Giriş başarısız! Bilgileri kontrol edin.</div>' +
      '<form id="login-form">' +
        '<div class="form-group"><label class="form-label">E-posta</label>' +
        '<input type="email" class="form-input" id="login-email" placeholder="E-posta adresi (Firebase kurulu değilse boş geçin)" autofocus></div>' +
        '<div class="form-group"><label class="form-label">Şifre</label>' +
        '<input type="password" class="form-input" id="login-password" placeholder="Şifrenizi girin"></div>' +
        '<button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center">Giriş Yap</button>' +
      '</form>' +
      '<div style="text-align:center;margin-top:1.5rem"><a href="#/" style="font-size:0.875rem;color:var(--text-muted)">← Siteye Dön</a></div>' +
    '</div></div>';

  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var email = document.getElementById('login-email').value || 'admin@example.com';
    var pw = document.getElementById('login-password').value;
    try {
      await store.login(email, pw);
      setAuth(true); showToast('Giriş başarılı!','success'); navigate('/admin');
    } catch(err) {
      document.getElementById('login-error').classList.add('show');
      setTimeout(function(){ var el=document.getElementById('login-error'); if(el) el.classList.remove('show'); }, 3000);
    }
  });
}

async function renderAdmin(container, route) {
  var subRoute = route.replace('/admin','') || '/dashboard';

  container.innerHTML =
    '<div class="admin-layout">' +
      '<aside class="admin-sidebar" id="admin-sidebar">' +
        '<button class="admin-sidebar-close" id="sidebar-close">✕</button>' +
        '<div class="admin-sidebar-header"><span style="font-size:1.5rem">⚡</span><span class="admin-sidebar-logo">Admin</span></div>' +
        '<nav class="admin-sidebar-nav">' +
          '<div class="admin-nav-item '+(subRoute==='/dashboard'?'active':'')+'" data-route="/admin/dashboard"><span class="admin-nav-item-icon">📊</span>Dashboard</div>' +
          '<div class="admin-nav-item '+(subRoute==='/profile'?'active':'')+'" data-route="/admin/profile"><span class="admin-nav-item-icon">👤</span>Profil</div>' +
          '<div class="admin-nav-item '+(subRoute.indexOf('/posts')===0?'active':'')+'" data-route="/admin/posts"><span class="admin-nav-item-icon">✍️</span>Yazılar</div>' +
          '<div class="admin-nav-item '+(subRoute.indexOf('/projects')===0?'active':'')+'" data-route="/admin/projects"><span class="admin-nav-item-icon">🚀</span>Projeler</div>' +
          '<div class="admin-nav-item '+(subRoute==='/settings'?'active':'')+'" data-route="/admin/settings"><span class="admin-nav-item-icon">⚙️</span>Ayarlar</div>' +
        '</nav>' +
        '<div class="admin-sidebar-footer">' +
          '<div class="admin-nav-item" id="admin-view-site"><span class="admin-nav-item-icon">🌐</span>Siteyi Görüntüle</div>' +
          '<div class="admin-nav-item" id="admin-logout" style="color:var(--danger)"><span class="admin-nav-item-icon">🚪</span>Çıkış Yap</div>' +
        '</div>' +
      '</aside>' +
      '<div class="admin-main">' +
        '<div class="admin-topbar">' +
          '<div style="display:flex;align-items:center;gap:1rem">' +
            '<button class="admin-menu-toggle" id="admin-menu-toggle">☰</button>' +
            '<span class="admin-topbar-title" id="admin-page-title">Dashboard</span>' +
          '</div>' +
          '<div class="admin-topbar-actions"><a href="#/" class="btn btn-ghost btn-sm">🌐 Site</a></div>' +
        '</div>' +
        '<div class="admin-content" id="admin-content"></div>' +
      '</div>' +
    '</div>';

  container.querySelectorAll('[data-route]').forEach(function(el) {
    el.addEventListener('click', function() { navigate(el.dataset.route); });
  });
  document.getElementById('admin-view-site').addEventListener('click', function() { navigate('/'); });
  document.getElementById('admin-logout').addEventListener('click', async function() { await store.logout(); setAuth(false); showToast('Çıkış yapıldı','info'); navigate('/'); });

  var sidebar = document.getElementById('admin-sidebar');
  document.getElementById('admin-menu-toggle').addEventListener('click', function() { sidebar.classList.add('open'); });
  document.getElementById('sidebar-close').addEventListener('click', function() { sidebar.classList.remove('open'); });

  var content = document.getElementById('admin-content');
  var title = document.getElementById('admin-page-title');
  content.innerHTML = '<div style="color:var(--accent)">Yükleniyor...</div>';

  if (subRoute==='/dashboard'||subRoute==='') { title.textContent='Dashboard'; await renderDashboard(content); }
  else if (subRoute==='/profile') { title.textContent='Profil Düzenle'; await renderProfileEditor(content); }
  else if (subRoute==='/posts') { title.textContent='Yazılar'; await renderPostsManager(content); }
  else if (subRoute.indexOf('/posts/new')===0) { title.textContent='Yeni Yazı'; await renderPostEditor(content,null); }
  else if (subRoute.indexOf('/posts/edit/')===0) { title.textContent='Yazı Düzenle'; await renderPostEditor(content,subRoute.split('/posts/edit/')[1]); }
  else if (subRoute==='/projects') { title.textContent='Projeler'; await renderProjectsManager(content); }
  else if (subRoute.indexOf('/projects/new')===0) { title.textContent='Yeni Proje'; await renderProjectEditor(content,null); }
  else if (subRoute.indexOf('/projects/edit/')===0) { title.textContent='Proje Düzenle'; await renderProjectEditor(content,subRoute.split('/projects/edit/')[1]); }
  else if (subRoute==='/settings') { title.textContent='Ayarlar'; await renderSettingsPage(content); }
  else { await renderDashboard(content); }
}

async function renderDashboard(el) {
  var stats = await store.getStats(); var profile = await store.getProfile();
  el.innerHTML =
    '<div class="dashboard-welcome page-enter"><h2>Hoşgeldin, '+escapeHtml(profile.name.split(' ')[0])+' 👋</h2><p>Portfolyonuzu buradan yönetebilirsiniz.</p></div>' +
    '<div class="dashboard-stats page-enter">' +
      '<div class="dashboard-stat"><div class="dashboard-stat-icon posts">✍️</div><div class="dashboard-stat-value">'+stats.postCount+'</div><div class="dashboard-stat-label">Yazı</div></div>' +
      '<div class="dashboard-stat"><div class="dashboard-stat-icon projects">🚀</div><div class="dashboard-stat-value">'+stats.projectCount+'</div><div class="dashboard-stat-label">Proje</div></div>' +
      '<div class="dashboard-stat"><div class="dashboard-stat-icon images">🖼️</div><div class="dashboard-stat-value">'+stats.totalImages+'</div><div class="dashboard-stat-label">Fotoğraf</div></div>' +
    '</div>';
}

async function renderProfileEditor(el) {
  var p = await store.getProfile();
  el.innerHTML =
    '<div class="editor-form page-enter">' +
      '<div class="profile-photo-editor">' +
        '<div class="profile-photo-preview" id="photo-preview">'+(p.photo?'<img src="'+p.photo+'" alt="Profil">':'<span class="placeholder">👤</span>')+'</div>' +
        '<div class="profile-photo-actions">' +
          '<button class="btn btn-secondary btn-sm" id="photo-upload-btn">📷 Fotoğraf Yükle</button>' +
          (p.photo?'<button class="btn btn-danger btn-sm" id="photo-remove-btn">Kaldır</button>':'') +
          '<input type="file" id="photo-input" accept="image/*" style="display:none">' +
        '</div>' +
      '</div>' +
      '<form id="profile-form">' +
        '<div class="form-group"><label class="form-label">Ad Soyad</label><input class="form-input" id="pf-name" value="'+escapeHtml(p.name)+'"></div>' +
        '<div class="form-group"><label class="form-label">Ünvan</label><input class="form-input" id="pf-title" value="'+escapeHtml(p.title)+'"></div>' +
        '<div class="form-group"><label class="form-label">Kısa Tanıtım</label><textarea class="form-textarea" id="pf-bio" rows="3">'+escapeHtml(p.bio)+'</textarea></div>' +
        '<div class="form-group"><label class="form-label">Hakkımda (Detaylı)</label><textarea class="form-textarea" id="pf-about" rows="6">'+escapeHtml(p.about)+'</textarea></div>' +
        '<div class="form-group"><label class="form-label">E-posta</label><input class="form-input" id="pf-email" value="'+escapeHtml(p.email)+'"></div>' +
        '<div class="form-group"><label class="form-label">GitHub URL</label><input class="form-input" id="pf-github" value="'+escapeHtml(p.github)+'"></div>' +
        '<div class="form-group"><label class="form-label">LinkedIn URL</label><input class="form-input" id="pf-linkedin" value="'+escapeHtml(p.linkedin)+'"></div>' +
        '<div class="form-group"><label class="form-label">Twitter URL</label><input class="form-input" id="pf-twitter" value="'+escapeHtml(p.twitter)+'"></div>' +
        '<button type="submit" class="btn btn-primary btn-lg">💾 Kaydet</button>' +
      '</form>' +
    '</div>';

  document.getElementById('photo-upload-btn').onclick = function() { document.getElementById('photo-input').click(); };
  document.getElementById('photo-input').addEventListener('change', function(e) {
    var file = e.target.files[0]; if (!file) return;
    resizeImage(file, 400).then(function(base64) {
      store.updateProfile({photo:base64});
      document.getElementById('photo-preview').innerHTML='<img src="'+base64+'" alt="Profil">';
      showToast('Fotoğraf güncellendi!');
    }).catch(function() { showToast('Fotoğraf yüklenemedi','error'); });
  });
  var removeBtn = document.getElementById('photo-remove-btn');
  if (removeBtn) removeBtn.addEventListener('click', function() {
    store.updateProfile({photo:''}); document.getElementById('photo-preview').innerHTML='<span class="placeholder">👤</span>'; showToast('Fotoğraf kaldırıldı');
  });

  document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    store.updateProfile({
      name:document.getElementById('pf-name').value, title:document.getElementById('pf-title').value,
      bio:document.getElementById('pf-bio').value, about:document.getElementById('pf-about').value,
      email:document.getElementById('pf-email').value, github:document.getElementById('pf-github').value,
      linkedin:document.getElementById('pf-linkedin').value, twitter:document.getElementById('pf-twitter').value
    });
    showToast('Profil kaydedildi!');
  });
}

async function renderPostsManager(el) {
  var posts = await store.getPosts();
  el.innerHTML =
    '<div class="page-enter"><div class="item-list-header"><h2>Yazılar ('+posts.length+')</h2><button class="btn btn-primary" id="add-post-btn">+ Yeni Yazı</button></div>' +
    (posts.length ? posts.map(function(post) {
      return '<div class="item-row"><div class="item-row-thumb">✍️</div><div class="item-row-info"><div class="item-row-title">'+escapeHtml(post.title)+'</div><div class="item-row-meta"><span>'+formatDate(post.date)+'</span></div></div><div class="item-row-actions"><button class="btn btn-ghost btn-sm edit-post-btn" data-id="'+post.id+'">✏️ Düzenle</button><button class="btn btn-danger btn-sm delete-post-btn" data-id="'+post.id+'">🗑️</button></div></div>';
    }).join('') : '<div class="empty-state"><div class="empty-state-icon">✍️</div><div class="empty-state-title">Henüz yazı yok</div></div>') +
    '</div>';

  document.getElementById('add-post-btn').onclick = function() { navigate('/admin/posts/new'); };
  el.querySelectorAll('.edit-post-btn').forEach(function(btn) { btn.onclick = function() { navigate('/admin/posts/edit/'+btn.dataset.id); }; });
  el.querySelectorAll('.delete-post-btn').forEach(function(btn) {
    btn.onclick = function() { showConfirm('Yazıyı Sil','Bu yazıyı silmek istediğinize emin misiniz?').then(function(ok){ if(ok){store.deletePost(btn.dataset.id);showToast('Yazı silindi');navigate('/admin/posts');} }); };
  });
}

async function renderPostEditor(el, postId) {
  var post = postId ? await store.getPost(postId) : {title:'',summary:'',content:'',date:new Date().toISOString().split('T')[0],tags:[]};
  if (!post) { el.innerHTML='<p>Yazı bulunamadı.</p>'; return; }
  el.innerHTML =
    '<div class="page-enter"><div class="editor-header"><button class="btn btn-ghost" id="back-btn">← Geri</button></div>' +
    '<form id="post-form" class="editor-form">' +
      '<div class="form-group"><label class="form-label">Başlık</label><input class="form-input" id="pe-title" value="'+escapeHtml(post.title)+'" required></div>' +
      '<div class="form-group"><label class="form-label">Özet</label><textarea class="form-textarea" id="pe-summary" rows="2">'+escapeHtml(post.summary)+'</textarea></div>' +
      '<div class="form-group"><label class="form-label">İçerik</label><textarea class="form-textarea" id="pe-content" rows="10">'+escapeHtml(post.content)+'</textarea></div>' +
      '<div class="form-group"><label class="form-label">Tarih</label><input class="form-input" type="date" id="pe-date" value="'+post.date+'"></div>' +
      '<div class="form-group"><label class="form-label">Etiketler (virgülle ayırın)</label><input class="form-input" id="pe-tags" value="'+(post.tags||[]).join(', ')+'"></div>' +
      '<div style="display:flex;gap:1rem"><button type="submit" class="btn btn-primary btn-lg">💾 '+(postId?'Güncelle':'Yayınla')+'</button><button type="button" class="btn btn-secondary btn-lg" id="cancel-btn">İptal</button></div>' +
    '</form></div>';

  document.getElementById('back-btn').onclick = function() { navigate('/admin/posts'); };
  document.getElementById('cancel-btn').onclick = function() { navigate('/admin/posts'); };
  document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var data = { title:document.getElementById('pe-title').value, summary:document.getElementById('pe-summary').value, content:document.getElementById('pe-content').value, date:document.getElementById('pe-date').value, tags:document.getElementById('pe-tags').value.split(',').map(function(t){return t.trim();}).filter(Boolean) };
    if (postId) { store.updatePost(postId,data); showToast('Yazı güncellendi!'); }
    else { store.addPost(data); showToast('Yazı eklendi!'); }
    navigate('/admin/posts');
  });
}

async function renderProjectsManager(el) {
  var projects = await store.getProjects();
  el.innerHTML =
    '<div class="page-enter"><div class="item-list-header"><h2>Projeler ('+projects.length+')</h2><button class="btn btn-primary" id="add-proj-btn">+ Yeni Proje</button></div>' +
    (projects.length ? projects.map(function(proj) {
      return '<div class="item-row"><div class="item-row-thumb">'+(proj.images&&proj.images.length?'<img src="'+proj.images[0]+'" alt="">':'📁')+'</div><div class="item-row-info"><div class="item-row-title">'+escapeHtml(proj.title)+'</div><div class="item-row-meta"><span>'+formatDate(proj.date)+'</span><span>'+(proj.technologies||[]).join(', ')+'</span></div></div><div class="item-row-actions"><button class="btn btn-ghost btn-sm edit-proj-btn" data-id="'+proj.id+'">✏️ Düzenle</button><button class="btn btn-danger btn-sm delete-proj-btn" data-id="'+proj.id+'">🗑️</button></div></div>';
    }).join('') : '<div class="empty-state"><div class="empty-state-icon">🚀</div><div class="empty-state-title">Henüz proje yok</div></div>') +
    '</div>';

  document.getElementById('add-proj-btn').onclick = function() { navigate('/admin/projects/new'); };
  el.querySelectorAll('.edit-proj-btn').forEach(function(btn) { btn.onclick = function() { navigate('/admin/projects/edit/'+btn.dataset.id); }; });
  el.querySelectorAll('.delete-proj-btn').forEach(function(btn) {
    btn.onclick = function() { showConfirm('Projeyi Sil','Bu projeyi silmek istediğinize emin misiniz?').then(function(ok){ if(ok){store.deleteProject(btn.dataset.id);showToast('Proje silindi');navigate('/admin/projects');} }); };
  });
}

async function renderProjectEditor(el, projId) {
  var proj = projId ? await store.getProject(projId) : {title:'',description:'',technologies:[],liveUrl:'',githubUrl:'',images:[],date:new Date().toISOString().split('T')[0]};
  if (!proj) { el.innerHTML='<p>Proje bulunamadı.</p>'; return; }
  var images = (proj.images||[]).slice();

  el.innerHTML =
    '<div class="page-enter"><div class="editor-header"><button class="btn btn-ghost" id="back-btn">← Geri</button></div>' +
    '<form id="proj-form" class="editor-form">' +
      '<div class="form-group"><label class="form-label">Proje Adı</label><input class="form-input" id="prj-title" value="'+escapeHtml(proj.title)+'" required></div>' +
      '<div class="form-group"><label class="form-label">Açıklama</label><textarea class="form-textarea" id="prj-desc" rows="4">'+escapeHtml(proj.description)+'</textarea></div>' +
      '<div class="form-group"><label class="form-label">Teknolojiler (virgülle ayırın)</label><input class="form-input" id="prj-tech" value="'+(proj.technologies||[]).join(', ')+'"></div>' +
      '<div class="form-group"><label class="form-label">Canlı URL</label><input class="form-input" id="prj-live" value="'+escapeHtml(proj.liveUrl)+'"></div>' +
      '<div class="form-group"><label class="form-label">GitHub URL</label><input class="form-input" id="prj-github" value="'+escapeHtml(proj.githubUrl)+'"></div>' +
      '<div class="form-group"><label class="form-label">Tarih</label><input class="form-input" type="date" id="prj-date" value="'+proj.date+'"></div>' +
      '<div class="form-group"><label class="form-label">Proje Fotoğrafları</label>' +
        '<div class="upload-area" id="upload-area"><div style="font-size:2.25rem;margin-bottom:0.75rem">📷</div><div>Fotoğraf yüklemek için tıklayın</div></div>' +
        '<input type="file" id="proj-images-input" accept="image/*" multiple style="display:none">' +
        '<div class="image-grid" id="images-grid"></div>' +
      '</div>' +
      '<div style="display:flex;gap:1rem"><button type="submit" class="btn btn-primary btn-lg">💾 '+(projId?'Güncelle':'Ekle')+'</button><button type="button" class="btn btn-secondary btn-lg" id="cancel-btn">İptal</button></div>' +
    '</form></div>';

  function renderImgs() {
    var grid=document.getElementById('images-grid');
    grid.innerHTML=images.map(function(img,i){return '<div class="image-grid-item"><img src="'+img+'" alt=""><div class="remove-btn" data-index="'+i+'">✕</div></div>';}).join('');
    grid.querySelectorAll('.remove-btn').forEach(function(btn){btn.onclick=function(){images.splice(parseInt(btn.dataset.index),1);renderImgs();};});
  }
  renderImgs();

  document.getElementById('upload-area').onclick=function(){document.getElementById('proj-images-input').click();};
  document.getElementById('proj-images-input').addEventListener('change',function(e){
    var promises=[];
    for(var i=0;i<e.target.files.length;i++) promises.push(resizeImage(e.target.files[i],800));
    Promise.all(promises).then(function(results){results.forEach(function(b){images.push(b);});renderImgs();}).catch(function(){showToast('Bazı fotoğraflar yüklenemedi','error');});
    e.target.value='';
  });

  document.getElementById('back-btn').onclick=function(){navigate('/admin/projects');};
  document.getElementById('cancel-btn').onclick=function(){navigate('/admin/projects');};
  document.getElementById('proj-form').addEventListener('submit',function(e){
    e.preventDefault();
    var data={title:document.getElementById('prj-title').value,description:document.getElementById('prj-desc').value,technologies:document.getElementById('prj-tech').value.split(',').map(function(t){return t.trim();}).filter(Boolean),liveUrl:document.getElementById('prj-live').value,githubUrl:document.getElementById('prj-github').value,date:document.getElementById('prj-date').value,images:images};
    if(projId){store.updateProject(projId,data);showToast('Proje güncellendi!');}else{store.addProject(data);showToast('Proje eklendi!');}
    navigate('/admin/projects');
  });
}

async function renderSettingsPage(el) {
  var settings = await store.getSettings();
  el.innerHTML =
    '<div class="editor-form page-enter"><form id="settings-form">' +
      '<div class="form-group"><label class="form-label">Site Başlığı</label><input class="form-input" id="st-title" value="'+escapeHtml(settings.siteTitle)+'"></div>' +
      '<div class="form-group"><label class="form-label">Admin Şifresi</label><input class="form-input" type="password" id="st-password" placeholder="Yeni şifre (boş bırakırsanız değişmez)"></div>' +
      '<button type="submit" class="btn btn-primary btn-lg">💾 Kaydet</button>' +
    '</form>' +
    '<div style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border)"><h3 style="margin-bottom:1rem;color:var(--danger)">Tehlikeli Bölge</h3><button class="btn btn-danger" id="reset-btn">🗑️ Tüm Verileri Sıfırla</button></div></div>';

  document.getElementById('settings-form').addEventListener('submit',function(e){
    e.preventDefault();
    var updates={siteTitle:document.getElementById('st-title').value};
    var pw=document.getElementById('st-password').value;
    if(pw) updates.adminPassword=pw;
    store.updateSettings(updates);
    if(updates.siteTitle) document.title = updates.siteTitle;
    showToast('Ayarlar kaydedildi!');
  });
  document.getElementById('reset-btn').addEventListener('click',function(){
    showConfirm('Verileri Sıfırla','Tüm veriler silinip varsayılan duruma dönecek. Emin misiniz?').then(function(ok){if(ok){store.resetAll();showToast('Veriler sıfırlandı');navigate('/admin/dashboard');}});
  });
}
