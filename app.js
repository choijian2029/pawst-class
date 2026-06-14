// ── PAWST CLASS v4.0 ──
// 심플 재설계 · 2026

var curLang     = 'ko';
var _curScreen  = 's-splash';
var _curTab     = 'home';
var _selAirline = '';
var _editAirline = '';
var _dogFilter  = 'all';

var SUPER_ADMIN_EMAIL = 'pawstclass.1@gmail.com';

// ══════════════════════════════════════
// 언어 토글
// ══════════════════════════════════════
function togLang() {
  curLang = curLang === 'ko' ? 'en' : 'ko';
  applyLang();
  var label = curLang === 'ko' ? 'ENG' : '한국어';
  ['lang-btn','lang-btn-vol'].forEach(function(id) {
    var btn = document.getElementById(id);
    if (btn) btn.textContent = label;
  });
}
function applyLang() {
  document.querySelectorAll('[data-ko]').forEach(function(el) {
    var txt = curLang === 'ko' ? el.getAttribute('data-ko') : el.getAttribute('data-en');
    if (txt) el.innerHTML = txt;
  });
}

// ══════════════════════════════════════
// 화면 전환
// ══════════════════════════════════════
function scGo(id) {
  document.querySelectorAll('.sc').forEach(function(el) { el.classList.remove('on'); });
  var el = document.getElementById(id);
  if (el) el.classList.add('on');
  _curScreen = id;
  history.pushState({ screen: id }, '', '');
}

// ══════════════════════════════════════
// 봉사자 메인 탭 전환
// ══════════════════════════════════════
function setTab(t) {
  _curTab = t;
  ['home','register','dogs','mypage'].forEach(function(id) {
    var el = document.getElementById('t-' + id);
    if (el) el.style.display = id === t ? 'block' : 'none';
  });
  document.querySelectorAll('.ni').forEach(function(btn) {
    var oc = btn.getAttribute('onclick') || '';
    btn.classList.toggle('on', oc.indexOf("'" + t + "'") > -1 || oc.indexOf('"' + t + '"') > -1);
  });
  if (t === 'home')     loadHome();
  if (t === 'register') loadMyFlights();
  if (t === 'dogs')     loadDogs();
  if (t === 'mypage')   loadMyPage();
  history.pushState({ screen: 's-main', tab: t }, '', '');
}

// ══════════════════════════════════════
// 기관 대시보드 탭 전환
// ══════════════════════════════════════
function setDashTab(t) {
  ['dogs','vols','done'].forEach(function(id) {
    var el = document.getElementById('dash-' + id);
    if (el) el.style.display = id === t ? 'block' : 'none';
    var btn = document.getElementById('dt-' + id);
    if (btn) btn.classList.toggle('on', id === t);
  });
  if (t === 'dogs') loadDashDogs();
  if (t === 'vols') loadDashVols();
  if (t === 'done') loadDashDone();
}

// ══════════════════════════════════════
// 온보딩
// ══════════════════════════════════════
var _obI = 0;
function goOb() { _obI = 0; rOb(); scGo('s-ob'); }
function rOb() {
  var slides = document.getElementById('ob-slides');
  if (slides) slides.style.transform = 'translateX(-' + (_obI * 100) + '%)';
  document.querySelectorAll('.ob-dot').forEach(function(d, i) { d.classList.toggle('on', i === _obI); });
  var btn = document.getElementById('ob-btn');
  if (btn) {
    var isLast = _obI >= 2;
    btn.setAttribute('data-ko', isLast ? '시작하기' : '다음');
    btn.setAttribute('data-en', isLast ? 'Get Started' : 'Next');
    btn.textContent = curLang === 'ko' ? (isLast ? '시작하기' : '다음') : (isLast ? 'Get Started' : 'Next');
  }
}
function obNext() {
  if (_obI < 2) { _obI++; rOb(); }
  else scGo('s-splash');
}

// ══════════════════════════════════════
// 봉사자 로그인 탭 전환
// ══════════════════════════════════════
function volTab(t) {
  document.getElementById('vol-login-form').style.display  = t === 'login'  ? 'block' : 'none';
  document.getElementById('vol-signup-form').style.display = t === 'signup' ? 'block' : 'none';
  document.getElementById('vol-tab-login').classList.toggle('on',  t === 'login');
  document.getElementById('vol-tab-signup').classList.toggle('on', t === 'signup');
  document.getElementById('vol-err').style.display = 'none';
}

// ══════════════════════════════════════
// 구글 로그인
// ══════════════════════════════════════
function doGoogleLogin() {
  var isKo = curLang === 'ko';
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(function(e) {
      var msg = isKo ? '구글 로그인에 실패했습니다.' : 'Google login failed.';
      if (e.code === 'auth/popup-closed-by-user')
        msg = isKo ? '로그인 창이 닫혔습니다. 다시 시도해 주세요.' : 'Login popup closed. Please try again.';
      else if (e.code === 'auth/popup-blocked')
        msg = isKo ? '팝업이 차단되었습니다. 브라우저 설정을 확인해 주세요.' : 'Popup blocked. Please check browser settings.';
      var errEl = document.getElementById('vol-err');
      if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    });
}

// 봉사자 로그인
function showVolErr(msg) {
  var el = document.getElementById('vol-err');
  el.textContent = msg; el.style.display = 'block';
}

function doVolLogin() {
  var email = (document.getElementById('vol-email').value || '').trim().toLowerCase();
  var pw    = document.getElementById('vol-pw').value || '';
  var isKo  = curLang === 'ko';
  document.getElementById('vol-err').style.display = 'none';
  if (!email) { showVolErr(isKo ? '이메일을 입력해 주세요.' : 'Please enter your email.'); return; }
  if (!pw)    { showVolErr(isKo ? '비밀번호를 입력해 주세요.' : 'Please enter your password.'); return; }
  auth.signInWithEmailAndPassword(email, pw)
    .then(function() {
      if (document.getElementById('vol-remember').checked)
        localStorage.setItem('pawst_email', email);
    })
    .catch(function(e) {
      var msg = isKo ? '로그인 오류가 발생했습니다.' : 'Login error.';
      if (e.code === 'auth/invalid-email')       msg = isKo ? '이메일 형식이 올바르지 않습니다.' : 'Invalid email format.';
      else if (e.code === 'auth/user-not-found') msg = isKo ? '등록되지 않은 이메일입니다.' : 'Email not found.';
      else if (e.code === 'auth/wrong-password') msg = isKo ? '비밀번호가 올바르지 않습니다.' : 'Incorrect password.';
      else if (e.code === 'auth/invalid-credential') msg = isKo ? '이메일 또는 비밀번호가 올바르지 않습니다.' : 'Incorrect email or password.';
      else if (e.code === 'auth/too-many-requests') msg = isKo ? '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.' : 'Too many attempts. Try again later.';
      showVolErr(msg);
    });
}

