// ─── Portfolio Public Pages ──────────────────────────────────

async function renderPortfolio(container) {
  var profile = await store.getProfile();
  var posts = await store.getPosts();
  var projects = await store.getProjects();
  var stats = await store.getStats();
  var initial = profile.name ? profile.name.charAt(0).toUpperCase() : '?';

  container.innerHTML =
    '<nav class="nav" id="main-nav"><div class="nav-inner">' +
      '<a class="nav-logo" href="#/">' + escapeHtml(profile.name.split(' ')[0] || 'Portfolyo') + '</a>' +
      '<div class="nav-links" id="nav-links">' +
        '<a href="#hero" data-scroll="hero">Ana Sayfa</a>' +
        '<a href="#about" data-scroll="about">Hakkımda</a>' +
        '<a href="#posts" data-scroll="posts">Yazılarım</a>' +
        '<a href="#projects" data-scroll="projects">Projelerim</a>' +
        '<a href="#contact" data-scroll="contact">İletişim</a>' +
        '<a href="#/admin/login" class="nav-admin-link">⚙ Admin</a>' +
      '</div>' +
      '<button class="nav-toggle" id="nav-toggle">☰</button>' +
    '</div></nav>' +

    '<section class="hero" id="hero">' +
      '<div class="hero-bg"></div><div class="hero-orb hero-orb-1"></div><div class="hero-orb hero-orb-2"></div>' +
      '<div class="hero-content">' +
        '<div class="hero-photo">' +
          (profile.photo ? '<img src="'+profile.photo+'" alt="'+escapeHtml(profile.name)+'">' : '<div class="hero-photo-placeholder">'+initial+'</div>') +
        '</div>' +
        '<h1 class="hero-name">' + escapeHtml(profile.name) + '</h1>' +
        '<p class="hero-title">&lt; ' + escapeHtml(profile.title) + ' /&gt;</p>' +
        '<p class="hero-bio">' + escapeHtml(profile.bio) + '</p>' +
        '<div class="hero-actions">' +
          '<a href="#projects" class="btn btn-primary btn-lg" data-scroll="projects">Projelerimi Gör</a>' +
          '<a href="#contact" class="btn btn-secondary btn-lg" data-scroll="contact">İletişime Geç</a>' +
        '</div>' +
      '</div>' +
      '<div class="hero-scroll"><span>Aşağı Kaydır</span><div class="hero-scroll-line"></div></div>' +
    '</section>' +

    '<section class="about-section" id="about"><div class="container">' +
      '<h2 class="section-title reveal">Hakkımda</h2>' +
      '<p class="section-subtitle reveal">Kendimi tanıtmama izin verin</p>' +
      '<div class="about-content" style="margin-top:3rem">' +
        '<div class="about-text reveal">' +
          (profile.about ? profile.about.split('\n').filter(function(p){return p.trim();}).map(function(p){return '<p>'+escapeHtml(p)+'</p>';}).join('') : '<p>'+escapeHtml(profile.bio)+'</p>') +
        '</div>' +
        '<div class="about-stats reveal">' +
          '<div class="about-stat"><div class="about-stat-value">'+stats.projectCount+'</div><div class="about-stat-label">Proje</div></div>' +
          '<div class="about-stat"><div class="about-stat-value">'+stats.postCount+'</div><div class="about-stat-label">Yazı</div></div>' +
          '<div class="about-stat"><div class="about-stat-value">'+stats.totalImages+'</div><div class="about-stat-label">Fotoğraf</div></div>' +
          '<div class="about-stat"><div class="about-stat-value">∞</div><div class="about-stat-label">Tutku</div></div>' +
        '</div>' +
      '</div>' +
    '</div></section>' +

    '<section class="posts-section" id="posts"><div class="container">' +
      '<h2 class="section-title reveal">Yazılarım</h2>' +
      '<p class="section-subtitle reveal">Düşüncelerimi ve deneyimlerimi paylaşıyorum</p>' +
      (posts.length ?
        '<div class="posts-grid">' + posts.map(function(post){
          return '<article class="post-card reveal" data-post-id="'+post.id+'">' +
            '<div class="post-card-date">'+formatDate(post.date)+'</div>' +
            '<h3 class="post-card-title">'+escapeHtml(post.title)+'</h3>' +
            '<p class="post-card-summary">'+escapeHtml(truncateText(post.summary,150))+'</p>' +
            '<div class="post-card-tags">'+(post.tags||[]).map(function(t){return '<span class="tag">'+escapeHtml(t)+'</span>';}).join('')+'</div>' +
            '<div class="post-card-arrow">Devamını Oku →</div>' +
          '</article>';
        }).join('') + '</div>'
        : '<div class="empty-state reveal"><div class="empty-state-icon">✍️</div><div class="empty-state-title">Henüz yazı yok</div></div>') +
    '</div></section>' +

    '<section class="projects-section" id="projects"><div class="container">' +
      '<h2 class="section-title reveal">Projelerim</h2>' +
      '<p class="section-subtitle reveal">Üzerinde çalıştığım projeler</p>' +
      (projects.length ?
        '<div class="projects-grid">' + projects.map(function(proj){
          return '<div class="project-card reveal">' +
            '<div class="project-card-images">' +
              (proj.images && proj.images.length ? '<img src="'+proj.images[0]+'" alt="'+escapeHtml(proj.title)+'">' : '<div class="project-card-placeholder">📁</div>') +
            '</div>' +
            '<div class="project-card-body">' +
              '<h3 class="project-card-title">'+escapeHtml(proj.title)+'</h3>' +
              '<p class="project-card-desc">'+escapeHtml(truncateText(proj.description,120))+'</p>' +
              '<div class="project-card-tech">'+(proj.technologies||[]).map(function(t){return '<span class="tag">'+escapeHtml(t)+'</span>';}).join('')+'</div>' +
              '<div class="project-card-links">' +
                (proj.liveUrl ? '<a href="'+escapeHtml(proj.liveUrl)+'" target="_blank" class="btn btn-sm btn-primary">🌐 Canlı</a>' : '') +
                (proj.githubUrl ? '<a href="'+escapeHtml(proj.githubUrl)+'" target="_blank" class="btn btn-sm btn-secondary">GitHub</a>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('') + '</div>'
        : '<div class="empty-state reveal"><div class="empty-state-icon">🚀</div><div class="empty-state-title">Henüz proje yok</div></div>') +
    '</div></section>' +

    '<section class="contact-section" id="contact"><div class="container" style="text-align:center">' +
      '<h2 class="section-title reveal">İletişim</h2>' +
      '<p class="section-subtitle reveal">Benimle iletişime geçin</p>' +
      '<div class="contact-links reveal">' +
        (profile.email ? '<a href="mailto:'+escapeHtml(profile.email)+'" class="contact-link"><span class="contact-link-icon">✉</span>'+escapeHtml(profile.email)+'</a>' : '') +
        (profile.github ? '<a href="'+escapeHtml(profile.github)+'" target="_blank" class="contact-link"><span class="contact-link-icon">⌨</span>GitHub</a>' : '') +
        (profile.linkedin ? '<a href="'+escapeHtml(profile.linkedin)+'" target="_blank" class="contact-link"><span class="contact-link-icon">💼</span>LinkedIn</a>' : '') +
        (profile.twitter ? '<a href="'+escapeHtml(profile.twitter)+'" target="_blank" class="contact-link"><span class="contact-link-icon">🐦</span>Twitter</a>' : '') +
      '</div>' +
    '</div></section>' +

    '<footer class="footer"><div class="container">&copy; '+new Date().getFullYear()+' '+escapeHtml(profile.name)+'. Tüm hakları saklıdır.</div></footer>';

  setupPortfolioEvents(container);
}

function setupPortfolioEvents(container) {
  var reveals = container.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(function(el) { observer.observe(el); });

  var nav = container.querySelector('#main-nav');
  if (nav) { window.addEventListener('scroll', function() { nav.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true }); }

  var toggle = container.querySelector('#nav-toggle');
  var links = container.querySelector('#nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function() { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', function() { links.classList.remove('open'); }); });
  }

  container.querySelectorAll('[data-scroll]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.getElementById(el.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  container.querySelectorAll('.post-card').forEach(function(card) {
    card.addEventListener('click', function() { navigate('/post/' + card.getAttribute('data-post-id')); });
  });
}

async function renderPostDetail(container, postId) {
  var post = await store.getPost(postId);
  if (!post) {
    container.innerHTML = '<div class="post-detail container"><div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-title">Yazı bulunamadı</div><a href="#/" class="btn btn-primary" style="margin-top:1rem">Ana Sayfaya Dön</a></div></div>';
    return;
  }
  var contentHtml = post.content.split('\n').filter(function(p){return p.trim();}).map(function(p){return '<p>'+escapeHtml(p)+'</p>';}).join('');
  container.innerHTML =
    '<div class="post-detail container page-enter">' +
      '<a class="post-detail-back" href="#/">← Tüm Yazılar</a>' +
      '<div class="post-detail-date">'+formatDate(post.date)+'</div>' +
      '<h1>'+escapeHtml(post.title)+'</h1>' +
      '<div class="post-detail-tags">'+(post.tags||[]).map(function(t){return '<span class="tag">'+escapeHtml(t)+'</span>';}).join('')+'</div>' +
      '<div class="post-detail-content">'+contentHtml+'</div>' +
      '<div style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border)"><a href="#/" class="btn btn-secondary">← Geri Dön</a></div>' +
    '</div>';
  window.scrollTo(0, 0);
}
