// ── PAWST CLASS v4.0 ──
// 심플 재설계 · 2026

var curLang     = 'ko';
var _curScreen  = 's-splash';
var _curTab     = 'home';
var _selAirline = '';
var _editAirline = '';
var _dogFilter  = 'all';
var _curDashTab = 'dogs'; // 기관 대시보드 현재 탭 (백버튼 단계적 이동에 사용)

var SUPER_ADMIN_EMAIL = 'pawstclass.1@gmail.com';

// 항공사명 → 코드 포함 표시명 (한/영 모두 지원).
// Firestore에는 항상 한글 원어("대한항공" 등)로 저장되므로, 화면에 보여줄 때
// 현재 언어(curLang)에 맞는 표시명으로 변환한다. 이렇게 해야 영어 모드에서
// 이미 등록된 항공편 카드에도 "Korean Air KE"처럼 영어로 보인다.
var AIRLINE_CODE_MAP = {
  '대한항공':    { ko: '대한항공 KE',    en: 'Korean Air KE' },
  '아시아나':    { ko: '아시아나 OZ',    en: 'Asiana OZ' },
  '에어프레미아': { ko: '에어프레미아 RS', en: 'Air Premia RS' }
};
function airlineDisplay(name) {
  var entry = AIRLINE_CODE_MAP[name];
  if (!entry) return name || '';
  return curLang === 'ko' ? entry.ko : entry.en;
}

// ══════════════════════════════════════
// 언어 토글
// ══════════════════════════════════════
function togLang() {
  curLang = curLang === 'ko' ? 'en' : 'ko';
  applyLang();
  var label = curLang === 'ko' ? 'ENG' : '한국어';
  // 화면 상단 고정 토글 + 각 탭 내부 토글(8-A-04) 모두 동기화
  ['lang-btn','lang-btn-vol'].forEach(function(id) {
    var btn = document.getElementById(id);
    if (btn) btn.textContent = label;
  });
  document.querySelectorAll('.lang-toggle-tab').forEach(function(btn) {
    btn.textContent = label;
  });
  // 언어 전환 후 현재 탭의 동적 컨텐츠를 다시 그려서 즉시 반영
  if (_curScreen === 's-main') {
    if (_curTab === 'home')     loadHome();
    if (_curTab === 'register') loadMyFlights();
    if (_curTab === 'dogs')     loadDogs();
    if (_curTab === 'mypage')   loadMyPage();
  }
  if (_curScreen === 's-orgdash') {
    var activeDashTab = document.querySelector('.dash-tab.on');
    if (activeDashTab) {
      var t = activeDashTab.id.replace('dt-','');
      setDashTab(t);
    }
  }
  if (_curScreen === 's-admindash') {
    loadAdminDash();
  }
}
function applyLang() {
  document.querySelectorAll('[data-ko]').forEach(function(el) {
    var txt = curLang === 'ko' ? el.getAttribute('data-ko') : el.getAttribute('data-en');
    if (txt) el.innerHTML = txt;
  });
  // input의 placeholder는 innerHTML로 바뀌지 않으므로 별도 속성(data-ko-ph/data-en-ph)으로 처리
  document.querySelectorAll('[data-ko-ph]').forEach(function(el) {
    var ph = curLang === 'ko' ? el.getAttribute('data-ko-ph') : el.getAttribute('data-en-ph');
    if (ph) el.setAttribute('placeholder', ph);
  });
}

// ══════════════════════════════════════
// 화면 전환
//
// _fromPopstate: popstate(뒤로가기) 처리 중에 scGo/setTab이 호출될 때는 true로
// 넘긴다. popstate 핸들러가 이미 history.pushState로 가드를 한 번 채워놓았기
// 때문에, 여기서 또 pushState를 하면 "뒤로가기 1번 = 히스토리 2칸 소비"가 되어
// 버튼을 누른 횟수와 실제 화면 단계가 어긋나는 문제가 생긴다(종료 확인 팝업이
// 떠 있는데 한 번 더 뒤로가기를 누르면 즉시 종료되는 것처럼 보이는 버그의 원인).
// ══════════════════════════════════════
var _fromPopstate = false;

function scGo(id) {
  document.querySelectorAll('.sc').forEach(function(el) { el.classList.remove('on'); });
  var el = document.getElementById(id);
  if (el) el.classList.add('on');
  _curScreen = id;
  if (!_fromPopstate) history.pushState({ screen: id }, '', '');
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
  if (!_fromPopstate) history.pushState({ screen: 's-main', tab: t }, '', '');
}