function doVolSignup() {
  var email = (document.getElementById('vol-email2').value || '').trim().toLowerCase();
  var pw    = document.getElementById('vol-pw2').value || '';
  var pw2   = document.getElementById('vol-pw3').value || '';
  var isKo  = curLang === 'ko';
  document.getElementById('vol-err').style.display = 'none';
  if (!email)        { showVolErr(isKo ? '이메일을 입력해 주세요.' : 'Please enter your email.'); return; }
  if (pw.length < 6) { showVolErr(isKo ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be 6+ characters.'); return; }
  if (pw !== pw2)    { showVolErr(isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.'); return; }
  auth.createUserWithEmailAndPassword(email, pw)
    .then(function() { localStorage.setItem('pawst_email', email); })
    .catch(function(e) {
      var msg = isKo ? '가입 오류가 발생했습니다.' : 'Signup error.';
      if (e.code === 'auth/invalid-email')         msg = isKo ? '이메일 형식이 올바르지 않습니다.' : 'Invalid email format.';
      else if (e.code === 'auth/email-already-in-use') msg = isKo ? '이미 가입된 이메일입니다. 로그인 탭을 이용해 주세요.' : 'Email already registered. Please login.';
      else if (e.code === 'auth/weak-password')    msg = isKo ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be 6+ characters.';
      showVolErr(msg);
    });
}

function sendReset() {
  var email = (document.getElementById('vol-email').value || '').trim();
  var isKo = curLang === 'ko';
  if (!email) { showVolErr(isKo ? '이메일을 먼저 입력해 주세요.' : 'Please enter your email first.'); return; }
  auth.sendPasswordResetEmail(email)
    .then(function() { alert(isKo ? '비밀번호 재설정 이메일을 보냈습니다.' : 'Password reset email sent.'); })
    .catch(function() { showVolErr(isKo ? '이메일을 확인해 주세요.' : 'Please check your email.'); });
}

// ══════════════════════════════════════
// Auth 상태 감지
// ══════════════════════════════════════
auth.onAuthStateChanged(function(user) {
  if (!user) return;
  // 기관
  if (ORG_MAP[user.email]) {
    var info = ORG_MAP[user.email];
    document.getElementById('org-dash-title').textContent = info.ico + ' ' + info.name;
    scGo('s-orgdash');
    setDashTab('dogs');
    return;
  }
  // 어드민
  if (user.email === SUPER_ADMIN_EMAIL) {
    scGo('s-admindash');
    loadAdminDash();
    return;
  }
  // 봉사자
  scGo('s-main');
  setTab('home');
});

// 저장된 이메일 불러오기
(function() {
  var saved = localStorage.getItem('pawst_email');
  if (saved) {
    var el = document.getElementById('vol-email');
    if (el) el.value = saved;
  }
})();

// ══════════════════════════════════════
// 기관 로그인 이메일 자동완성 힌트
// ══════════════════════════════════════
function loadOrgEmail() {
  // 빈 상태 유지 (보안상 자동채우기 안 함)
}
function showOrgErr(msg) {
  var el = document.getElementById('org-err');
  el.textContent = msg; el.style.display = 'block';
}
function doOrgLogin() {
  var email = (document.getElementById('org-email').value || '').trim().toLowerCase();
  var pw    = document.getElementById('org-pw').value || '';
  var isKo  = curLang === 'ko';
  document.getElementById('org-err').style.display = 'none';
  if (!email) { showOrgErr(isKo ? '이메일을 입력해 주세요.' : 'Please enter email.'); return; }
  if (!pw)    { showOrgErr(isKo ? '비밀번호를 입력해 주세요.' : 'Please enter password.'); return; }
  auth.signInWithEmailAndPassword(email, pw)
    .catch(function() { showOrgErr(isKo ? '이메일 또는 비밀번호가 올바르지 않습니다.' : 'Incorrect email or password.'); });
}
function doOrgLogout() {
  auth.signOut().then(function() { scGo('s-splash'); });
}

// ══════════════════════════════════════
// 항공사 칩 선택
// ══════════════════════════════════════
function selAirline(btn, name) {
  _selAirline = name;
  document.querySelectorAll('#reg-airline-chips .chip').forEach(function(c) { c.classList.remove('on'); });
  btn.classList.add('on');
}
function selEditAirline(btn, name) {
  _editAirline = name;
  document.querySelectorAll('#edit-airline-chips .chip').forEach(function(c) { c.classList.remove('on'); });
  btn.classList.add('on');
}

// ══════════════════════════════════════
// 항공편 등록
// ══════════════════════════════════════
function doRegister() {
  var isKo  = curLang === 'ko';
  var date  = document.getElementById('reg-date').value;
  var kakao = (document.getElementById('reg-kakao').value || '').trim();
  var phone = (document.getElementById('reg-phone').value || '').trim();
  var err   = document.getElementById('reg-err');
  err.style.display = 'none';

  var user = auth.currentUser;
  if (!user) { scGo('s-vollogin'); return; }
  if (!_selAirline) {
    err.textContent = isKo ? '항공사를 선택해 주세요.' : 'Please select an airline.';
    err.style.display = 'block'; return;
  }
  if (!date) {
    err.textContent = isKo ? '출발 날짜를 입력해 주세요.' : 'Please enter departure date.';
    err.style.display = 'block'; return;
  }
  if (date < new Date().toISOString().slice(0,10)) {
    err.textContent = isKo ? '출발 날짜는 오늘 이후여야 합니다.' : 'Date must be today or later.';
    err.style.display = 'block'; return;
  }
  if (!kakao && !phone) {
    err.textContent = isKo ? '카카오톡 ID 또는 전화번호 중 하나는 입력해 주세요.' : 'Please enter KakaoTalk ID or phone number.';
    err.style.display = 'block'; return;
  }

  db.collection('volunteers').add({
    email:      user.email,
    airline:    _selAirline,
    flightDate: date,
    kakao:      kakao,
    phone:      phone,
    status:     'pending',
    createdAt:  firebase.firestore.FieldValue.serverTimestamp()
  }).then(function() {
    alert(isKo
      ? '✅ 항공편이 등록되었습니다!\n파트너 기관에서 카카오톡 또는 전화로 연락드릴 예정입니다.'
      : '✅ Flight registered!\nPartner organizations will contact you via KakaoTalk or phone.');
    document.getElementById('reg-date').value = '';
    document.getElementById('reg-kakao').value = '';
    document.getElementById('reg-phone').value = '';
    _selAirline = '';
    document.querySelectorAll('#reg-airline-chips .chip').forEach(function(c) { c.classList.remove('on'); });
    loadMyFlights();
  }).catch(function(e) {
    err.textContent = '오류: ' + e.message; err.style.display = 'block';
  });
}

// ══════════════════════════════════════
// 내 항공편 로드
// ══════════════════════════════════════
function showRegForm() {
  document.getElementById('reg-form').style.display = 'block';
  document.getElementById('my-flights-section').style.display = 'none';
  var cancelBtn = document.getElementById('reg-cancel-btn');
  if (cancelBtn) cancelBtn.style.display = 'block';
}

function loadMyFlights() {
  var user = auth.currentUser;
  if (!user || ORG_MAP[user.email]) return;
  var isKo = curLang === 'ko';
  var list = document.getElementById('my-flights-list');
  if (!list) return;

  db.collection('volunteers').where('email','==',user.email).orderBy('createdAt','desc').get()
    .then(function(snap) {
      if (snap.empty) {
        document.getElementById('reg-form').style.display = 'block';
        document.getElementById('my-flights-section').style.display = 'none';
        var cancelBtn = document.getElementById('reg-cancel-btn');
        if (cancelBtn) cancelBtn.style.display = 'none';
        return;
      }
      document.getElementById('reg-form').style.display = 'none';
      document.getElementById('my-flights-section').style.display = 'block';

      var stMap = {
        pending:  { ko:'대기중',    en:'Pending', cls:'badge-gy' },
        matched:  { ko:'연락완료',  en:'Contacted', cls:'badge-or' },
        done:     { ko:'이동완료',  en:'Done',      cls:'badge-gr' }
      };

      list.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data(); var vid = doc.id;
        var st = stMap[v.status] || stMap.pending;
        var canEdit = v.status === 'pending';
        return '<div class="flight-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<div class="flight-route">ICN ✈️ ATL</div>' +
          '<span class="badge ' + st.cls + '">' + (curLang==='ko'?st.ko:st.en) + '</span>' +
          '</div>' +
          '<div class="flight-detail">' +
          '🛫 ' + (v.airline||'') + ' · 📅 ' + (v.flightDate||'') + '<br>' +
          (v.kakao ? '💬 ' + v.kakao : '') +
          (v.kakao && v.phone ? ' · ' : '') +
          (v.phone ? '📞 ' + v.phone : '') +
          '</div>' +
          '<div class="flight-actions">' +
          (canEdit ? '<button class="btn-sm btn-sm-or" onclick="openFlightModal(\'' + vid + '\')">' + (isKo?'수정':'Edit') + '</button>' : '') +
          (canEdit ? '<button class="btn-sm btn-sm-re" onclick="deleteFlight(\'' + vid + '\')">' + (isKo?'삭제':'Delete') + '</button>' : '') +
          '</div>' +
          '</div>';
      }).join('');
    })
    .catch(function() {
      document.getElementById('reg-form').style.display = 'block';
      document.getElementById('my-flights-section').style.display = 'none';
    });
}

// 항공편 삭제
function deleteFlight(vid) {
  var isKo = curLang === 'ko';
  if (!confirm(isKo ? '항공편을 삭제할까요?' : 'Delete this flight?')) return;
  db.collection('volunteers').doc(vid).delete()
    .then(function() { loadMyFlights(); })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// 항공편 수정 모달
function openFlightModal(vid) {
  db.collection('volunteers').doc(vid).get().then(function(doc) {
    if (!doc.exists) return;
    var v = doc.data();
    document.getElementById('flight-edit-id').value = vid;
    document.getElementById('edit-date').value  = v.flightDate || '';
    document.getElementById('edit-kakao').value = v.kakao || '';
    document.getElementById('edit-phone').value = v.phone || '';
    _editAirline = v.airline || '';
    document.querySelectorAll('#edit-airline-chips .chip').forEach(function(c) {
      var label = c.textContent.split(' ')[0];
      c.classList.toggle('on', label === _editAirline);
    });
    document.getElementById('flight-modal').style.display = 'flex';
    history.pushState({ modal: 'flight' }, '', '');
  });
}
function closeFlightModal() {
  document.getElementById('flight-modal').style.display = 'none';
}
function saveEditFlight() {
  var vid   = document.getElementById('flight-edit-id').value;
  var isKo  = curLang === 'ko';
  var date  = document.getElementById('edit-date').value;
  var kakao = (document.getElementById('edit-kakao').value || '').trim();
  var phone = (document.getElementById('edit-phone').value || '').trim();
  if (date && date < new Date().toISOString().slice(0,10)) {
    alert(isKo ? '출발 날짜는 오늘 이후여야 합니다.' : 'Date must be today or later.'); return;
  }
  if (!kakao && !phone) {
    alert(isKo ? '카카오톡 ID 또는 전화번호를 입력해 주세요.' : 'Enter KakaoTalk ID or phone.'); return;
  }
  db.collection('volunteers').doc(vid).update({
    airline:    _editAirline,
    flightDate: date,
    kakao:      kakao,
    phone:      phone
  }).then(function() {
    closeFlightModal();
    loadMyFlights();
    alert(isKo ? '수정되었습니다.' : 'Updated.');
  }).catch(function(e) { alert('오류: ' + e.message); });
}

// ══════════════════════════════════════
// 홈 탭
// ══════════════════════════════════════
function loadHome() {
  loadOrgCards();
  loadHomeDogPreview();
  var user = auth.currentUser;
  if (user && !ORG_MAP[user.email] && user.email !== SUPER_ADMIN_EMAIL) {
    loadHomeStatus(user.email);
  }
}

function loadOrgCards() {
  var el = document.getElementById('home-orgs-list');
  if (!el) return;
  el.innerHTML = Object.keys(ORG_MAP).map(function(email) {
    var org = ORG_MAP[email];
    return '<div class="card" style="display:flex;align-items:center;gap:12px;">' +
      '<div style="width:48px;height:48px;border-radius:14px;background:' + org.color + ';display:flex;align-items:center;justify-content:center;font-size:26px;">' + org.ico + '</div>' +
      '<div><div style="font-weight:800;font-size:15px;">' + org.name + '</div>' +
      '<div style="font-size:12px;color:var(--t2);margin-top:3px;">' + (curLang==='ko'?'파트너 기관':'Partner Organization') + '</div></div>' +
      '</div>';
  }).join('');
}

function loadHomeDogPreview() {
  var el = document.getElementById('home-dogs-preview');
  if (!el) return;
  db.collection('dogs').where('status','==','waiting').limit(3).get()
    .then(function(snap) {
      if (snap.empty) {
        el.innerHTML = '<div class="empty-state"><div class="em">🐾</div><div class="msg">' + (curLang==='ko'?'현재 대기 중인 강아지가 없습니다.':'No dogs waiting right now.') + '</div></div>';
        return;
      }
      el.innerHTML = snap.docs.map(function(doc) {
        var d = doc.data();
        var org = ORG_MAP[d.orgEmail] || { ico:'🏥', name:'기관' };
        return '<div class="dog-card">' +
          '<div class="dog-emoji">🐶</div>' +
          '<div class="dog-info">' +
          '<div class="dog-name">' + (d.name||'') + ' <span class="badge badge-gy">' + (d.breed||'') + '</span></div>' +
          '<div class="dog-detail">' + org.ico + ' ' + org.name + ' · ⚖️ ' + (d.weight||'?') + 'kg · 📅 ' + (d.period||'') + '</div>' +
          '</div></div>';
      }).join('');
    }).catch(function() { el.innerHTML = ''; });
}

function loadHomeStatus(email) {
  var statusEl = document.getElementById('home-my-status');
  var cardEl   = document.getElementById('home-status-card');
  if (!statusEl || !cardEl) return;
  var isKo = curLang === 'ko';
  db.collection('volunteers').where('email','==',email).limit(3).get()
    .then(function(snap) {
      if (snap.empty) { statusEl.style.display = 'none'; return; }
      statusEl.style.display = 'block';
      var stMap = {
        pending: { ko:'대기중',   en:'Pending',   cls:'badge-gy' },
        matched: { ko:'연락완료', en:'Contacted', cls:'badge-or' },
        done:    { ko:'이동완료', en:'Done',       cls:'badge-gr' }
      };
      cardEl.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data();
        var st = stMap[v.status] || stMap.pending;
        return '<div class="flight-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<div class="flight-route" style="font-size:14px;">ICN ✈️ ATL</div>' +
          '<span class="badge ' + st.cls + '">' + (isKo?st.ko:st.en) + '</span>' +
          '</div>' +
          '<div class="flight-detail">' + (v.airline||'') + ' · ' + (v.flightDate||'') + '</div>' +
          '</div>';
      }).join('');
    }).catch(function() { statusEl.style.display = 'none'; });
}

// ══════════════════════════════════════
// 강아지 탭
// ══════════════════════════════════════
function filterDogs(btn, orgEmail) {
  _dogFilter = orgEmail;
  document.querySelectorAll('#dogs-filter .chip').forEach(function(c) { c.classList.remove('on'); });
  btn.classList.add('on');
  loadDogs();
}

function loadDogs() {
  var el = document.getElementById('dogs-list');
  if (!el) return;
  var isKo = curLang === 'ko';
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);">' + (isKo?'불러오는 중...':'Loading...') + '</div>';

  db.collection('dogs').where('status','==','waiting').get()
    .then(function(snap) {
      var docs = snap.docs;
      if (_dogFilter !== 'all') docs = docs.filter(function(d) { return d.data().orgEmail === _dogFilter; });
      if (!docs.length) {
        el.innerHTML = '<div class="empty-state"><div class="em">🐾</div><div class="msg">' + (isKo?'등록된 강아지가 없습니다.':'No dogs registered.') + '</div></div>';
        return;
      }
      el.innerHTML = docs.map(function(doc) {
        var d = doc.data();
        var org = ORG_MAP[d.orgEmail] || { ico:'🏥', name: d.orgEmail||'기관', color:'#FFF5E6' };
        return '<div class="dog-card">' +
          '<div class="dog-emoji">🐶</div>' +
          '<div class="dog-info">' +
          '<div class="dog-name">' + (d.name||'이름없음') + ' <span class="badge badge-gy">' + (d.breed||'') + '</span></div>' +
          '<div class="dog-detail">' +
          '⚖️ ' + (d.weight||'?') + 'kg · ' + org.ico + ' ' + org.name + '<br>' +
          '📅 ' + (d.period||'') +
          (d.note ? '<br>📌 ' + d.note : '') +
          '</div></div></div>';
      }).join('');
    })
    .catch(function() {
      // 인덱스 없을 때 fallback
      db.collection('dogs').get().then(function(snap) {
        var docs = snap.docs.filter(function(d) { return d.data().status === 'waiting'; });
        if (_dogFilter !== 'all') docs = docs.filter(function(d) { return d.data().orgEmail === _dogFilter; });
        if (!docs.length) {
          el.innerHTML = '<div class="empty-state"><div class="em">🐾</div><div class="msg">' + (isKo?'등록된 강아지가 없습니다.':'No dogs registered.') + '</div></div>';
          return;
        }
        el.innerHTML = docs.map(function(doc) {
          var d = doc.data();
          var org = ORG_MAP[d.orgEmail] || { ico:'🏥', name:'기관' };
          return '<div class="dog-card"><div class="dog-emoji">🐶</div><div class="dog-info"><div class="dog-name">' + (d.name||'') + '</div><div class="dog-detail">' + org.ico + ' ' + org.name + ' · ⚖️ ' + (d.weight||'?') + 'kg · 📅 ' + (d.period||'') + '</div></div></div>';
        }).join('');
      });
    });
}

