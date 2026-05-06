// ─── Data Store (Firebase Firestore) ────────────────────────

// LÜTFEN KENDİ FIREBASE BİLGİLERİNİZİ BURAYA YAPIŞTIRIN:
var firebaseConfig = {
  apiKey: "AIzaSyCIegCDeb47cMwla9pL0g3eWxJeNlrVy8Q",
  authDomain: "portfolyom-609bb.firebaseapp.com",
  projectId: "portfolyom-609bb",
  storageBucket: "portfolyom-609bb.firebasestorage.app",
  messagingSenderId: "646636927925",
  appId: "1:646636927925:web:8033aab9e4aa538f1f77fc",
  measurementId: "G-KVD4Z9SL31"
};

var isFirebaseEnabled = firebaseConfig.apiKey !== "YOUR_API_KEY";
if (isFirebaseEnabled) {
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  var auth = firebase.auth();
}

var DEFAULT_DATA = {
  profile: {
    name: 'Adınız Soyadınız', title: 'VR & 3D Geliştirici',
    bio: 'Sanal gerçeklik ve 3D modelleme üzerine uzmanlaşmış profesyonel geliştirici.',
    about: 'Sanal dünyalar inşa etmek benim tutkum...',
    photo: '', email: 'email@example.com', github: '', linkedin: '', twitter: ''
  },
  posts: [
    { id: 'demo-1', title: 'Hoşgeldiniz', summary: 'Bu bir deneme yazısıdır.', content: 'Firebase kurulmadı, yerel veriler gösteriliyor.', date: '2026-05-06', tags: ['sistem'] }
  ],
  projects: [
    { id: 'proj-1', title: 'VR Deneyimi', description: 'Örnek 3D proje.', technologies: ['Unity', 'C#'], liveUrl: '', githubUrl: '', images: [], date: '2026-05-01' }
  ],
  settings: { siteTitle: 'Portfolyom', heroLayout: 'centered' }
};

var store = {
  _mem: JSON.parse(JSON.stringify(DEFAULT_DATA)),

  login: async function(email, password) {
    if(!isFirebaseEnabled) {
      if(password === 'admin') return true;
      throw new Error('Firebase kapalıyken şifre: admin');
    }
    await auth.signInWithEmailAndPassword(email, password);
    return true;
  },
  logout: async function() {
    if(isFirebaseEnabled) await auth.signOut();
  },
  checkAuth: function(cb) {
    if(!isFirebaseEnabled) return cb(sessionStorage.getItem('admin_auth') === '1');
    auth.onAuthStateChanged(function(user){ cb(!!user); });
  },

  getProfile: async function() {
    if(!isFirebaseEnabled) return Object.assign({}, this._mem.profile);
    try {
      var doc = await db.collection('portfolio').doc('profile').get();
      return doc.exists ? doc.data() : this._mem.profile;
    } catch(e) { console.error("Firebase Hatası:", e); return this._mem.profile; }
  },
  updateProfile: async function(u) {
    if(!isFirebaseEnabled) { Object.assign(this._mem.profile, u); return; }
    await db.collection('portfolio').doc('profile').set(u, {merge:true});
  },

  getPosts: async function() {
    if(!isFirebaseEnabled) return this._mem.posts.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    try {
      var snap = await db.collection('posts').orderBy('date','desc').get();
      return snap.docs.map(function(d){var data=d.data(); data.id=d.id; return data;});
    } catch(e) { console.error("Firebase Hatası:", e); return this._mem.posts; }
  },
  getPost: async function(id) {
    if(!isFirebaseEnabled) return this._mem.posts.find(function(p){return p.id===id;});
    try {
      var doc = await db.collection('posts').doc(id).get();
      if(!doc.exists) return null; var data=doc.data(); data.id=doc.id; return data;
    } catch(e) { console.error("Firebase Hatası:", e); return null; }
  },
  addPost: async function(post) {
    if(!isFirebaseEnabled) { post.id=generateId(); this._mem.posts.unshift(post); return post; }
    await db.collection('posts').add(post);
  },
  updatePost: async function(id, u) {
    if(!isFirebaseEnabled) { var p=this._mem.posts.find(function(x){return x.id===id;}); Object.assign(p,u); return; }
    await db.collection('posts').doc(id).update(u);
  },
  deletePost: async function(id) {
    if(!isFirebaseEnabled) { this._mem.posts=this._mem.posts.filter(function(p){return p.id!==id;}); return; }
    await db.collection('posts').doc(id).delete();
  },

  getProjects: async function() {
    if(!isFirebaseEnabled) return this._mem.projects.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    try {
      var snap = await db.collection('projects').orderBy('date','desc').get();
      return snap.docs.map(function(d){var data=d.data(); data.id=d.id; return data;});
    } catch(e) { console.error("Firebase Hatası:", e); return this._mem.projects; }
  },
  getProject: async function(id) {
    if(!isFirebaseEnabled) return this._mem.projects.find(function(p){return p.id===id;});
    try {
      var doc = await db.collection('projects').doc(id).get();
      if(!doc.exists) return null; var data=doc.data(); data.id=doc.id; return data;
    } catch(e) { console.error("Firebase Hatası:", e); return null; }
  },
  addProject: async function(proj) {
    if(!isFirebaseEnabled) { proj.id=generateId(); this._mem.projects.unshift(proj); return proj; }
    await db.collection('projects').add(proj);
  },
  updateProject: async function(id, u) {
    if(!isFirebaseEnabled) { var p=this._mem.projects.find(function(x){return x.id===id;}); Object.assign(p,u); return; }
    await db.collection('projects').doc(id).update(u);
  },
  deleteProject: async function(id) {
    if(!isFirebaseEnabled) { this._mem.projects=this._mem.projects.filter(function(p){return p.id!==id;}); return; }
    await db.collection('projects').doc(id).delete();
  },

  getSettings: async function() {
    var def = Object.assign({}, this._mem.settings);
    if(!isFirebaseEnabled) return def;
    try {
      var doc = await db.collection('portfolio').doc('settings').get();
      return doc.exists ? Object.assign(def, doc.data()) : def;
    } catch(e) { console.error("Firebase Hatası:", e); return def; }
  },
  updateSettings: async function(u) {
    if(!isFirebaseEnabled) { Object.assign(this._mem.settings, u); return; }
    await db.collection('portfolio').doc('settings').set(u, {merge:true});
  },
  
  getStats: async function() {
    var posts = await this.getPosts();
    var projs = await this.getProjects();
    return {
      postCount: posts.length,
      projectCount: projs.length,
      totalImages: projs.reduce(function(s,p){return s+(p.images?p.images.length:0);},0)
    };
  }
};