// ══════════════════════════════════════
// 기관 대시보드 탭 전환
// ══════════════════════════════════════
function setDashTab(t) {
  _curDashTab = t;
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
function goOb() {
  _obI = 0;
  scGo('s-ob');
  rOb();
}
function rOb() {
  // show/hide 방식 — translateX 완전 제거
  var slides = document.querySelectorAll('.ob-slide');
  slides.forEach(function(s, i) {
    s.style.display = i === _obI ? 'flex' : 'none';
  });
  document.querySelectorAll('.ob-dot').forEach(function(d, i) {
    d.classList.toggle('on', i === _obI);
  });
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
// 개인정보 처리방침 모달
// ══════════════════════════════════════
function showPrivacy() {
  document.getElementById('privacy-modal').style.display = 'flex';
  history.pushState({ modal: 'privacy' }, '', '');
}
function closePrivacy() {
  document.getElementById('privacy-modal').style.display = 'none';
}

// ══════════════════════════════════════
// 구글 로그인
// ══════════════════════════════════════
function doGoogleLogin() {
  var isKo = curLang === 'ko';
  var errEl = document.getElementById('vol-err');
  if (errEl) { errEl.style.display = 'none'; }

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  auth.signInWithRedirect(provider)
    .catch(function(e) {
      console.error('Google login error:', e.code, e.message);
      var msg = isKo ? '구글 로그인에 실패했습니다.' : 'Google login failed.';

      if (e.code === 'auth/popup-closed-by-user') {
        msg = isKo ? '로그인 창이 닫혔습니다. 다시 시도해 주세요.' : 'Popup closed. Please try again.';
      } else if (e.code === 'auth/popup-blocked') {
        msg = isKo ? '팝업이 차단되었습니다. 브라우저 팝업 차단을 해제해 주세요.' : 'Popup blocked. Please allow popups for this site.';
      } else if (e.code === 'auth/unauthorized-domain') {
        // 가장 흔한 원인: Firebase Console에 현재 도메인이 승인되지 않음
        msg = isKo
          ? '이 도메인은 구글 로그인이 승인되지 않았습니다. (Firebase 콘솔 → Authentication → 설정 → 승인된 도메인에서 이 사이트 주소를 추가해야 합니다)'
          : 'This domain is not authorized for Google login. (Add this domain in Firebase Console → Authentication → Settings → Authorized domains)';
      } else if (e.code === 'auth/operation-not-allowed') {
        msg = isKo
          ? '구글 로그인이 아직 활성화되지 않았습니다. (Firebase 콘솔 → Authentication → Sign-in method에서 Google을 사용 설정해 주세요)'
          : 'Google sign-in is not enabled. (Enable it in Firebase Console → Authentication → Sign-in method)';
      } else if (e.code === 'auth/cancelled-popup-request') {
        // 팝업 중복 클릭 - 무시 (에러 표시 안 함)
        return;
      } else if (e.code === 'auth/network-request-failed') {
        msg = isKo ? '네트워크 연결을 확인해 주세요.' : 'Please check your network connection.';
      } else {
        // 알려지지 않은 에러는 코드까지 같이 보여줘서 디버깅 가능하게
        msg = isKo
          ? '구글 로그인에 실패했습니다. (오류 코드: ' + (e.code||'알수없음') + ')'
          : 'Google login failed. (Error code: ' + (e.code||'unknown') + ')';
      }

      if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    });
}
// ══════════════════════════════════════
// Apple 로그인
// ══════════════════════════════════════
function doAppleLogin() {
  var isKo = curLang === 'ko';
  var errEl = document.getElementById('vol-err');
  if (errEl) { errEl.style.display = 'none'; }

  var provider = new firebase.auth.OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');

  auth.signInWithRedirect(provider)
    .catch(function(e) {
      console.error('Apple login error:', e.code, e.message);
      var msg = isKo ? 'Apple 로그인에 실패했습니다.' : 'Apple login failed.';
      if (e.code === 'auth/popup-closed-by-user') {
        msg = isKo ? '로그인 창이 닫혔습니다. 다시 시도해 주세요.' : 'Popup closed. Please try again.';
      } else if (e.code === 'auth/cancelled-popup-request') {
        return;
      } else if (e.code === 'auth/popup-blocked') {
        msg = isKo ? '팝업이 차단되었습니다. 브라우저 팝업 차단을 해제해 주세요.' : 'Popup blocked. Please allow popups.';
      }
      if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    });
}

// ══════════════════════════════════════
// 봉사자 로그인 / 회원가입
// ══════════════════════════════════════
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
      // 체크되어 있으면 저장하고, 체크 해제 상태면 이전에 저장된 이메일도 함께 지워서
      // "저장 안 함"을 선택했는데 다음 접속 때 예전 이메일이 자동입력되는 일이 없게 한다.
      if (document.getElementById('vol-remember').checked) {
        localStorage.setItem('pawst_email', email);
      } else {
        localStorage.removeItem('pawst_email');
      }
    })
    .catch(function(e) {
      console.error('Login error:', e.code, e.message);
      var msg = isKo
        ? '로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해 주세요.'
        : 'Login failed. Please check your email and password.';
      if (e.code === 'auth/invalid-email')       msg = isKo ? '이메일 형식이 올바르지 않습니다. (예: name@email.com)' : 'Invalid email format. (e.g. name@email.com)';
      else if (e.code === 'auth/user-not-found') msg = isKo ? '등록되지 않은 이메일입니다. 회원가입 탭에서 먼저 가입해 주세요.' : 'No account found with this email. Please sign up first.';
      else if (e.code === 'auth/wrong-password') msg = isKo ? '비밀번호가 올바르지 않습니다. 다시 입력하거나 "비밀번호 찾기"를 이용해 주세요.' : 'Incorrect password. Try again or use "Forgot password".';
      else if (e.code === 'auth/invalid-credential') msg = isKo ? '이메일 또는 비밀번호가 올바르지 않습니다. 등록된 계정인지 확인해 주세요.' : 'Incorrect email or password. Please check your account details.';
      else if (e.code === 'auth/too-many-requests') msg = isKo ? '로그인 시도가 너무 많습니다. 1-2분 후 다시 시도해 주세요.' : 'Too many attempts. Please wait 1-2 minutes and try again.';
      else if (e.code === 'auth/network-request-failed') msg = isKo ? '네트워크 연결을 확인해 주세요.' : 'Please check your network connection.';
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
  var agreeEl = document.getElementById('agree-privacy');
  if (agreeEl && !agreeEl.checked) { showVolErr(isKo ? '개인정보 수집·이용에 동의해 주세요.' : 'Please agree to the privacy policy.'); return; }
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
  // 어드민 로그인 시도가 진행 중일 때는 doAdminLogin()이 직접 판단/라우팅을 끝낼 때까지
  // 여기서 자동 라우팅을 하지 않는다. (기관 계정으로 어드민 로그인 시도 시 화면이
  // 잘못 기관 대시보드로 새는 race condition 방지)
  if (_adminLoginInProgress) return;

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
// 기관 로그인 이메일 자동완성
// ══════════════════════════════════════
function loadOrgEmail() {
  var saved = localStorage.getItem('pawst_org_email');
  if (saved) {
    var el = document.getElementById('org-email');
    if (el) el.value = saved;
  }
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
    .then(function() {
      // 봉사자 로그인과 동일하게, 체크되어 있으면 이메일만 저장(비밀번호는 절대 저장하지 않음)하고
      // 체크 해제 상태면 이전에 저장된 이메일도 지운다.
      var rememberEl = document.getElementById('org-remember');
      if (rememberEl && rememberEl.checked) {
        localStorage.setItem('pawst_org_email', email);
      } else {
        localStorage.removeItem('pawst_org_email');
      }
    })
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
// 국적 / 체류자격 select - "기타" 선택시 직접입력 칸 노출
// ══════════════════════════════════════
function toggleOtherInput(selectId, otherInputId) {
  var sel = document.getElementById(selectId);
  var other = document.getElementById(otherInputId);
  if (!sel || !other) return;
  if (sel.value === '기타') {
    other.style.display = 'block';
  } else {
    other.style.display = 'none';
    other.value = '';
  }
}

// ══════════════════════════════════════
// 항공편 등록
// ══════════════════════════════════════
function doRegister() {
  var isKo  = curLang === 'ko';
  var nameKo = (document.getElementById('reg-name-ko').value || '').trim();
  var nameEn = (document.getElementById('reg-name-en').value || '').trim();
  var date  = document.getElementById('reg-date').value;
  var bookingRef = (document.getElementById('reg-booking-ref').value || '').trim();
  var usAddress  = (document.getElementById('reg-us-address').value || '').trim();
  var nationalitySel = document.getElementById('reg-nationality').value;
  var nationalityOther = (document.getElementById('reg-nationality-other').value || '').trim();
  var nationality = nationalitySel === '기타' ? nationalityOther : nationalitySel;
  var residencySel = document.getElementById('reg-residency').value;
  var residencyOther = (document.getElementById('reg-residency-other').value || '').trim();
  var residency = residencySel === '기타' ? residencyOther : residencySel;
  var kakao = (document.getElementById('reg-kakao').value || '').trim();
  var phone = (document.getElementById('reg-phone').value || '').trim();
  var err   = document.getElementById('reg-err');
  err.style.display = 'none';

  var user = auth.currentUser;
  if (!user) { scGo('s-vollogin'); return; }
  if (!nameKo) {
    err.textContent = isKo ? '한국 이름을 입력해 주세요.' : 'Please enter your Korean name.';
    err.style.display = 'block'; return;
  }
  if (!nameEn) {
    err.textContent = isKo ? '영문 이름을 입력해 주세요.' : 'Please enter your English name.';
    err.style.display = 'block'; return;
  }
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
  if (!bookingRef) {
    err.textContent = isKo ? '항공권 예약번호를 입력해 주세요.' : 'Please enter your booking reference.';
    err.style.display = 'block'; return;
  }
  if (!usAddress) {
    err.textContent = isKo ? '미국 내 주소를 입력해 주세요.' : 'Please enter your US address.';
    err.style.display = 'block'; return;
  }
  if (!nationalitySel) {
    err.textContent = isKo ? '국적을 선택해 주세요.' : 'Please select your nationality.';
    err.style.display = 'block'; return;
  }
  if (nationalitySel === '기타' && !nationalityOther) {
    err.textContent = isKo ? '국적을 직접 입력해 주세요.' : 'Please specify your nationality.';
    err.style.display = 'block'; return;
  }
  if (!residencySel) {
    err.textContent = isKo ? '체류 자격을 선택해 주세요.' : 'Please select your residency status.';
    err.style.display = 'block'; return;
  }
  if (residencySel === '기타' && !residencyOther) {
    err.textContent = isKo ? '체류 자격을 직접 입력해 주세요.' : 'Please specify your residency status.';
    err.style.display = 'block'; return;
  }
  if (!kakao && !phone) {
    err.textContent = isKo ? '카카오톡 ID 또는 전화번호 중 하나는 입력해 주세요.' : 'Please enter KakaoTalk ID or phone number.';
    err.style.display = 'block'; return;
  }
  var agreeFlightEl = document.getElementById('agree-flight');
  if (agreeFlightEl && !agreeFlightEl.checked) {
    err.textContent = isKo ? '개인정보 수집·이용에 동의해 주세요.' : 'Please agree to the privacy policy.';
    err.style.display = 'block'; return;
  }

  db.collection('volunteers').add({
    nameKo:      nameKo,
    nameEn:      nameEn,
    name:        nameKo, // 구버전 화면(기존 v.name 참조 코드) 호환을 위해 한국 이름을 그대로도 저장
    email:       user.email,
    airline:     _selAirline,
    flightDate:  date,
    bookingRef:  bookingRef,
    usAddress:   usAddress,
    nationality: nationality,
    residencyStatus: residency,
    kakao:       kakao,
    phone:       phone,
    status:      'pending',
    createdAt:   firebase.firestore.FieldValue.serverTimestamp()
  }).then(function() {
    // 등록 성공 시 어드민 + 협력기관에 이메일 알림 발송 (실패해도 등록 자체는 무관하게 계속 진행)
    if (typeof emailjs !== 'undefined') {
      var contactInfo = (kakao ? '카카오: ' + kakao : '') + (kakao && phone ? ' / ' : '') + (phone ? '전화: ' + phone : '');
      emailjs.send('service_9k50h63', 'template_y9vcw98', {
        volunteer_name: nameKo,
        airline: airlineDisplay(_selAirline),
        flight_date: date,
        contact_info: contactInfo || '연락처 미입력'
      }).catch(function(emailErr) {
        console.error('EmailJS 알림 발송 실패:', emailErr);
      });
    }

    alert(isKo
      ? '✅ 항공편이 등록되었습니다!\n파트너 기관에서 카카오톡 또는 전화로 연락드릴 예정입니다.'
      : '✅ Flight registered!\nPartner organizations will contact you via KakaoTalk or phone.');
    document.getElementById('reg-name-ko').value = '';
    document.getElementById('reg-name-en').value = '';
    document.getElementById('reg-date').value = '';
    document.getElementById('reg-booking-ref').value = '';
    document.getElementById('reg-us-address').value = '';
    document.getElementById('reg-nationality').value = '';
    document.getElementById('reg-nationality-other').value = '';
    document.getElementById('reg-nationality-other').style.display = 'none';
    document.getElementById('reg-residency').value = '';
    document.getElementById('reg-residency-other').value = '';
    document.getElementById('reg-residency-other').style.display = 'none';
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
          '<div class="flight-route">' + (v.name ? v.name+' · ' : '') + 'ICN ✈️ ATL</div>' +
          '<span class="badge ' + st.cls + '">' + (curLang==='ko'?st.ko:st.en) + '</span>' +
          '</div>' +
          '<div class="flight-detail">' +
          '🛫 ' + airlineDisplay(v.airline) + ' · 📅 ' + (v.flightDate||'') + '<br>' +
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
    document.getElementById('edit-name-ko').value = v.nameKo || v.name || '';
    document.getElementById('edit-name-en').value = v.nameEn || '';
    document.getElementById('edit-date').value  = v.flightDate || '';
    document.getElementById('edit-booking-ref').value = v.bookingRef || '';
    document.getElementById('edit-us-address').value  = v.usAddress || '';
    document.getElementById('edit-kakao').value = v.kakao || '';
    document.getElementById('edit-phone').value = v.phone || '';

    // 국적: 미리 정의된 옵션(대한민국/미국)에 해당하면 그 옵션을 선택하고,
    // 그 외 값이면 "기타"를 선택한 뒤 직접입력 칸에 채워서 기존 데이터도 그대로 보존되게 한다.
    var natSel = document.getElementById('edit-nationality');
    var natOther = document.getElementById('edit-nationality-other');
    var savedNat = v.nationality || '';
    var natPredefined = ['대한민국','미국'].indexOf(savedNat) > -1;
    natSel.value = savedNat === '' ? '' : (natPredefined ? savedNat : '기타');
    natOther.value = natPredefined ? '' : savedNat;
    natOther.style.display = (!natPredefined && savedNat !== '') ? 'block' : 'none';

    var resSel = document.getElementById('edit-residency');
    var resOther = document.getElementById('edit-residency-other');
    var savedRes = v.residencyStatus || '';
    var resPredefined = ['시민권자','영주권자','유학생비자','취업비자'].indexOf(savedRes) > -1;
    resSel.value = savedRes === '' ? '' : (resPredefined ? savedRes : '기타');
    resOther.value = resPredefined ? '' : savedRes;
    resOther.style.display = (!resPredefined && savedRes !== '') ? 'block' : 'none';

    _editAirline = v.airline || '';
    // 언어 무관하게 onclick 속성의 값으로 매칭 (data-en/ko 변경에 영향 없음)
    document.querySelectorAll('#edit-airline-chips .chip').forEach(function(c) {
      var onclick = c.getAttribute('onclick') || '';
      var match = onclick.match(/selEditAirline\(this,'([^']+)'\)/);
      var chipVal = match ? match[1] : '';
      c.classList.toggle('on', chipVal === _editAirline);
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
  var nameKo = (document.getElementById('edit-name-ko').value || '').trim();
  var nameEn = (document.getElementById('edit-name-en').value || '').trim();
  var date  = document.getElementById('edit-date').value;
  var bookingRef = (document.getElementById('edit-booking-ref').value || '').trim();
  var usAddress  = (document.getElementById('edit-us-address').value || '').trim();
  var nationalitySel = document.getElementById('edit-nationality').value;
  var nationalityOther = (document.getElementById('edit-nationality-other').value || '').trim();
  var nationality = nationalitySel === '기타' ? nationalityOther : nationalitySel;
  var residencySel = document.getElementById('edit-residency').value;
  var residencyOther = (document.getElementById('edit-residency-other').value || '').trim();
  var residency = residencySel === '기타' ? residencyOther : residencySel;
  var kakao = (document.getElementById('edit-kakao').value || '').trim();
  var phone = (document.getElementById('edit-phone').value || '').trim();
  if (!nameKo) {
    alert(isKo ? '한국 이름을 입력해 주세요.' : 'Please enter your Korean name.'); return;
  }
  if (!nameEn) {
    alert(isKo ? '영문 이름을 입력해 주세요.' : 'Please enter your English name.'); return;
  }
  if (!_editAirline) {
    alert(isKo ? '항공사를 선택해 주세요.' : 'Please select an airline.'); return;
  }
  if (date && date < new Date().toISOString().slice(0,10)) {
    alert(isKo ? '출발 날짜는 오늘 이후여야 합니다.' : 'Date must be today or later.'); return;
  }
  if (!bookingRef) {
    alert(isKo ? '항공권 예약번호를 입력해 주세요.' : 'Please enter your booking reference.'); return;
  }
  if (!usAddress) {
    alert(isKo ? '미국 내 주소를 입력해 주세요.' : 'Please enter your US address.'); return;
  }
  if (!nationalitySel) {
    alert(isKo ? '국적을 선택해 주세요.' : 'Please select your nationality.'); return;
  }
  if (nationalitySel === '기타' && !nationalityOther) {
    alert(isKo ? '국적을 직접 입력해 주세요.' : 'Please specify your nationality.'); return;
  }
  if (!residencySel) {
    alert(isKo ? '체류 자격을 선택해 주세요.' : 'Please select your residency status.'); return;
  }
  if (residencySel === '기타' && !residencyOther) {
    alert(isKo ? '체류 자격을 직접 입력해 주세요.' : 'Please specify your residency status.'); return;
  }
  if (!kakao && !phone) {
    alert(isKo ? '카카오톡 ID 또는 전화번호를 입력해 주세요.' : 'Enter KakaoTalk ID or phone.'); return;
  }
  db.collection('volunteers').doc(vid).update({
    nameKo:      nameKo,
    nameEn:      nameEn,
    name:        nameKo, // 구버전 화면 호환
    airline:     _editAirline,
    flightDate:  date,
    bookingRef:  bookingRef,
    usAddress:   usAddress,
    nationality: nationality,
    residencyStatus: residency,
    kakao:       kakao,
    phone:       phone
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

var ORG_LINKS = {
  'kpups@pc.com':   'https://www.kpupsforlove.org/',
  'adoptme@pc.com': 'https://adoptmekr.org/',
  'gamjane@pc.com': 'https://www.instagram.com/gamjane_house?igsh=dHlheGExMGg3ejRo'
};

function loadOrgCards() {
  var el = document.getElementById('home-orgs-list');
  if (!el) return;
  el.innerHTML = Object.keys(ORG_MAP).map(function(email) {
    var org  = ORG_MAP[email];
    var link = ORG_LINKS[email] || '#';
    return '<a href="' + link + '" target="_blank" style="text-decoration:none;">' +
      '<div class="card" style="display:flex;align-items:center;gap:12px;cursor:pointer;">' +
        '<div style="width:48px;height:48px;border-radius:14px;background:' + org.color + ';display:flex;align-items:center;justify-content:center;font-size:26px;">' + org.ico + '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-weight:800;font-size:15px;color:var(--tx);">' + org.name + '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-top:3px;">' + (curLang==='ko'?'파트너 기관 · 탭하여 방문 →':'Partner Org · Tap to visit →') + '</div>' +
        '</div>' +
      '</div>' +
    '</a>';
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
        var org = getOrgInfo(d.orgEmail) || { ico:'🏥', name:'기관', color:'#FFF5E6' };
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
        var v = doc.data(); var vid = doc.id;
        var st = stMap[v.status] || stMap.pending;
        var canEdit = v.status === 'pending';
        return '<div class="flight-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<div class="flight-route" style="font-size:14px;">' + (v.name ? v.name+' · ' : '') + 'ICN ✈️ ATL</div>' +
          '<span class="badge ' + st.cls + '">' + (isKo?st.ko:st.en) + '</span>' +
          '</div>' +
          '<div class="flight-detail">' + airlineDisplay(v.airline) + ' · ' + (v.flightDate||'') + '</div>' +
          (canEdit ?
            '<div class="flight-actions" style="margin-top:10px;">' +
            '<button class="btn-sm btn-sm-or" onclick="openFlightModal(\'' + vid + '\')">' + (isKo?'수정':'Edit') + '</button>' +
            '<button class="btn-sm btn-sm-re" onclick="deleteFlight(\'' + vid + '\')">' + (isKo?'삭제':'Delete') + '</button>' +
            '</div>' : '') +
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
      // 필터: 구버전 이메일(LEGACY_ORG_MAP)로 저장된 강아지도 같은 기관으로 인식하도록
      // 이메일을 직접 비교하지 않고, "같은 기관"인지(기관명 일치)로 비교한다.
      if (_dogFilter !== 'all') {
        var targetOrg = getOrgInfo(_dogFilter);
        docs = docs.filter(function(d) {
          var dEmail = d.data().orgEmail;
          if (dEmail === _dogFilter) return true; // 이메일 완전 일치
          var dOrg = getOrgInfo(dEmail);
          return targetOrg && dOrg && dOrg.name === targetOrg.name; // 같은 기관이면 일치로 간주
        });
      }
      if (!docs.length) {
        el.innerHTML = '<div class="empty-state"><div class="em">🐾</div><div class="msg">' + (isKo?'등록된 강아지가 없습니다.':'No dogs registered.') + '</div></div>';
        return;
      }
      el.innerHTML = docs.map(function(doc) {
        var d = doc.data();
        var org = getOrgInfo(d.orgEmail) || { ico:'🏥', name: d.orgEmail||'기관', color:'#FFF5E6' };
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
        if (_dogFilter !== 'all') {
          var targetOrg2 = getOrgInfo(_dogFilter);
          docs = docs.filter(function(d) {
            var dEmail = d.data().orgEmail;
            if (dEmail === _dogFilter) return true;
            var dOrg = getOrgInfo(dEmail);
            return targetOrg2 && dOrg && dOrg.name === targetOrg2.name;
          });
        }
        if (!docs.length) {
          el.innerHTML = '<div class="empty-state"><div class="em">🐾</div><div class="msg">' + (isKo?'등록된 강아지가 없습니다.':'No dogs registered.') + '</div></div>';
          return;
        }
        el.innerHTML = docs.map(function(doc) {
          var d = doc.data();
          var org = getOrgInfo(d.orgEmail) || { ico:'🏥', name:'기관', color:'#FFF5E6' };
          return '<div class="dog-card"><div class="dog-emoji">🐶</div><div class="dog-info"><div class="dog-name">' + (d.name||'') + '</div><div class="dog-detail">' + org.ico + ' ' + org.name + ' · ⚖️ ' + (d.weight||'?') + 'kg · 📅 ' + (d.period||'') + (d.note ? '<br>📌 ' + d.note : '') + '</div></div></div>';
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
      '<div style="font-size:13px;color:var(--t2);margin-bottom:4px;">' + (isKo?'내 봉사 현황':'My Volunteering') + '</div>' +
      '<div style="font-size:11px;color:var(--t3);margin-bottom:12px;">' + (isKo?'※ 연락완료/이동완료는 파트너 기관이 직접 처리합니다':'※ Contacted/Done status is updated by partner organizations') + '</div>' +
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
            '<div style="font-weight:800;">' + (v.name ? v.name+' · ' : '') + 'ICN ✈️ ATL</div>' +
            '<span class="badge ' + st.cls + '">' + (isKo ? st.ko : st.en) + '</span>' +
          '</div>' +
          '<div class="flight-detail">' +
            '🛫 ' + airlineDisplay(v.airline) + ' · 📅 ' + dateStr +
            (v.kakao ? '<br>💬 ' + v.kakao : '') +
            (v.phone ? (v.kakao?' · ':'<br>') + '📞 ' + v.phone : '') +
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
      // period 필드 호환: 신규(periodStart/periodEnd) + 구버전(period 텍스트) 모두 지원
      document.getElementById('dog-period-start').value = d.periodStart || '';
      document.getElementById('dog-period-end').value   = d.periodEnd   || '';
      document.getElementById('dog-note').value   = d.note   || '';
    });
  } else {
    titleEl.textContent = isKo ? '강아지 등록' : 'Register Dog';
    ['dog-name','dog-breed','dog-weight','dog-period-start','dog-period-end','dog-note'].forEach(function(id) {
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
  var name        = (document.getElementById('dog-name').value || '').trim();
  var breed       = (document.getElementById('dog-breed').value || '').trim();
  var weight      = (document.getElementById('dog-weight').value || '').trim();
  var periodStart = document.getElementById('dog-period-start').value || '';
  var periodEnd   = document.getElementById('dog-period-end').value || '';
  var note        = (document.getElementById('dog-note').value || '').trim();
  var errEl  = document.getElementById('dog-modal-err');
  errEl.style.display = 'none';

  if (!name) { errEl.textContent = isKo ? '이름을 입력해 주세요.' : 'Please enter name.'; errEl.style.display = 'block'; return; }
  if (periodStart && periodEnd && periodEnd < periodStart) {
    errEl.textContent = isKo ? '종료일은 시작일 이후여야 합니다.' : 'End date must be after start date.';
    errEl.style.display = 'block'; return;
  }

  // period: 화면 표시용 텍스트(구버전 호환) — 날짜가 있으면 "YYYY-MM-DD ~ YYYY-MM-DD" 형식으로 자동 생성
  var period = (periodStart && periodEnd) ? (periodStart + ' ~ ' + periodEnd) : (periodStart || periodEnd || '');

  // 신규 등록은 status:'waiting' 포함, 수정은 status 제외 (기존 status 유지)
  var newData  = { name: name, breed: breed, weight: weight, period: period, periodStart: periodStart, periodEnd: periodEnd, note: note, orgEmail: user.email };
  var editData = { name: name, breed: breed, weight: weight, period: period, periodStart: periodStart, periodEnd: periodEnd, note: note };

  var p = did
    ? db.collection('dogs').doc(did).update(editData)
    : db.collection('dogs').add(Object.assign(newData, { status: 'waiting', createdAt: firebase.firestore.FieldValue.serverTimestamp() }));

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
  var orgEmail = auth.currentUser ? auth.currentUser.email : '';
  el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);">' + (isKo?'불러오는 중...':'Loading...') + '</div>';

  // 봉사자 탭: pending/matched 전체 목록 (날짜순)
  // 기관이 연락완료 표시하면 matchedOrgEmail로 본인 기관 기록
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
        // 다른 기관이 이미 연락완료 표시한 건인지 확인.
        // 본인 기관이 아니면 "연락완료 취소" 버튼을 숨겨서, 타 기관의 연락 기록을
        // 실수로 취소시키는 일이 없도록 한다. (대기중 상태는 누구나 처리 가능)
        var isMatchedByOther = v.status === 'matched' && v.matchedOrgEmail && v.matchedOrgEmail !== orgEmail;
        var nameKo = v.nameKo || v.name || '';
        return '<div class="card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<div style="font-weight:800;">' + (nameKo ? '👤 '+nameKo+' · ' : '') + '✈️ ' + airlineDisplay(v.airline) + '</div>' +
          '<span class="badge ' + stCls + '">' + stTxt + '</span>' +
          '</div>' +
          '<div style="font-size:13px;color:var(--t2);margin-top:6px;">📅 ' + (v.flightDate||'') + ' · ICN → ATL</div>' +
          (v.nameEn ? '<div style="font-size:12px;color:var(--t2);margin-top:4px;">🪪 ' + v.nameEn + '</div>' : '') +
          (v.bookingRef ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🎫 ' + (isKo?'예약번호 ':'Booking ') + v.bookingRef + '</div>' : '') +
          (v.nationality || v.residencyStatus ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🌐 ' + [v.nationality, v.residencyStatus].filter(Boolean).join(' · ') + '</div>' : '') +
          (v.usAddress ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🏠 ' + v.usAddress + '</div>' : '') +
          (isMatchedByOther ? '<div style="font-size:12px;color:var(--or);margin-top:4px;">' + (isKo?'⚠️ 다른 기관이 이미 연락완료 처리했습니다':'⚠️ Already marked contacted by another organization') + '</div>' : '') +
          '<div style="font-size:13px;margin-top:6px;color:var(--tx);">' +
          (kakaoId ? '💬 ' + kakaoId : '') + (kakaoId && phone ? ' · ' : '') + (phone ? '📞 ' + phone : '') + ((!kakaoId && !phone) ? '<span style="color:var(--t3);font-size:12px;">' + (isKo?'연락처 없음':'No contact info') + '</span>' : '') +
          '</div>' +
          '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">' +
          (kakaoId ? '<button class="kakao-btn" style="flex:1;padding:10px;" onclick="copyKakao(\'' + kakaoId + '\')">💬 ' + (isKo?'카카오톡 ID 복사':'Copy KakaoTalk ID') + '</button>' : '') +
          (phone   ? '<a href="tel:' + phone + '" class="btn-sm btn-sm-or" style="flex:1;text-align:center;text-decoration:none;padding:10px;border-radius:10px;">📞 ' + (isKo?'전화 연결':'Call') + '</a>' : '') +
          '</div>' +
          (isMatchedByOther ? '' :
            '<button class="btn-sm btn-sm-gr" style="width:100%;margin-top:8px;" onclick="markContacted(\'' + vid + '\',' + (v.status==='matched') + ',\'' + orgEmail + '\')">' +
            (v.status==='matched' ? (isKo?'✅ 연락완료 취소':'↩ Undo Contacted') : (isKo?'📱 연락완료 표시':'📱 Mark Contacted')) +
            '</button>') +
          (v.status==='matched' && !isMatchedByOther ?
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
          var isMatchedByOther = v.status === 'matched' && v.matchedOrgEmail && v.matchedOrgEmail !== orgEmail;
          var nameKo = v.nameKo || v.name || '';
          return '<div class="card">' +
            '<div style="font-weight:800;">' + (nameKo ? '👤 '+nameKo+' · ' : '') + '✈️ ' + airlineDisplay(v.airline) + ' · 📅 ' + (v.flightDate||'') + '</div>' +
            (v.nameEn ? '<div style="font-size:12px;color:var(--t2);margin-top:4px;">🪪 ' + v.nameEn + '</div>' : '') +
            (v.bookingRef ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🎫 ' + (isKo?'예약번호 ':'Booking ') + v.bookingRef + '</div>' : '') +
            (v.nationality || v.residencyStatus ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🌐 ' + [v.nationality, v.residencyStatus].filter(Boolean).join(' · ') + '</div>' : '') +
            (v.usAddress ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🏠 ' + v.usAddress + '</div>' : '') +
            (isMatchedByOther ? '<div style="font-size:12px;color:var(--or);margin-top:4px;">' + (isKo?'⚠️ 다른 기관이 이미 연락완료 처리했습니다':'⚠️ Already marked contacted by another organization') + '</div>' : '') +
            '<div style="font-size:13px;margin-top:6px;">' +
            (kakaoId?'💬 '+kakaoId:'') + (kakaoId&&phone?' · ':'') + (phone?'📞 '+phone:'') +
            '</div>' +
            '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">' +
            (kakaoId?'<button class="kakao-btn" style="flex:1;padding:10px;" onclick="copyKakao(\''+kakaoId+'\')">💬 '+(isKo?'카카오 복사':'Copy')+'</button>':'') +
            (phone?'<a href="tel:'+phone+'" class="btn-sm btn-sm-or" style="flex:1;text-align:center;text-decoration:none;padding:10px;border-radius:10px;">📞 '+(isKo?'전화':'Call')+'</a>':'') +
            '</div>' +
            (isMatchedByOther ? '' : '<button class="btn-sm btn-sm-gr" style="width:100%;margin-top:8px;" onclick="markContacted(\''+vid+'\',false,\''+orgEmail+'\')">'+(isKo?'📱 연락완료 표시':'📱 Mark Contacted')+'</button>') +
            '</div>';
        }).join('');
      });
    });
}

function markContacted(vid, isAlreadyContacted, callerOrgEmail) {
  var isKo = curLang === 'ko';
  var user = auth.currentUser;
  if (!user) return;

  // 취소(연락완료→대기중)인 경우, 실제로 이 건을 연락완료 처리한 기관이 본인인지
  // Firestore에서 한 번 더 확인한다. 화면 버튼은 이미 타 기관 건이면 숨기지만,
  // 혹시 화면이 갱신되지 않은 상태로 클릭되는 경우까지 방어하기 위한 이중 체크.
  if (isAlreadyContacted) {
    db.collection('volunteers').doc(vid).get().then(function(doc) {
      if (!doc.exists) return;
      var v = doc.data();
      if (v.matchedOrgEmail && v.matchedOrgEmail !== user.email) {
        alert(isKo
          ? '다른 기관이 연락완료 처리한 봉사자입니다. 취소할 수 없습니다.'
          : 'This volunteer was marked contacted by another organization. You cannot undo it.');
        loadDashVols();
        return;
      }
      db.collection('volunteers').doc(vid).update({ status: 'pending', matchedOrgEmail: '' })
        .then(function() { loadDashVols(); })
        .catch(function(e) { alert('오류: ' + e.message); });
    });
    return;
  }

  // 연락완료 표시 — 이 경우는 누구나(아직 아무도 연락 안 한 건이므로) 가능
  db.collection('volunteers').doc(vid).update({ status: 'matched', matchedOrgEmail: user.email })
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
  var user = auth.currentUser;
  if (!user) return;
  var myOrgEmail = user.email;
  el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);">' + (isKo?'불러오는 중...':'Loading...') + '</div>';

  // 완료 탭: 본인 기관이 matchedOrgEmail로 기록된 건만 표시
  // (matchedOrgEmail 없는 구버전 데이터는 전체 표시)
  db.collection('volunteers').where('status','==','done').get()
    .then(function(snap) {
      if (snap.empty) {
        el.innerHTML = '<div class="empty-state"><div class="em">✅</div><div class="msg">' + (isKo?'완료된 봉사가 없습니다.':'No completed transports yet.') + '</div></div>';
        return;
      }
      // 본인 기관이 연락완료한 건 + 구버전(matchedOrgEmail 없는) 건 표시
      var filteredDocs = snap.docs.filter(function(doc) {
        var v = doc.data();
        return !v.matchedOrgEmail || v.matchedOrgEmail === myOrgEmail;
      });

      if (!filteredDocs.length) {
        el.innerHTML = '<div class="empty-state"><div class="em">✅</div><div class="msg">' + (isKo?'완료된 봉사가 없습니다.':'No completed transports yet.') + '</div></div>';
        return;
      }

      var countHtml = '<div class="done-count-banner">' +
        '<span style="font-size:28px;font-weight:900;color:var(--gr);">' + filteredDocs.length + '</span>' +
        '<span style="font-size:13px;color:var(--t2);margin-left:8px;">' + (isKo?'건 이동완료':'transports completed') + '</span>' +
        '</div>';

      var listHtml = filteredDocs.map(function(doc) {
        var v = doc.data(); var vid = doc.id;
        var doneDate = '';
        try { doneDate = v.doneAt ? new Date(v.doneAt.toDate()).toLocaleDateString('ko-KR') : ''; }
        catch(e) { doneDate = ''; }
        var nameKo = v.nameKo || v.name || '';
        return '<div class="card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
            '<div style="font-weight:800;">' + (nameKo ? '👤 '+nameKo+' · ' : '') + '✈️ ' + airlineDisplay(v.airline) + '</div>' +
            '<span class="badge badge-gr">' + (isKo?'이동완료':'Done') + '</span>' +
          '</div>' +
          '<div style="font-size:13px;color:var(--t2);margin-top:6px;">📅 ' + (v.flightDate||'') + ' · ICN → ATL</div>' +
          (v.nameEn ? '<div style="font-size:12px;color:var(--t2);margin-top:4px;">🪪 ' + v.nameEn + '</div>' : '') +
          (v.bookingRef ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🎫 ' + (isKo?'예약번호 ':'Booking ') + v.bookingRef + '</div>' : '') +
          (v.nationality || v.residencyStatus ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🌐 ' + [v.nationality, v.residencyStatus].filter(Boolean).join(' · ') + '</div>' : '') +
          (v.usAddress ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">🏠 ' + v.usAddress + '</div>' : '') +
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
  var user = auth.currentUser;
  if (!user) return;
  if (!confirm(isKo ? '이동완료로 처리할까요?\n봉사자의 이력에 기록됩니다.' : 'Mark as done?\nThis will be recorded in the volunteer\'s history.')) return;

  // markContacted()의 취소(연락완료 취소)에 적용했던 것과 동일한 이중 검증을
  // 이동완료 처리에도 적용한다. 화면 버튼은 본인 기관이 연락완료한 건일 때만
  // 보이도록 되어 있지만, 화면이 갱신되지 않은 상태로 클릭되는 경우까지 막기 위해
  // Firestore에서 실제 matchedOrgEmail을 한 번 더 확인한다.
  db.collection('volunteers').doc(vid).get().then(function(doc) {
    if (!doc.exists) return;
    var v = doc.data();
    if (v.matchedOrgEmail && v.matchedOrgEmail !== user.email) {
      alert(isKo
        ? '다른 기관이 연락완료 처리한 봉사자입니다. 이동완료 처리할 수 없습니다.'
        : 'This volunteer was marked contacted by another organization. You cannot mark it as done.');
      loadDashVols();
      return;
    }
    db.collection('volunteers').doc(vid).update({
      status: 'done',
      doneAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
      alert(isKo ? '✅ 이동완료 처리되었습니다! 🎉\n봉사자 이력에 기록되었습니다.' : '✅ Marked as done! 🎉\nRecorded in volunteer history.');
      loadDashVols();
      loadDashDone();
    }).catch(function(e) { alert('오류: ' + e.message); });
  });
}

function undoDone(vid) {
  var isKo = curLang === 'ko';
  if (!confirm(isKo ? '대기 상태로 되돌릴까요?\n연락완료 기록도 함께 초기화됩니다.' : 'Undo and return to pending?\nContact record will also be reset.')) return;
  // 완료 상태를 되돌릴 때 doneAt, matchedOrgEmail도 함께 초기화해서
  // "대기중"인데 예전 기관 기록이 남아 있는 어색한 상태가 되지 않도록 한다.
  db.collection('volunteers').doc(vid).update({
    status: 'pending',
    doneAt: firebase.firestore.FieldValue.delete(),
    matchedOrgEmail: firebase.firestore.FieldValue.delete()
  })
    .then(function() {
      loadDashDone();
      loadDashVols();
      alert(isKo ? '대기 상태로 되돌렸습니다.' : 'Reverted to pending.');
    })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// ══════════════════════════════════════
// 어드민
// ══════════════════════════════════════
// 어드민이 아닌 계정(예: 기관 계정)으로 어드민 로그인을 시도했을 때,
// onAuthStateChanged가 먼저 발동해 기관 대시보드로 화면을 바꿔버리는 race condition을
// 막기 위한 플래그. true인 동안은 onAuthStateChanged의 자동 라우팅을 잠시 막는다.
var _adminLoginInProgress = false;

function doAdminLogin() {
  var email = (document.getElementById('admin-email').value || '').trim();
  var pw    = document.getElementById('admin-pw').value || '';
  var isKo  = curLang === 'ko';
  document.getElementById('admin-err').style.display = 'none';

  _adminLoginInProgress = true;

  auth.signInWithEmailAndPassword(email, pw)
    .then(function(cred) {
      if (cred.user.email !== SUPER_ADMIN_EMAIL) {
        // 어드민이 아닌 계정 — 기관 대시보드 등으로 새지 않도록 즉시 로그아웃
        return auth.signOut().then(function() {
          _adminLoginInProgress = false;
          document.getElementById('admin-err').textContent = isKo
            ? '어드민 계정이 아닙니다. (기관 계정은 단체 관리자 로그인을 이용해 주세요)'
            : 'This is not an admin account. (Organizations should use Organization Login instead)';
          document.getElementById('admin-err').style.display = 'block';
        });
      }
      _adminLoginInProgress = false;
      scGo('s-admindash'); loadAdminDash();
    })
    .catch(function(e) {
      _adminLoginInProgress = false;
      var msg = isKo ? '로그인 실패. 이메일/비밀번호를 확인하세요.' : 'Login failed. Please check email/password.';
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
        msg = isKo ? '이메일 또는 비밀번호가 올바르지 않습니다.' : 'Incorrect email or password.';
      }
      document.getElementById('admin-err').textContent = msg;
      document.getElementById('admin-err').style.display = 'block';
    });
}
function doAdminLogout() {
  auth.signOut().then(function() { scGo('s-splash'); });
}
function loadAdminDash() {
  var isKo = curLang === 'ko';
  Promise.all([
    db.collection('volunteers').get(),
    db.collection('dogs').get()
  ]).then(function(results) {
    var vols = results[0]; var dogs = results[1];
    var done    = vols.docs.filter(function(d) { return d.data().status === 'done'; }).length;
    var matched = vols.docs.filter(function(d) { return d.data().status === 'matched'; }).length;
    var pending = vols.docs.filter(function(d) { return d.data().status === 'pending'; }).length;
    var waiting = dogs.docs.filter(function(d) { return d.data().status === 'waiting'; }).length;

    // 통계는 아래 statsHtml에서 한번에 처리

    // 강아지 기관별 집계
    // 기관명(name) 기준으로 집계해서, 구버전 이메일(LEGACY_ORG_MAP)로 등록된 강아지도
    // 같은 기관으로 합산되도록 한다. 이렇게 하면 "강아지 목록(전체)"과
    // "기관별 강아지 현황(집계)"의 합계가 항상 일치한다.
    var orgDogs = {};
    Object.keys(ORG_MAP).forEach(function(e) { orgDogs[e] = { waiting:0, total:0 }; });
    var uncategorizedDogs = { waiting:0, total:0 }; // 어떤 기관 맵에도 없는 이메일(완전 미등록)

    dogs.docs.forEach(function(doc) {
      var d = doc.data();
      // 1순위: 현재 ORG_MAP에 정확히 일치
      if (orgDogs[d.orgEmail]) {
        orgDogs[d.orgEmail].total++;
        if (d.status === 'waiting') orgDogs[d.orgEmail].waiting++;
        return;
      }
      // 2순위: LEGACY_ORG_MAP 등 다른 이메일이지만 같은 기관명 → 현재 이메일 키로 합산
      var dOrgInfo = getOrgInfo(d.orgEmail);
      if (dOrgInfo) {
        var matchedKey = Object.keys(ORG_MAP).filter(function(k) { return ORG_MAP[k].name === dOrgInfo.name; })[0];
        if (matchedKey) {
          orgDogs[matchedKey].total++;
          if (d.status === 'waiting') orgDogs[matchedKey].waiting++;
          return;
        }
      }
      // 3순위: 어떤 맵에도 없음 (완전히 미등록된 기관 이메일)
      uncategorizedDogs.total++;
      if (d.status === 'waiting') uncategorizedDogs.waiting++;
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
      var a = airlineDisplay(v.airline) || '기타';
      airlineCnt[a] = (airlineCnt[a] || 0) + 1;
    });

    // 기관별 통계 렌더 — 합계가 "강아지 목록(전체 dogs.size)"과 항상 일치하도록
    // ORG_MAP 3개 기관 + 미분류(uncategorizedDogs)를 모두 더해서 보여준다.
    var orgHtml = '<div class="sec-hd" style="margin-top:20px;">' + (isKo?'기관별 강아지 현황':'Dogs by Organization') + '</div>';
    orgHtml += Object.keys(ORG_MAP).map(function(email) {
      var org = ORG_MAP[email];
      var stat = orgDogs[email] || { waiting:0, total:0 };
      return '<div class="card" style="margin-bottom:8px;display:flex;align-items:center;gap:12px;">' +
        '<div style="font-size:28px;">' + org.ico + '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-weight:800;">' + org.name + '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-top:4px;">' + (isKo? '대기 강아지 '+stat.waiting+'마리 · 총 등록 '+stat.total+'마리' : stat.waiting+' waiting · '+stat.total+' total') + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    if (uncategorizedDogs.total > 0) {
      orgHtml += '<div class="card" style="margin-bottom:8px;display:flex;align-items:center;gap:12px;background:#FFF8F0;">' +
        '<div style="font-size:28px;">❓</div>' +
        '<div style="flex:1;">' +
          '<div style="font-weight:800;">' + (isKo?'미분류 (등록되지 않은 기관 이메일)':'Uncategorized (unregistered org email)') + '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-top:4px;">' + (isKo? '대기 강아지 '+uncategorizedDogs.waiting+'마리 · 총 등록 '+uncategorizedDogs.total+'마리' : uncategorizedDogs.waiting+' waiting · '+uncategorizedDogs.total+' total') + '</div>' +
        '</div>' +
      '</div>';
    }

    // 월별 통계 렌더
    var months = Object.keys(monthlyDone).sort().reverse().slice(0,6);
    var monthHtml = '<div class="sec-hd" style="margin-top:20px;">' + (isKo?'월별 이동완료':'Monthly Completions') + '</div>';
    if (!months.length) {
      monthHtml += '<div class="empty-state" style="padding:20px 0;"><div class="msg">' + (isKo?'아직 완료 기록이 없습니다.':'No completed transports yet.') + '</div></div>';
    } else {
      var maxVal = Math.max.apply(null, months.map(function(m) { return monthlyDone[m]; }));
      monthHtml += months.map(function(m) {
        var cnt = monthlyDone[m];
        var pct = maxVal > 0 ? Math.round((cnt / maxVal) * 100) : 0;
        return '<div style="margin-bottom:10px;">' +
          '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">' +
            '<span style="font-weight:700;">' + m + '</span>' +
            '<span style="color:var(--gr);font-weight:800;">' + cnt + (isKo?'건':'') + '</span>' +
          '</div>' +
          '<div style="background:var(--bg);border-radius:6px;height:8px;">' +
            '<div style="background:var(--gr);border-radius:6px;height:8px;width:' + pct + '%;transition:width .4s;"></div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // 항공사별 통계 렌더
    var airlineHtml = '<div class="sec-hd" style="margin-top:20px;">' + (isKo?'항공사별 봉사 신청':'Registrations by Airline') + '</div>';
    airlineHtml += Object.keys(airlineCnt).map(function(a) {
      var cnt = airlineCnt[a];
      return '<div class="card" style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">' +
        '<div style="font-weight:700;">✈️ ' + a + '</div>' +
        '<span class="badge badge-or">' + cnt + (isKo?'건':'') + '</span>' +
      '</div>';
    }).join('');

    // 봉사자 목록
    var volListHtml = '<div class="sec-hd" style="margin-top:20px;">' + (isKo?'최근 봉사 신청 (최대 30건)':'Recent Volunteers (max 30)') + '</div>';
    volListHtml += vols.docs.slice(0,30).map(function(doc) {
      var v = doc.data();
      var stMap = { pending:'badge-gy', matched:'badge-or', done:'badge-gr' };
      var stTxt = isKo ? { pending:'대기중', matched:'연락완료', done:'이동완료' } : { pending:'Pending', matched:'Contacted', done:'Done' };
      var nameKo = v.nameKo || v.name || '';
      return '<div class="card" style="margin-bottom:8px;">' +
        '<div style="display:flex;justify-content:space-between;">' +
          '<b>' + (nameKo ? '👤 '+nameKo+' · ' : '') + '✈️ ' + airlineDisplay(v.airline) + ' · ' + (v.flightDate||'') + '</b>' +
          '<span class="badge ' + (stMap[v.status]||'badge-gy') + '">' + (stTxt[v.status]||v.status||'') + '</span>' +
        '</div>' +
        (v.nameEn || v.nationality || v.residencyStatus ?
          '<div style="font-size:11px;color:var(--t3);margin-top:2px;">' + [v.nameEn, v.nationality, v.residencyStatus].filter(Boolean).join(' · ') + '</div>' : '') +
        '<div style="font-size:12px;color:var(--t2);margin-top:4px;">' +
          (v.kakao?'💬 '+v.kakao:'') + (v.kakao&&v.phone?' · ':'') + (v.phone?'📞 '+v.phone:'') +
          '<br>' + (v.email||'') +
        '</div>' +
      '</div>';
    }).join('');

    // 강아지 목록
    var dogListHtml = '<div class="sec-hd" style="margin-top:20px;">' + (isKo?'강아지 목록 (최대 30건)':'Dog List (max 30)') + '</div>';
    dogListHtml += dogs.docs.slice(0,30).map(function(doc) {
      var d = doc.data();
      var org = getOrgInfo(d.orgEmail) || { name: d.orgEmail||'기관', ico:'🏥' };
      return '<div class="card" style="margin-bottom:8px;">' +
        '<div style="display:flex;justify-content:space-between;">' +
          '<b>🐶 ' + (d.name||'') + '</b>' +
          '<span class="badge badge-gy">' + (isKo ? (d.status==='waiting'?'대기중':d.status==='done'?'이동완료':d.status||'') : (d.status||'')) + '</span>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--t2);margin-top:4px;">' + org.ico + ' ' + org.name + (d.breed?' · '+d.breed:'') + (d.weight?' '+d.weight+'kg':'') + '</div>' +
      '</div>';
    }).join('');

    // 통계 HTML 먼저 구성 후 한번에 삽입
    var statsHtml = '<div class="admin-stat-row" id="admin-stats">' +
      '<div class="admin-stat-box"><div class="admin-stat-n">' + vols.size + '</div><div class="admin-stat-l">' + (isKo?'전체 봉사 신청':'Total Registrations') + '</div></div>' +
      '<div class="admin-stat-box"><div class="admin-stat-n" style="color:var(--gr);">' + done + '</div><div class="admin-stat-l">✅ ' + (isKo?'이동완료':'Done') + '</div></div>' +
      '<div class="admin-stat-box"><div class="admin-stat-n" style="color:var(--or);">' + matched + '</div><div class="admin-stat-l">📱 ' + (isKo?'연락완료':'Contacted') + '</div></div>' +
      '<div class="admin-stat-box"><div class="admin-stat-n">' + pending + '</div><div class="admin-stat-l">⏳ ' + (isKo?'대기중':'Pending') + '</div></div>' +
      '</div>';

    // id 기반으로 안전하게 삽입 (querySelector DOM 의존 제거)
    var adminBody = document.getElementById('admin-dash-body');
    if (adminBody) {
      adminBody.innerHTML = statsHtml + orgHtml + monthHtml + airlineHtml + volListHtml + dogListHtml;
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
var _exitPopupOpen = false;

function showAppExitPopup() {
  if (_exitPopupOpen) return;
  _exitPopupOpen = true;
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
  // 주의: 여기서 history.pushState를 호출하지 않는다.
  // showAppExitPopup()은 항상 popstate 핸들러 안에서만 호출되는데, 그 핸들러는
  // 진입 시 이미 history.pushState({guard:true})를 한 번 호출해 가드를 채워둔 상태다.
  // 만약 여기서 pushState를 또 호출하면, "뒤로가기 1번 = 히스토리 2칸 소비"가 되어
  // 종료 팝업이 떠 있는 상태에서 한 번 더 뒤로가기를 눌렀을 때 가드가 정상 동작하기 전에
  // 실제 히스토리가 먼저 바닥나면서 confirm 절차 없이 앱이 이탈/종료되는 버그가 발생한다.
  if (!_fromPopstate) {
    // 만약(이론상) 다른 경로에서 직접 호출되는 경우를 대비한 안전장치 — 정상 흐름에서는 항상
    // _fromPopstate가 true이므로 이 분기는 실행되지 않는다.
    history.pushState({ popup: 'exit' }, '', '');
  }
}
function closeExitPopup() {
  var el = document.getElementById('app-exit-popup');
  if (el) el.remove();
  _exitPopupOpen = false;
}
var _appExiting = false;

function appExit() {
  // TWA(Android 앱 셸)에서는 히스토리가 완전히 소진되면 액티비티가 자동으로
  // 종료(finish)된다. 기존 코드는 스플래시로 "이동"만 시켜서 실제 종료가 안 됐다.
  // _appExiting 플래그로 popstate 핸들러의 가드(재-pushState)를 건너뛰게 만들어,
  // 진짜 뒤로가기가 통과되어 앱이 종료되도록 한다.
  closeExitPopup();
  _appExiting = true;
  history.go(-(window.history.length));
}

// ══════════════════════════════════════
// 백버튼 (갤럭시 안드로이드) — 근본 수정
//
// 문제였던 부분: 기존 코드는 popstate 핸들러 안에서 매번 pushState를 호출했는데,
// 종료팝업(showAppExitPopup)도 "또" pushState를 호출하다 보니 히스토리 스택에
// 우리가 의도하지 않은 엔트리가 섞여 쌓였다. 그 상태에서 "종료" 또는 한 번 더
// 뒤로가기를 누르면 실제 브라우저 히스토리가 다 소진되어 버려서 confirm 절차를
// 거치지 않고 곧바로 앱이 종료(이탈)되는 현상이 발생했다.
//
// 해결: 화면이 처음 로드될 때 더미 히스토리를 "딱 한 번"만 깔아두고,
// 이후 모든 popstate에서는 즉시 그 더미 상태를 다시 채워(pushState) 넣어서
// 브라우저의 실제 "한 칸 뒤로(앱 이탈)"가 절대 일어나지 않게 만든다.
// 화면 전환(scGo, setTab)이 추가로 pushState를 부르더라도, 더미 상태가 항상
// 맨 위에 다시 덮어씌워지므로 동일한 원칙이 유지된다.
// ══════════════════════════════════════
window.addEventListener('popstate', function() {
  // 종료 확정 상태면 가드를 다시 채우지 않고 그대로 통과시켜 앱을 종료시킨다.
  if (_appExiting) return;

  // 가장 먼저 히스토리를 다시 채워서, 어떤 분기를 타든 "진짜 뒤로가기(이탈)"를 차단.
  // 이 한 번의 pushState가 이번 뒤로가기에 대한 가드의 전부가 되어야 하므로,
  // 아래에서 scGo/setTab을 호출할 때는 _fromPopstate 플래그로 추가 pushState를 막는다.
  history.pushState({ guard: true }, '', '');
  _fromPopstate = true;

  try {
    // ① 종료 확인 팝업이 떠 있으면: 팝업만 닫는다 (절대 종료하지 않음)
    if (_exitPopupOpen) { closeExitPopup(); return; }

    // ② 개인정보 모달
    var privacyModal = document.getElementById('privacy-modal');
    if (privacyModal && privacyModal.style.display !== 'none') { closePrivacy(); return; }

    // ③ 강아지 등록 모달
    var dogModal = document.getElementById('dog-modal');
    if (dogModal && dogModal.style.display !== 'none') { closeDogModal(); return; }

    // ④ 항공편 수정 모달
    var flightModal = document.getElementById('flight-modal');
    if (flightModal && flightModal.style.display !== 'none') { closeFlightModal(); return; }

    // ⑤ 기관 대시보드 — 봉사자 쪽과 동일하게, 다른 탭이면 먼저 "강아지" 탭으로
    // 단계적으로 이동시키고, 강아지 탭에서 한 번 더 누르면 로그아웃(스플래시)한다.
    if (_curScreen === 's-orgdash') {
      if (_curDashTab !== 'dogs') { setDashTab('dogs'); return; }
      scGo('s-splash'); return;
    }

    // ⑥ 로그인/온보딩/어드민 → 스플래시
    if (['s-orglogin','s-vollogin','s-adminlogin','s-admindash','s-ob'].indexOf(_curScreen) > -1) {
      scGo('s-splash'); return;
    }

    // ⑦ 메인 — 홈이 아닌 탭 → 홈
    if (_curScreen === 's-main' && _curTab !== 'home') { setTab('home'); return; }

    // ⑧ 메인 홈 또는 스플래시 화면 → 종료 확인 팝업 (여기서 절대 즉시 종료되지 않는다)
    showAppExitPopup();
  } finally {
    _fromPopstate = false;
  }
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

// ══════════════════════════════════════
// 리다이렉트 로그인 결과 처리 (signInWithRedirect 필수 짝)
// ══════════════════════════════════════
auth.getRedirectResult().catch(function(e) {
  console.error('Redirect result error:', e.code, e.message);
  var errEl = document.getElementById('vol-err');
  if (errEl && e.code) {
    var isKo = curLang === 'ko';
    var msg = isKo ? '로그인 중 오류가 발생했습니다. (오류: ' + e.code + ')' : 'Login error occurred. (' + e.code + ')';
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }
});
// 초기화
history.pushState({}, '', '');
applyLang();