// ══════════════════════════════════════
// 마이페이지
// ══════════════════════════════════════
function loadMyPage() {
  var user = auth.currentUser;
  var el = document.getElementById('mypage-content');
  if (!el) return;
  var isKo = curLang === 'ko';
  if (!user) {
    el.innerHTML = '<button class="btn-pr" onclick="scGo(\'s-vollogin\')">' + (isKo?'로그인 / 회원가입':'Login / Sign Up') + '</button>';
    return;
  }

  // 기본 틀 먼저 렌더
  el.innerHTML =
    '<div class="card">' +
      '<div style="font-size:12px;color:var(--t2);margin-bottom:4px;">' + (isKo?'로그인 이메일':'Logged in as') + '</div>' +
      '<div style="font-weight:700;font-size:15px;">' + user.email + '</div>' +
    '</div>' +

    // 봉사 통계 카드
    '<div class="mypage-stat-card" id="my-stat-card">' +
      '<div style="font-size:13px;color:var(--t2);margin-bottom:12px;">' + (isKo?'내 봉사 현황':'My Volunteering') + '</div>' +
      '<div style="display:flex;gap:12px;">' +
        '<div class="mypage-stat-box"><div class="mypage-stat-n" id="my-stat-total">-</div><div class="mypage-stat-l">' + (isKo?'총 신청':'Total') + '</div></div>' +
        '<div class="mypage-stat-box"><div class="mypage-stat-n" id="my-stat-done" style="color:var(--gr);">-</div><div class="mypage-stat-l">' + (isKo?'이동완료':'Completed') + '</div></div>' +
        '<div class="mypage-stat-box"><div class="mypage-stat-n" id="my-stat-pending" style="color:var(--or);">-</div><div class="mypage-stat-l">' + (isKo?'진행중':'In Progress') + '</div></div>' +
      '</div>' +
      '<div id="my-paws-msg" style="margin-top:14px;font-size:13px;font-weight:700;color:var(--or);text-align:center;"></div>' +
    '</div>' +

    // 봉사 이력 목록
    '<div style="margin-top:20px;">' +
      '<div class="sec-hd">' + (isKo?'봉사 이력':'Volunteer History') + '</div>' +
      '<div id="my-history-list"></div>' +
    '</div>' +

    '<button class="btn-sec" style="margin-top:16px;" onclick="doVolLogout()">' + (isKo?'로그아웃':'Logout') + '</button>';

  // Firestore에서 이력 로드
  db.collection('volunteers').where('email','==',user.email).orderBy('createdAt','desc').get()
    .then(function(snap) {
      var total   = snap.size;
      var done    = snap.docs.filter(function(d) { return d.data().status === 'done'; }).length;
      var pending = total - done;

      document.getElementById('my-stat-total').textContent   = total;
      document.getElementById('my-stat-done').textContent    = done;
      document.getElementById('my-stat-pending').textContent = pending;

      // 완료 건수에 따른 메시지
      var msg = '';
      if (done === 0)       msg = isKo ? '첫 봉사를 기다리고 있어요 🐾' : 'Waiting for your first transport 🐾';
      else if (done < 3)   msg = isKo ? '총 ' + done + '마리의 구조견과 함께했습니다 🐾' : done + ' rescue dog(s) transported 🐾';
      else if (done < 10)  msg = isKo ? '총 ' + done + '마리! 믿음직한 봉사자예요 ✈️🐾' : done + ' dogs! You\'re a trusted volunteer ✈️🐾';
      else                  msg = isKo ? '총 ' + done + '마리! PAWST CLASS 베테랑 봉사자 🏆' : done + ' dogs! PAWST CLASS veteran 🏆';
      document.getElementById('my-paws-msg').textContent = msg;

      // 이력 목록
      var histEl = document.getElementById('my-history-list');
      if (!histEl) return;
      if (snap.empty) {
        histEl.innerHTML = '<div class="empty-state"><div class="em">✈️</div><div class="msg">' + (isKo?'아직 등록된 항공편이 없습니다.':'No flights registered yet.') + '</div></div>';
        return;
      }
      var stMap = {
        pending: { ko:'대기중',   en:'Pending',   cls:'badge-gy' },
        matched: { ko:'연락완료', en:'Contacted', cls:'badge-or' },
        done:    { ko:'이동완료', en:'Completed', cls:'badge-gr' }
      };
      histEl.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data();
        var st = stMap[v.status] || stMap.pending;
        // 완료 날짜 표시 (createdAt 기준)
        var dateStr = v.flightDate || '';
        return '<div class="flight-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
            '<div style="font-weight:800;">ICN ✈️ ATL</div>' +
            '<span class="badge ' + st.cls + '">' + (isKo ? st.ko : st.en) + '</span>' +
          '</div>' +
          '<div class="flight-detail">' +
            '🛫 ' + (v.airline||'') + ' · 📅 ' + dateStr +
            (v.kakao ? '<br>💬 ' + v.kakao : '') +
          '</div>' +
        '</div>';
      }).join('');
    })
    .catch(function() {
      // orderBy 인덱스 없을 때 fallback
      db.collection('volunteers').where('email','==',user.email).get()
        .then(function(snap) {
          var total = snap.size;
          var done  = snap.docs.filter(function(d) { return d.data().status === 'done'; }).length;
          document.getElementById('my-stat-total').textContent   = total;
          document.getElementById('my-stat-done').textContent    = done;
          document.getElementById('my-stat-pending').textContent = total - done;
          var msg = done === 0
            ? (isKo?'첫 봉사를 기다리고 있어요 🐾':'Waiting for your first transport 🐾')
            : (isKo?'총 '+done+'마리의 구조견과 함께했습니다 🐾':done+' rescue dog(s) transported 🐾');
          document.getElementById('my-paws-msg').textContent = msg;
        });
    });
}

function doVolLogout() {
  var isKo = curLang === 'ko';
  if (!confirm(isKo ? '로그아웃 할까요?' : 'Log out?')) return;
  auth.signOut().then(function() { scGo('s-splash'); });
}

// ══════════════════════════════════════
// 기관 대시보드 — 강아지
// ══════════════════════════════════════
function openDogModal(did) {
  document.getElementById('dog-modal-err').style.display = 'none';
  document.getElementById('dog-edit-id').value = did || '';
  var isKo = curLang === 'ko';
  var titleEl = document.getElementById('dog-modal-title');

  if (did) {
    titleEl.textContent = isKo ? '강아지 수정' : 'Edit Dog';
    db.collection('dogs').doc(did).get().then(function(doc) {
      if (!doc.exists) return;
      var d = doc.data();
      document.getElementById('dog-name').value   = d.name   || '';
      document.getElementById('dog-breed').value  = d.breed  || '';
      document.getElementById('dog-weight').value = d.weight || '';
      document.getElementById('dog-period').value = d.period || '';
      document.getElementById('dog-note').value   = d.note   || '';
    });
  } else {
    titleEl.textContent = isKo ? '강아지 등록' : 'Register Dog';
    ['dog-name','dog-breed','dog-weight','dog-period','dog-note'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
  }
  document.getElementById('dog-modal').style.display = 'flex';
  history.pushState({ modal: 'dog' }, '', '');
}
function closeDogModal() {
  document.getElementById('dog-modal').style.display = 'none';
}
function saveDog() {
  var user = auth.currentUser;
  if (!user) return;
  var isKo   = curLang === 'ko';
  var did    = document.getElementById('dog-edit-id').value;
  var name   = (document.getElementById('dog-name').value || '').trim();
  var breed  = (document.getElementById('dog-breed').value || '').trim();
  var weight = (document.getElementById('dog-weight').value || '').trim();
  var period = (document.getElementById('dog-period').value || '').trim();
  var note   = (document.getElementById('dog-note').value || '').trim();
  var errEl  = document.getElementById('dog-modal-err');
  errEl.style.display = 'none';

  if (!name) { errEl.textContent = isKo ? '이름을 입력해 주세요.' : 'Please enter name.'; errEl.style.display = 'block'; return; }

  var data = { name, breed, weight, period, note, orgEmail: user.email, status: 'waiting' };

  var p = did
    ? db.collection('dogs').doc(did).update(data)
    : db.collection('dogs').add(Object.assign(data, { createdAt: firebase.firestore.FieldValue.serverTimestamp() }));

  p.then(function() {
    closeDogModal();
    loadDashDogs();
  }).catch(function(e) {
    errEl.textContent = '오류: ' + e.message; errEl.style.display = 'block';
  });
}
function deleteDog(did) {
  var isKo = curLang === 'ko';
  if (!confirm(isKo ? '강아지를 삭제할까요?' : 'Delete this dog?')) return;
  db.collection('dogs').doc(did).delete().then(function() { loadDashDogs(); })
    .catch(function(e) { alert('오류: ' + e.message); });
}

function loadDashDogs() {
  var user = auth.currentUser;
  if (!user) return;
  var el = document.getElementById('dash-dogs-list');
  if (!el) return;
  var isKo = curLang === 'ko';
  el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);">' + (isKo?'불러오는 중...':'Loading...') + '</div>';

  db.collection('dogs').where('orgEmail','==',user.email).get()
    .then(function(snap) {
      if (snap.empty) {
        el.innerHTML = '<div class="empty-state"><div class="em">🐾</div><div class="msg">' + (isKo?'등록된 강아지가 없습니다.':'No dogs registered.') + '</div></div>';
        return;
      }
      var stMap = { waiting:{ko:'대기중',en:'Waiting',cls:'badge-gy'}, done:{ko:'이동완료',en:'Done',cls:'badge-gr'} };
      el.innerHTML = snap.docs.map(function(doc) {
        var d = doc.data(); var did = doc.id;
        var st = stMap[d.status] || stMap.waiting;
        return '<div class="card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<div style="font-weight:800;">🐶 ' + (d.name||'') + '</div>' +
          '<span class="badge ' + st.cls + '">' + (isKo?st.ko:st.en) + '</span>' +
          '</div>' +
          '<div style="font-size:13px;color:var(--t2);margin-top:6px;">' +
          (d.breed||'') + (d.weight?' · ⚖️ '+d.weight+'kg':'') +
          (d.period?'<br>📅 '+d.period:'') +
          (d.note?'<br>📌 '+d.note:'') +
          '</div>' +
          '<div style="display:flex;gap:8px;margin-top:10px;">' +
          '<button class="btn-sm btn-sm-or" onclick="openDogModal(\'' + did + '\')">' + (isKo?'수정':'Edit') + '</button>' +
          '<button class="btn-sm btn-sm-re" onclick="deleteDog(\'' + did + '\')">' + (isKo?'삭제':'Delete') + '</button>' +
          '</div></div>';
      }).join('');
    }).catch(function(e) {
      el.innerHTML = '<div style="color:var(--re);padding:16px;">오류: ' + e.message + '</div>';
    });
}

// ══════════════════════════════════════
// 기관 대시보드 — 봉사자 목록
// ══════════════════════════════════════
function loadDashVols() {
  var el = document.getElementById('dash-vols-list');
  if (!el) return;
  var isKo = curLang === 'ko';
  el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);">' + (isKo?'불러오는 중...':'Loading...') + '</div>';

  // 대기중(pending) + 연락완료(matched) 봉사자 모두 표시
  db.collection('volunteers').where('status','in',['pending','matched']).orderBy('flightDate','asc').get()
    .then(function(snap) {
      if (snap.empty) {
        el.innerHTML = '<div class="empty-state"><div class="em">✈️</div><div class="msg">' + (isKo?'등록된 봉사자가 없습니다.':'No volunteers registered.') + '</div></div>';
        return;
      }
      el.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data(); var vid = doc.id;
        var kakaoId = v.kakao || '';
        var phone   = v.phone || '';
        var stCls   = v.status === 'matched' ? 'badge-or' : 'badge-gy';
        var stTxt   = v.status === 'matched' ? (isKo?'연락완료':'Contacted') : (isKo?'대기중':'Pending');
        return '<div class="card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<div style="font-weight:800;">✈️ ' + (v.airline||'') + '</div>' +
          '<span class="badge ' + stCls + '">' + stTxt + '</span>' +
          '</div>' +
          '<div style="font-size:13px;color:var(--t2);margin-top:6px;">📅 ' + (v.flightDate||'') + ' · ICN → ATL</div>' +
          '<div style="font-size:13px;margin-top:6px;color:var(--tx);">' +
          (kakaoId ? '💬 ' + kakaoId : '') + (kakaoId && phone ? ' · ' : '') + (phone ? '📞 ' + phone : '') +
          '</div>' +
          '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">' +
          (kakaoId ? '<button class="kakao-btn" style="flex:1;padding:10px;" onclick="copyKakao(\'' + kakaoId + '\')">💬 ' + (isKo?'카카오톡 ID 복사':'Copy KakaoTalk ID') + '</button>' : '') +
          (phone   ? '<a href="tel:' + phone + '" class="btn-sm btn-sm-or" style="flex:1;text-align:center;text-decoration:none;padding:10px;border-radius:10px;">📞 ' + (isKo?'전화 연결':'Call') + '</a>' : '') +
          '</div>' +
          '<button class="btn-sm btn-sm-gr" style="width:100%;margin-top:8px;" onclick="markContacted(\'' + vid + '\',' + (v.status==='matched') + ')">' +
          (v.status==='matched' ? (isKo?'✅ 연락완료 취소':'↩ Undo Contacted') : (isKo?'📱 연락완료 표시':'📱 Mark Contacted')) +
          '</button>' +
          (v.status==='matched' ?
            '<button class="btn-pr" style="margin-top:8px;margin-bottom:0;" onclick="markDone(\'' + vid + '\')">' + (isKo?'🏁 이동완료 처리':'🏁 Mark as Done') + '</button>'
            : '') +
          '</div>';
      }).join('');
    })
    .catch(function() {
      // orderBy 인덱스 없을 때 fallback
      db.collection('volunteers').get().then(function(snap) {
        var docs = snap.docs.filter(function(d) {
          var s = d.data().status;
          return s === 'pending' || s === 'matched';
        });
        if (!docs.length) {
          el.innerHTML = '<div class="empty-state"><div class="em">✈️</div><div class="msg">' + (isKo?'등록된 봉사자가 없습니다.':'No volunteers registered.') + '</div></div>';
          return;
        }
        el.innerHTML = docs.map(function(doc) {
          var v = doc.data(); var vid = doc.id;
          var kakaoId = v.kakao || '';
          var phone   = v.phone || '';
          return '<div class="card">' +
            '<div style="font-weight:800;">✈️ ' + (v.airline||'') + ' · 📅 ' + (v.flightDate||'') + '</div>' +
            '<div style="font-size:13px;margin-top:6px;">' +
            (kakaoId?'💬 '+kakaoId:'') + (kakaoId&&phone?' · ':'') + (phone?'📞 '+phone:'') +
            '</div>' +
            '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">' +
            (kakaoId?'<button class="kakao-btn" style="flex:1;padding:10px;" onclick="copyKakao(\''+kakaoId+'\')">💬 '+(isKo?'카카오 복사':'Copy')+'</button>':'') +
            (phone?'<a href="tel:'+phone+'" class="btn-sm btn-sm-or" style="flex:1;text-align:center;text-decoration:none;padding:10px;border-radius:10px;">📞 '+(isKo?'전화':'Call')+'</a>':'') +
            '</div>' +
            '<button class="btn-sm btn-sm-gr" style="width:100%;margin-top:8px;" onclick="markContacted(\''+vid+'\',false)">'+(isKo?'📱 연락완료 표시':'📱 Mark Contacted')+'</button>' +
            '</div>';
        }).join('');
      });
    });
}

function markContacted(vid, isAlreadyContacted) {
  var isKo = curLang === 'ko';
  var newStatus = isAlreadyContacted ? 'pending' : 'matched';
  db.collection('volunteers').doc(vid).update({ status: newStatus })
    .then(function() { loadDashVols(); })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// ══════════════════════════════════════
// 기관 대시보드 — 완료 탭
// ══════════════════════════════════════
function loadDashDone() {
  var el = document.getElementById('dash-done-list');
  if (!el) return;
  var isKo = curLang === 'ko';
  el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);">' + (isKo?'불러오는 중...':'Loading...') + '</div>';

  db.collection('volunteers').where('status','==','done').get()
    .then(function(snap) {
      if (snap.empty) {
        el.innerHTML = '<div class="empty-state"><div class="em">✅</div><div class="msg">' + (isKo?'완료된 봉사가 없습니다.':'No completed transports yet.') + '</div></div>';
        return;
      }
      // 완료 건수 상단 표시
      var countHtml = '<div class="done-count-banner">' +
        '<span style="font-size:28px;font-weight:900;color:var(--gr);">' + snap.size + '</span>' +
        '<span style="font-size:13px;color:var(--t2);margin-left:8px;">' + (isKo?'건 이동완료':'transports completed') + '</span>' +
        '</div>';

      var listHtml = snap.docs.map(function(doc) {
        var v = doc.data(); var vid = doc.id;
        var doneDate = v.doneAt ? new Date(v.doneAt.toDate()).toLocaleDateString('ko-KR') : '';
        return '<div class="card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
            '<div style="font-weight:800;">✈️ ' + (v.airline||'') + '</div>' +
            '<span class="badge badge-gr">' + (isKo?'이동완료':'Done') + '</span>' +
          '</div>' +
          '<div style="font-size:13px;color:var(--t2);margin-top:6px;">📅 ' + (v.flightDate||'') + ' · ICN → ATL</div>' +
          '<div style="font-size:13px;margin-top:4px;color:var(--t2);">' +
            (v.kakao?'💬 '+v.kakao:'') + (v.kakao&&v.phone?' · ':'') + (v.phone?'📞 '+v.phone:'') +
          '</div>' +
          (doneDate ? '<div style="font-size:11px;color:var(--t3);margin-top:4px;">✅ ' + (isKo?'완료일: ':'Completed: ') + doneDate + '</div>' : '') +
          '<button class="btn-sm btn-sm-re" style="margin-top:10px;" onclick="undoDone(\'' + vid + '\')">' + (isKo?'↩ 되돌리기':'↩ Undo') + '</button>' +
        '</div>';
      }).join('');

      el.innerHTML = countHtml + listHtml;
    }).catch(function(e) {
      el.innerHTML = '<div style="color:var(--re);padding:16px;">오류: ' + e.message + '</div>';
    });
}

function markDone(vid) {
  var isKo = curLang === 'ko';
  if (!confirm(isKo ? '이동완료로 처리할까요?\n봉사자의 이력에 기록됩니다.' : 'Mark as done?\nThis will be recorded in the volunteer\'s history.')) return;
  db.collection('volunteers').doc(vid).update({
    status: 'done',
    doneAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function() {
    alert(isKo ? '✅ 이동완료 처리되었습니다! 🎉\n봉사자 이력에 기록되었습니다.' : '✅ Marked as done! 🎉\nRecorded in volunteer history.');
    loadDashVols();
    loadDashDone();
  }).catch(function(e) { alert('오류: ' + e.message); });
}

function undoDone(vid) {
  var isKo = curLang === 'ko';
  if (!confirm(isKo ? '대기 상태로 되돌릴까요?' : 'Undo and return to pending?')) return;
  db.collection('volunteers').doc(vid).update({ status: 'pending' })
    .then(function() { loadDashDone(); loadDashVols(); })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// ══════════════════════════════════════
// 어드민
// ══════════════════════════════════════
function doAdminLogin() {
  var email = (document.getElementById('admin-email').value || '').trim();
  var pw    = document.getElementById('admin-pw').value || '';
  document.getElementById('admin-err').style.display = 'none';
  auth.signInWithEmailAndPassword(email, pw)
    .then(function(cred) {
      if (cred.user.email !== SUPER_ADMIN_EMAIL) {
        auth.signOut();
        document.getElementById('admin-err').textContent = '어드민 계정이 아닙니다.';
        document.getElementById('admin-err').style.display = 'block';
        return;
      }
      scGo('s-admindash'); loadAdminDash();
    })
    .catch(function() {
      document.getElementById('admin-err').textContent = '로그인 실패. 이메일/비밀번호를 확인하세요.';
      document.getElementById('admin-err').style.display = 'block';
    });
}
function doAdminLogout() {
  auth.signOut().then(function() { scGo('s-splash'); });
}
function loadAdminDash() {
  Promise.all([
    db.collection('volunteers').get(),
    db.collection('dogs').get()
  ]).then(function(results) {
    var vols = results[0]; var dogs = results[1];
    var done    = vols.docs.filter(function(d) { return d.data().status === 'done'; }).length;
    var matched = vols.docs.filter(function(d) { return d.data().status === 'matched'; }).length;
    var pending = vols.docs.filter(function(d) { return d.data().status === 'pending'; }).length;
    var waiting = dogs.docs.filter(function(d) { return d.data().status === 'waiting'; }).length;

    // 핵심 통계
    document.getElementById('admin-stats').innerHTML =
      '<div class="admin-stat-box"><div class="admin-stat-n">' + vols.size + '</div><div class="admin-stat-l">전체 봉사 신청</div></div>' +
      '<div class="admin-stat-box"><div class="admin-stat-n" style="color:var(--gr);">' + done + '</div><div class="admin-stat-l">✅ 이동완료</div></div>' +
      '<div class="admin-stat-box"><div class="admin-stat-n" style="color:var(--or);">' + matched + '</div><div class="admin-stat-l">📱 연락완료</div></div>' +
      '<div class="admin-stat-box"><div class="admin-stat-n">' + pending + '</div><div class="admin-stat-l">⏳ 대기중</div></div>';

    // 기관별 완료 통계
    var orgDone = {};
    Object.keys(ORG_MAP).forEach(function(e) { orgDone[e] = 0; });

    // 강아지 기관별 집계
    var orgDogs = {};
    Object.keys(ORG_MAP).forEach(function(e) { orgDogs[e] = { waiting:0, total:0 }; });
    dogs.docs.forEach(function(doc) {
      var d = doc.data();
      if (orgDogs[d.orgEmail]) {
        orgDogs[d.orgEmail].total++;
        if (d.status === 'waiting') orgDogs[d.orgEmail].waiting++;
      }
    });

    // 월별 완료 집계
    var monthlyDone = {};
    vols.docs.forEach(function(doc) {
      var v = doc.data();
      if (v.status === 'done' && v.flightDate) {
        var m = v.flightDate.slice(0,7); // "2026-07"
        monthlyDone[m] = (monthlyDone[m] || 0) + 1;
      }
    });

    // 항공사별 집계
    var airlineCnt = {};
    vols.docs.forEach(function(doc) {
      var v = doc.data();
      var a = v.airline || '기타';
      airlineCnt[a] = (airlineCnt[a] || 0) + 1;
    });

    // 기관별 통계 렌더
    var orgHtml = '<div class="sec-hd" style="margin-top:20px;">기관별 강아지 현황</div>';
    orgHtml += Object.keys(ORG_MAP).map(function(email) {
      var org = ORG_MAP[email];
      var stat = orgDogs[email] || { waiting:0, total:0 };
      return '<div class="card" style="margin-bottom:8px;display:flex;align-items:center;gap:12px;">' +
        '<div style="font-size:28px;">' + org.ico + '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-weight:800;">' + org.name + '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-top:4px;">대기 강아지 ' + stat.waiting + '마리 · 총 등록 ' + stat.total + '마리</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // 월별 통계 렌더
    var months = Object.keys(monthlyDone).sort().reverse().slice(0,6);
    var monthHtml = '<div class="sec-hd" style="margin-top:20px;">월별 이동완료</div>';
    if (!months.length) {
      monthHtml += '<div class="empty-state" style="padding:20px 0;"><div class="msg">아직 완료 기록이 없습니다.</div></div>';
    } else {
      var maxVal = Math.max.apply(null, months.map(function(m) { return monthlyDone[m]; }));
      monthHtml += months.map(function(m) {
        var cnt = monthlyDone[m];
        var pct = maxVal > 0 ? Math.round((cnt / maxVal) * 100) : 0;
        return '<div style="margin-bottom:10px;">' +
          '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">' +
            '<span style="font-weight:700;">' + m + '</span>' +
            '<span style="color:var(--gr);font-weight:800;">' + cnt + '건</span>' +
          '</div>' +
          '<div style="background:var(--bg);border-radius:6px;height:8px;">' +
            '<div style="background:var(--gr);border-radius:6px;height:8px;width:' + pct + '%;transition:width .4s;"></div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // 항공사별 통계 렌더
    var airlineHtml = '<div class="sec-hd" style="margin-top:20px;">항공사별 봉사 신청</div>';
    airlineHtml += Object.keys(airlineCnt).map(function(a) {
      var cnt = airlineCnt[a];
      return '<div class="card" style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">' +
        '<div style="font-weight:700;">✈️ ' + a + '</div>' +
        '<span class="badge badge-or">' + cnt + '건</span>' +
      '</div>';
    }).join('');

    // 봉사자 목록
    var volListHtml = '<div class="sec-hd" style="margin-top:20px;">최근 봉사 신청 (최대 30건)</div>';
    volListHtml += vols.docs.slice(0,30).map(function(doc) {
      var v = doc.data();
      var stMap = { pending:'badge-gy', matched:'badge-or', done:'badge-gr' };
      var stTxt = { pending:'대기중', matched:'연락완료', done:'이동완료' };
      return '<div class="card" style="margin-bottom:8px;">' +
        '<div style="display:flex;justify-content:space-between;">' +
          '<b>✈️ ' + (v.airline||'') + ' · ' + (v.flightDate||'') + '</b>' +
          '<span class="badge ' + (stMap[v.status]||'badge-gy') + '">' + (stTxt[v.status]||v.status||'') + '</span>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--t2);margin-top:4px;">' +
          (v.kakao?'💬 '+v.kakao:'') + (v.kakao&&v.phone?' · ':'') + (v.phone?'📞 '+v.phone:'') +
          '<br>' + (v.email||'') +
        '</div>' +
      '</div>';
    }).join('');

    // 강아지 목록
    var dogListHtml = '<div class="sec-hd" style="margin-top:20px;">강아지 목록 (최대 30건)</div>';
    dogListHtml += dogs.docs.slice(0,30).map(function(doc) {
      var d = doc.data();
      var org = ORG_MAP[d.orgEmail] || { name: d.orgEmail||'기관', ico:'🏥' };
      return '<div class="card" style="margin-bottom:8px;">' +
        '<div style="display:flex;justify-content:space-between;">' +
          '<b>🐶 ' + (d.name||'') + '</b>' +
          '<span class="badge badge-gy">' + (d.status||'') + '</span>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--t2);margin-top:4px;">' + org.ico + ' ' + org.name + (d.breed?' · '+d.breed:'') + (d.weight?' '+d.weight+'kg':'') + '</div>' +
      '</div>';
    }).join('');

    // 전체 삽입
    var container = document.querySelector('#s-admindash > div:last-child');
    if (container) {
      container.innerHTML =
        '<div class="admin-stat-row" id="admin-stats"></div>' +
        orgHtml + monthHtml + airlineHtml + volListHtml + dogListHtml;
      // 통계 다시 삽입 (innerHTML 덮어써서)
      document.getElementById('admin-stats').innerHTML =
        '<div class="admin-stat-box"><div class="admin-stat-n">' + vols.size + '</div><div class="admin-stat-l">전체 봉사 신청</div></div>' +
        '<div class="admin-stat-box"><div class="admin-stat-n" style="color:var(--gr);">' + done + '</div><div class="admin-stat-l">✅ 이동완료</div></div>' +
        '<div class="admin-stat-box"><div class="admin-stat-n" style="color:var(--or);">' + matched + '</div><div class="admin-stat-l">📱 연락완료</div></div>' +
        '<div class="admin-stat-box"><div class="admin-stat-n">' + pending + '</div><div class="admin-stat-l">⏳ 대기중</div></div>';
    }
  });
}

// ══════════════════════════════════════
// 카카오 ID 복사
// ══════════════════════════════════════
function copyKakao(id) {
  var isKo = curLang === 'ko';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(id).then(function() {
      alert(isKo
        ? '카카오톡 ID가 복사되었습니다: ' + id + '\n카카오톡 → 친구 → 검색에서 추가하세요.'
        : 'KakaoTalk ID copied: ' + id + '\nSearch in KakaoTalk → Friends → Search.');
    });
  } else {
    prompt(isKo ? '카카오톡 ID를 복사하세요:' : 'Copy KakaoTalk ID:', id);
  }
}

// ══════════════════════════════════════
// 앱 종료 팝업 (갤럭시 백버튼)
// ══════════════════════════════════════
function showAppExitPopup() {
  if (document.getElementById('app-exit-popup')) return;
  var isKo = curLang === 'ko';
  var pop = document.createElement('div');
  pop.id = 'app-exit-popup';
  pop.innerHTML =
    '<div class="exit-box">' +
    '<div class="exit-title">🐾 PAWST CLASS</div>' +
    '<div class="exit-sub">' + (isKo?'앱을 종료할까요?':'Exit the app?') + '</div>' +
    '<div class="exit-btns">' +
    '<button class="exit-cancel" onclick="closeExitPopup()">' + (isKo?'계속 사용하기':'Stay') + '</button>' +
    '<button class="exit-confirm" onclick="appExit()">' + (isKo?'종료':'Exit') + '</button>' +
    '</div></div>';
  document.body.appendChild(pop);
  history.pushState({ popup: 'exit' }, '', '');
}
function closeExitPopup() {
  var el = document.getElementById('app-exit-popup');
  if (el) el.remove();
}
function appExit() { window.close(); history.go(-(history.length - 1)); }

// ══════════════════════════════════════
// 백버튼 (갤럭시 안드로이드)
// ══════════════════════════════════════
window.addEventListener('popstate', function() {
  history.pushState({}, '', '');

  // ① 종료 팝업
  if (document.getElementById('app-exit-popup')) { closeExitPopup(); return; }

  // ② 강아지 등록 모달
  if (document.getElementById('dog-modal').style.display !== 'none') { closeDogModal(); return; }

  // ③ 항공편 수정 모달
  if (document.getElementById('flight-modal').style.display !== 'none') { closeFlightModal(); return; }

  // ④ 기관 대시보드 → 스플래시
  if (_curScreen === 's-orgdash') { scGo('s-splash'); return; }

  // ⑤ 로그인/온보딩/어드민 → 스플래시
  if (['s-orglogin','s-vollogin','s-adminlogin','s-admindash','s-ob'].indexOf(_curScreen) > -1) {
    scGo('s-splash'); return;
  }

  // ⑥ 메인 — 홈 아닌 탭 → 홈
  if (_curScreen === 's-main' && _curTab !== 'home') { setTab('home'); return; }

  // ⑦ 메인 홈 or 스플래시 → 종료 확인
  showAppExitPopup();
});

// ══════════════════════════════════════
// 스플래시 애니메이션
// ══════════════════════════════════════
(function() {
  var splash = document.getElementById('splash-screen');
  if (!splash) return;
  setTimeout(function() { document.getElementById('splash-svg').classList.add('show'); }, 100);
  setTimeout(function() { document.getElementById('splash-plane').classList.add('animate'); }, 500);
  setTimeout(function() { document.getElementById('splash-title').classList.add('show'); }, 1300);
  setTimeout(function() {
    document.getElementById('splash-sub').classList.add('show');
    document.getElementById('splash-divider').classList.add('show');
    document.getElementById('splash-credit').classList.add('show');
  }, 1600);
  setTimeout(function() { document.getElementById('splash-dots').classList.add('show'); }, 1900);
  setTimeout(function() { document.getElementById('dot1').classList.add('active'); }, 2000);
  setTimeout(function() { document.getElementById('dot2').classList.add('active'); }, 2250);
  setTimeout(function() { document.getElementById('dot3').classList.add('active'); }, 2500);
  setTimeout(function() { splash.classList.add('fade-out'); }, 5000);
  setTimeout(function() { splash.style.display = 'none'; }, 5700);
})();

// 초기화
history.pushState({}, '', '');
applyLang();
