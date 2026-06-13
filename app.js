// ── PAWST CLASS · app.js · v5.1 (20260523) ──

var pvOk = false, cStar = 5, obI = 0;
var curLang = 'ko'; // 'ko' | 'en'

// ── LANGUAGE TOGGLE ──
function togLang() {
  curLang = curLang === 'ko' ? 'en' : 'ko';
  applyLang();
}

function applyLang() {
  var isKo = curLang === 'ko';

  // lang toggle button labels
  ['lang-btn','lang-btn2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = isKo ? 'ENG' : '한국어';
  });

  // swap all data-ko / data-en text nodes
  document.querySelectorAll('[data-ko]').forEach(function(el) {
    var txt = isKo ? el.getAttribute('data-ko') : el.getAttribute('data-en');
    if (!txt) return;
    // buttons and spans: set innerHTML (some have emojis)
    if (el.tagName === 'BUTTON' || el.tagName === 'SPAN' || el.tagName === 'DIV' || el.tagName === 'P' || el.tagName === 'A') {
      el.innerHTML = txt;
    } else {
      el.textContent = txt;
    }
  });

  // textarea placeholder
  document.querySelectorAll('[data-ko-placeholder]').forEach(function(el) {
    el.placeholder = isKo ? el.getAttribute('data-ko-placeholder') : el.getAttribute('data-en-placeholder');
  });

  // privacy modal text
  var prvEl = document.getElementById('prv-text');
  if (prvEl) {
    prvEl.textContent = isKo ? PRV_KO : PRV_EN;
  }

  // re-render reviews with current lang
  rRevs();
}

var PRV_KO = `■ 수집 항목
· 필수: 이름, 연락처, 카카오ID, 항공편 정보
· 선택: 봉사 경험 횟수

■ 수집·이용 목적
· 이동봉사 매칭 및 단체 연결
· 긴급 연락 및 인증서 발급

■ 보유 및 이용 기간
· 봉사 완료 후 1년간 보관

■ 제3자 제공
· 매칭된 협력 구조단체에 한해 공유

■ 정보주체 권리
· 열람·정정·삭제·처리정지 요청 가능
· 문의: pawstclass.1@gmail.com`;

var PRV_EN = `■ Items Collected
· Required: Name, phone, KakaoID, flight info
· Optional: Prior volunteer experience count

■ Purpose
· Flight volunteer matching & org connection
· Emergency contact & certificate issuance

■ Retention Period
· 1 year after volunteer service completion

■ Third-Party Sharing
· Shared only with matched rescue organization

■ Your Rights
· Request access, correction, deletion, or suspension
· Contact: pawstclass.1@gmail.com`;

// ── DATA ──
var fls = [
  {
    org: 'K-Pups for Love', ico: '🐾', bg: '#FFF0EB', dt_ko: '3월 8일', dt_en: 'Mar 8',
    dogs_ko: ['🐶 뽀삐 · 말티즈 · 2.1kg','🐕 코코 · 치와와 · 1.5kg'],
    dogs_en: ['🐶 Bomi · Maltese · 2.1kg','🐕 Coco · Chihuahua · 1.5kg'],
    urg: true
  },
  {
    org: 'Adopt Me Korea', ico: '🐕', bg: '#EFF6FF', dt_ko: '3월 15일', dt_en: 'Mar 15',
    dogs_ko: ['🐩 루시 · 푸들 · 3.2kg'],
    dogs_en: ['🐩 Lucy · Poodle · 3.2kg'],
    urg: false
  }
];

var revs = [
  { n:'Jimin K.',  d:'2026.02.10', r:5, txt_ko:'뽀삐와 함께한 애틀랜타행 비행이 정말 특별했어요!', txt_en:'Such a meaningful experience. Bomi was so well-behaved the entire flight!', route:'ICN→ATL', ph:null },
  { n:'Sarah L.',  d:'2026.01.28', r:5, txt_ko:'단체에서 모든 걸 준비해줬어요. 정말 보람있었습니다.', txt_en:'The org prepared everything. I just had to show up at the airport!', route:'ICN→ATL', ph:null },
  { n:'이하은',    d:'2026.01.15', r:5, txt_ko:'루시가 새 가족을 만나 꼬리 흔드는 모습이 눈에 선해요 🥹', txt_en:'The moment Lucy met her new family and wagged her tail — unforgettable 🥹', route:'ICN→ATL', ph:null }
];

var obS = [
  {
    acc:'#FF8C00', bg:'#FFF8F2',
    tag_ko:'왜 필요한가요?', tag_en:'Why is this needed?',
    vis:'<div style="font-size:52px;margin-bottom:8px;">😢</div><div style="display:flex;justify-content:center;gap:5px;margin-bottom:14px;flex-wrap:wrap;">' +
      Array(9).fill('<div style="width:26px;height:26px;border-radius:50%;background:#FFF0EB;display:flex;align-items:center;justify-content:center;font-size:14px;">🐶</div>').join('') +
      '</div>',
    title_ko:'매년 수만 마리 구조견이\n입양을 기다려요',
    title_en:'Thousands of rescue dogs\nare waiting in Korea',
    desc_ko:'한국 보호소는 포화 상태입니다. 미국엔 한국 구조견을 원하는 가정이 많지만 이동 방법이 없어요.',
    desc_en:'Korean shelters are overcrowded. Families in the U.S. want to adopt, but there\'s no easy way to get the dogs there.'
  },
  {
    acc:'#2563EB', bg:'#F0F4FF',
    tag_ko:'해결책은?', tag_en:'The solution?',
    vis:'<div style="display:flex;align-items:center;justify-content:center;gap:12px;font-size:42px;margin-bottom:14px;">🇰🇷 ✈️ 🇺🇸</div>',
    title_ko:'비행기 한 좌석이\n생명을 구합니다',
    title_en:'One airplane seat\nsaves a life',
    desc_ko:'미국행 비행기에 탑승하시나요? 출입국 각 30분만 내주시면 구조견에게 새 삶을 선물할 수 있어요.',
    desc_en:'Flying to the U.S.? Just 30 minutes at each airport gives a rescue dog a brand new life.'
  },
  {
    acc:'#059669', bg:'#F0FDF6',
    tag_ko:'봉사 방법', tag_en:'How it works',
    steps_ko:['📍 공항 집합 (출발 2시간 전)','✈️ 기내 동반 탑승','🏠 도착 공항에서 가족에게 전달'],
    steps_en:['📍 Meet at airport (2 hours before departure)','✈️ Board together as travel companions','🏠 Hand off to the family at arrival airport'],
    title_ko:'딱 세 단계예요',
    title_en:'Just three steps',
    desc_ko:'모든 서류·케이지·비용은 협력 단체가 준비합니다. 함께 타주시기만 하면 됩니다!',
    desc_en:'All documents, crates, and costs are handled by our partner organizations. You just need to show up!'
  },
  {
    acc:'#7C3AED', bg:'#FAF5FF',
    tag_ko:'협력 단체', tag_en:'Partner orgs',
    vis:'<div style="display:flex;justify-content:center;gap:12px;margin-bottom:14px;"><div style="text-align:center;"><div style="width:50px;height:50px;border-radius:13px;background:#FFF0EB;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 4px;">🐾</div><div style="font-size:9px;font-weight:700;color:#9CA3AF;">K-Pups</div></div><div style="text-align:center;"><div style="width:50px;height:50px;border-radius:13px;background:#EFF6FF;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 4px;">🐕</div><div style="font-size:9px;font-weight:700;color:#9CA3AF;">Adopt Me</div></div><div style="text-align:center;"><div style="width:50px;height:50px;border-radius:13px;background:#F5F3FF;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 4px;">🏠</div><div style="font-size:9px;font-weight:700;color:#9CA3AF;">감자네</div></div></div>',
    title_ko:'믿을 수 있는 단체가\n함께합니다',
    title_en:'Trusted organizations\nhave your back',
    desc_ko:'K-Pups for Love, Adopt Me Korea, 감자네 하우스. 모두 검증된 공식 협력 단체입니다.',
    desc_en:'K-Pups for Love, Adopt Me Korea, and 감자네 하우스 — all verified partner organizations.'
  },
  {
    acc:'#FF8C00', bg:'#FFF8F2',
    tag_ko:'지금 시작해요', tag_en:'Let\'s go!',
    vis:'<div style="font-size:60px;margin-bottom:10px;">🐾</div>',
    title_ko:'당신의 여행이\n강아지의 새 시작이 됩니다',
    title_en:'Your journey becomes\ntheir new beginning',
    desc_ko:'PAWST CLASS와 함께 한국 구조견에게 새 하늘길을 열어주세요.',
    desc_en:'Join PAWST CLASS and help open a new sky path for Korean rescue dogs.'
  }
];

// ── SCREEN SWITCHING ──
function goOb()    { obI = 0; scGo('s-ob'); rOb(); }
function goHome()  { scGo('s-main'); setTab('home'); }
function goAdmin() { scGo('s-main'); setAdm(); }
function bkOb()    { scGo('s-splash'); }

// ── ONBOARDING ──
function rOb() {
  var d = obS[obI];
  var isKo = curLang === 'ko';
  document.getElementById('s-ob').style.background = d.bg;

  var dots = '';
  for (var i = 0; i < obS.length; i++) {
    dots += '<div class="ob-dot' + (i === obI ? ' on' : '') + '" onclick="obTo(' + i + ')" style="' + (i === obI ? 'background:' + d.acc + ';width:22px;' : '') + '"></div>';
  }
  document.getElementById('ob-dots').innerHTML = dots;

  var vis = d.vis || '';
  var steps = isKo ? d.steps_ko : d.steps_en;
  if (steps) {
    vis = '<div style="width:100%;margin-bottom:12px;">';
    steps.forEach(function(s) {
      vis += '<div style="background:rgba(255,255,255,.85);border-radius:12px;padding:12px 14px;margin-bottom:8px;font-size:13px;font-weight:600;color:#1C1C1E;">' + s + '</div>';
    });
    vis += '</div>';
  }

  var tag   = isKo ? d.tag_ko   : d.tag_en;
  var title = isKo ? d.title_ko : d.title_en;
  var desc  = isKo ? d.desc_ko  : d.desc_en;

  document.getElementById('ob-body').innerHTML =
    '<div style="display:flex;flex-direction:column;align-items:center;padding:20px 22px 8px;text-align:center;flex:1;">' +
    '<span style="background:' + d.acc + ';color:#fff;font-size:11px;font-weight:700;padding:4px 13px;border-radius:20px;margin-bottom:18px;display:inline-block;">' + tag + '</span>' +
    vis +
    '<div style="font-size:20px;font-weight:800;line-height:1.38;white-space:pre-line;color:#1C1C1E;margin-bottom:10px;">' + title + '</div>' +
    '<p style="font-size:13px;color:#6B7280;line-height:1.8;margin:0;">' + desc + '</p>' +
    '</div>';

  var isLast = obI === obS.length - 1;
  var startTxt = isKo ? '시작하기 →' : 'Get Started →';
  var nextTxt  = isKo ? '다음 →' : 'Next →';
  var backTxt  = isKo ? '이전' : 'Back';
  var skipTxt  = isKo ? '건너뛰기' : 'Skip';

  if (isLast) {
    document.getElementById('ob-nav').innerHTML =
      '<button onclick="goHome()" style="width:100%;background:' + d.acc + ';color:#fff;border:none;padding:15px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;">' + startTxt + '</button>';
  } else {
    var bk = obI > 0
      ? '<button onclick="obTo(' + (obI-1) + ')" style="flex:1;background:rgba(255,255,255,.85);border:1.5px solid #E8E0D8;padding:13px;border-radius:14px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;color:#1C1C1E;">' + backTxt + '</button>'
      : '';
    document.getElementById('ob-nav').innerHTML =
      '<div style="display:flex;gap:10px;">' + bk +
      '<button onclick="obTo(' + (obI+1) + ')" style="flex:' + (obI===0?1:2) + ';background:' + d.acc + ';color:#fff;border:none;padding:13px;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">' + nextTxt + '</button>' +
      '</div>' +
      '<button onclick="goHome()" style="width:100%;background:transparent;border:none;padding:10px;color:#9CA3AF;font-size:12px;cursor:pointer;font-family:inherit;margin-top:4px;">' + skipTxt + '</button>';
  }
}
function obTo(i) { obI = i; rOb(); }

// ── TAB SWITCHING ──
function setTab(t) {
  ['home','register','orgs','reviews','foster','calendar','chat'].forEach(function(id) {
    var el = document.getElementById('t-' + id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('t-admin').style.display = 'none';
  document.getElementById('s-chatroom').style.display = 'none';

  var el = document.getElementById('t-' + t);
  if (el) el.style.display = 'block';

  document.querySelectorAll('.ni').forEach(function(b) {
    b.classList.remove('on');
    // onclick 속성에 현재 탭명이 포함되면 active
    var oc = b.getAttribute('onclick') || '';
    if (oc.indexOf("'" + t + "'") > -1 || oc.indexOf('"' + t + '"') > -1) {
      b.classList.add('on');
    }
  });

  if (t === 'reviews') rRevs();
  scGo('s-main');
}

// ── ADMIN ──
function setAdm() {
  ['home','register','orgs','reviews','foster'].forEach(function(id) {
    var el = document.getElementById('t-' + id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('t-admin').style.display = 'flex';
  document.querySelectorAll('.ni').forEach(function(b) { b.classList.remove('on'); });
  rAdm();
  scGo('s-main');
}

function rAdm() {
  var isKo = curLang === 'ko';
  var dogs = [
    { n_ko:'뽀삐', n_en:'Bomi', b_ko:'말티즈', b_en:'Maltese', w:'2.1', st:0, urg:true },
    { n_ko:'코코', n_en:'Coco', b_ko:'치와와', b_en:'Chihuahua', w:'1.5', st:1, urg:false, vol:'Jian C.' },
    { n_ko:'루시', n_en:'Lucy', b_ko:'푸들', b_en:'Poodle', w:'3.2', st:0, urg:false },
    { n_ko:'맥스', n_en:'Max',  b_ko:'비글', b_en:'Beagle', w:'4.0', st:0, urg:true }
  ];
  var sl_ko = ['대기','매칭','완료'];
  var sl_en = ['Waiting','Matched','Done'];
  var sb = ['#FFF5E6','#EFF6FF','#E8F7F0'];
  var sc2 = ['#FF8C00','#3B82F6','#2D9E6B'];

  document.getElementById('adm-dogs').innerHTML = dogs.map(function(d) {
    var name = isKo ? d.n_ko : d.n_en;
    var breed = isKo ? d.b_ko : d.b_en;
    var status = isKo ? sl_ko[d.st] : sl_en[d.st];
    return '<div style="background:#fff;border-radius:12px;padding:11px 13px;margin-bottom:8px;display:flex;align-items:center;gap:10px;border:1px solid #E8E0D8;">' +
      '<div style="width:38px;height:38px;border-radius:10px;background:#FFF0EB;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🐶</div>' +
      '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">' + (d.urg?'⚡ ':'') + name + ' <span style="font-weight:400;color:#9CA3AF;font-size:12px;">· ' + breed + ' · ' + d.w + 'kg</span></div>' +
      '<div style="font-size:11px;color:#3B82F6;margin-top:1px;">→ ATL</div>' +
      (d.vol ? '<div style="font-size:11px;color:#2D9E6B;">👤 ' + d.vol + '</div>' : '') +
      '</div><span style="font-size:11px;padding:3px 9px;border-radius:9px;font-weight:700;background:' + sb[d.st] + ';color:' + sc2[d.st] + ';">' + status + '</span></div>';
  }).join('');

  var matches = [
    ['Jian Choi', 'ICN→ATL · Mar 8',  true],
    ['Sarah L.',  'ICN→ATL · Mar 15', false],
    ['Jimin K.',  'ICN→ATL · Mar 22', true]
  ];
  document.getElementById('adm-match').innerHTML = matches.map(function(v) {
    var st = isKo ? (v[2]?'매칭완료':'대기중') : (v[2]?'Matched':'Pending');
    return '<div style="background:#fff;border-radius:12px;padding:11px 13px;margin-bottom:8px;display:flex;align-items:center;gap:10px;border:1px solid #E8E0D8;">' +
      '<div style="width:34px;height:34px;border-radius:50%;background:#FFF5E6;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">👤</div>' +
      '<div style="flex:1;"><div style="font-weight:600;font-size:13px;">' + v[0] + '</div><div style="font-size:11px;color:#9CA3AF;">' + v[1] + '</div></div>' +
      '<span style="font-size:11px;padding:3px 9px;border-radius:9px;font-weight:700;background:' + (v[2]?'#E8F7F0':'#FFF5E6') + ';color:' + (v[2]?'#2D9E6B':'#FF8C00') + ';">' + st + '</span></div>';
  }).join('');
}

// ── FLIGHT MATCH MODAL ──
function opFM(i) {
  var f = fls[i];
  _curFM = f; // 긴급매칭 신청 시 참조용
  var isKo = curLang === 'ko';
  var dt   = isKo ? f.dt_ko : f.dt_en;
  var dogs = isKo ? f.dogs_ko : f.dogs_en;
  var urgTxt    = isKo ? '⚡ 긴급' : '⚡ Urgent';
  var applyTxt  = isKo ? '이 봉사 신청하기 🐾' : 'Apply for This Flight 🐾';
  var closeTxt  = isKo ? '닫기' : 'Close';
  var dogLabel  = isKo ? '🐾 동반 강아지' : '🐾 Dogs on this flight';
  var infoLines = isKo
    ? '✅ 케이지·서류 단체 준비<br>✅ 이동비 전액 지원<br>✅ 공항 인계 담당자 배치<br>✅ 24시간 긴급 연락망'
    : '✅ Crate & documents prepared by org<br>✅ All travel costs covered<br>✅ Airport handoff coordinator present<br>✅ 24-hour emergency contact line';

  document.getElementById('fm-body').innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">' +
    '<div style="width:44px;height:44px;border-radius:12px;background:' + f.bg + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + f.ico + '</div>' +
    '<div><div style="font-weight:800;font-size:15px;">' + f.org + '</div><div style="font-size:12px;color:#9CA3AF;">ICN → ATL · ' + dt + '</div></div>' +
    (f.urg ? '<span style="margin-left:auto;background:#FFF0EB;color:#E05A2B;font-size:10px;font-weight:700;padding:3px 8px;border-radius:9px;">' + urgTxt + '</span>' : '') +
    '</div>' +
    '<div style="background:#FFF5E6;border-radius:12px;padding:12px;margin-bottom:12px;">' +
    '<div style="font-weight:700;font-size:12px;color:#FF8C00;margin-bottom:7px;">' + dogLabel + '</div>' +
    dogs.map(function(d) { return '<div style="font-size:13px;line-height:1.9;">' + d + '</div>'; }).join('') +
    '</div>' +
    '<div style="background:#F7F3EF;border-radius:12px;padding:12px;margin-bottom:14px;font-size:13px;line-height:1.9;">' + infoLines + '</div>' +
    '<button class="btn-pr" onclick="clMo(\'fm\');showS();">' + applyTxt + '</button>' +
    '<button onclick="clMo(\'fm\')" style="width:100%;background:none;border:none;padding:10px;color:#9CA3AF;font-size:13px;cursor:pointer;font-family:inherit;margin-top:6px;">' + closeTxt + '</button>';

  document.getElementById('fm').classList.add('on');
}

function showS() {
  // 로그인 상태면 Firestore에 긴급매칭 신청 저장
  var user = auth.currentUser;
  if (!user) {
    // 비로그인 → 로그인 유도
    var isKo = curLang === 'ko';
    if (confirm(isKo ? '로그인 후 신청할 수 있습니다. 로그인 화면으로 이동할까요?' :
                       'Please login to apply. Go to login?')) {
      scGo('s-vollogin');
    }
    return;
  }
  if (user && !ORG_MAP[user.email]) {
    // 현재 열린 긴급매칭 카드 정보 (opFM에서 설정한 _curFM)
    var fm = typeof _curFM !== 'undefined' ? _curFM : null;
    db.collection('urgentRequests').add({
      volunteerUid:   user.uid,
      volunteerEmail: user.email,
      orgName:        fm ? fm.org : '기관',
      flightDate:     fm ? (fm.dt_ko || '') : '',
      createdAt:      firebase.firestore.FieldValue.serverTimestamp(),
      status:         'pending'
    }).catch(function() {});
  }
  document.getElementById('sm').classList.add('on');
}
function clMo(id) { document.getElementById(id).classList.remove('on'); }
function opPrv() { document.getElementById('pm').classList.add('on'); }

// ── PRIVACY TOGGLE ──
function togPv() {
  pvOk = !pvOk;
  document.getElementById('pvx').classList.toggle('on', pvOk);
  document.getElementById('pvt').style.display = pvOk ? 'inline' : 'none';
  document.getElementById('pvl').style.color = pvOk ? '#2D9E6B' : '#6B7280';
  var b = document.getElementById('rbtn');
  b.style.opacity = pvOk ? '1' : '.4';
  b.style.cursor  = pvOk ? 'pointer' : 'not-allowed';
  document.getElementById('pvcard').style.border = '1px solid ' + (pvOk ? '#2D9E6B' : '#E8E0D8');
}
function pvAgree() { if (!pvOk) togPv(); clMo('pm'); }
function doReg() {
  var isKo = curLang === 'ko';
  if (!pvOk) {
    alert(isKo ? '개인정보 수집·이용에 동의해 주세요.' : 'Please agree to the privacy policy.');
    return;
  }

  var name     = document.getElementById('vol-name')    ? document.getElementById('vol-name').value.trim()    : '';
  var resno    = document.getElementById('vol-resno')   ? document.getElementById('vol-resno').value.trim()   : '';
  var phone    = document.getElementById('vol-phone')   ? document.getElementById('vol-phone').value.trim()   : '';
  var email    = document.getElementById('vol-email')   ? document.getElementById('vol-email').value.trim()   : '';
  var address  = document.getElementById('vol-address') ? document.getElementById('vol-address').value.trim() : '';
  var kakao    = document.getElementById('vol-kakao')   ? document.getElementById('vol-kakao').value.trim()   : '';
  var nation   = document.getElementById('vol-nation')  ? document.getElementById('vol-nation').value.trim()  : '';
  var dateEl   = document.querySelector('#t-register input[type="date"]');
  var flightNo = document.getElementById('fno') ? document.getElementById('fno').value.trim().toUpperCase().replace(/\s+/g,' ') : '';
  var airline  = '';
  document.querySelectorAll('#airline-chips .chip.on').forEach(function(c) { airline = c.textContent.trim(); });

  // ── 필수 검증 ──
  if (!name) {
    alert(isKo ? '이름(영문)을 입력해 주세요.' : 'Please enter your full name.');
    document.getElementById('vol-name').focus(); return;
  }
  if (!phone) {
    alert(isKo ? '연락처를 입력해 주세요.' : 'Please enter your phone number.');
    document.getElementById('vol-phone').focus(); return;
  }
  if (!dateEl || !dateEl.value) {
    alert(isKo ? '출발 날짜를 선택해 주세요.' : 'Please select your flight date.');
    if (dateEl) dateEl.focus(); return;
  }
  if (!flightNo) {
    alert(isKo ? '항공편 번호를 입력해 주세요. (예: KE 035)' : 'Please enter your flight number (e.g. KE 035).');
    document.getElementById('fno').focus(); return;
  }
  // 날짜 미래 검증
  var today = new Date(); today.setHours(0,0,0,0);
  var fDate = new Date(dateEl.value);
  if (fDate < today) {
    alert(isKo ? '출발 날짜는 오늘 이후여야 합니다.' : 'Flight date must be in the future.');
    return;
  }

  var btn = document.getElementById('rbtn');
  btn.textContent = isKo ? '등록 중...' : 'Submitting...';
  btn.style.opacity = '.6';

  db.collection('volunteers').add({
    name:       name,
    resno:      resno,
    phone:      phone,
    email:      email,
    address:    address,
    kakao:      kakao,
    nation:     nation,
    flightDate: dateEl.value,
    flightNo:   flightNo,
    airline:    airline,
    dest:       'ATL',
    status:     'booked',
    matchedDog: null,
    createdAt:  firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function() {
    btn.textContent = isKo ? '등록 완료하기' : 'Complete Registration';
    btn.style.opacity = '1';
    // ── 폼 초기화 ──
    ['vol-name','vol-resno','vol-phone','vol-email','vol-address','vol-kakao','vol-nation','fno'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (dateEl) dateEl.value = '';
    pvOk = false;
    document.getElementById('pvx').classList.remove('on');
    document.getElementById('pvt').style.display = 'none';
    document.getElementById('pvl').style.color = '#6B7280';
    btn.style.opacity = '.4';
    btn.style.cursor = 'not-allowed';
    showS();
    setTimeout(function() { setTab('home'); }, 1800);
  })
  .catch(function(e) {
    btn.textContent = isKo ? '등록 완료하기' : 'Complete Registration';
    btn.style.opacity = '1';
    alert('오류가 발생했습니다: ' + e.message);
  });
}

// ── AIRLINE CHIPS ──
function togChip(el) {
  document.querySelectorAll('#airline-chips .chip').forEach(function(c) { c.classList.remove('on'); });
  el.classList.add('on');
  var code = el.textContent.trim().split(' ').pop();
  var fn = document.getElementById('fno');
  if (fn && !fn.value) fn.placeholder = code + ' 035';
}

// ── REVIEWS ──
function sStarOld(n) {
  cStar = n;
  document.querySelectorAll('.star').forEach(function(s, i) {
    s.classList.toggle('on', i < n);
  });
}
// ══════════════════════════════
// 후기 기능 v2.6 — Firestore 연동
// ══════════════════════════════

var _revStars = 5; // 현재 선택 별점

// ── 별점 선택 ──
function sStar(n) {
  _revStars = n;
  for (var i = 1; i <= 5; i++) {
    var el = document.getElementById('rstar-' + n + '-' + i);
    if (el) el.classList.toggle('on', i <= n);
  }
}

// ── 후기 탭 진입 시 호출 ──
function rRevs() {
  loadRevWriteSection();
  loadRevList();
}

// ── 작성 가능한 매칭 목록 표시 ──
function loadRevWriteSection() {
  var sec = document.getElementById('rev-write-section');
  if (!sec) return;
  var user = auth.currentUser;
  var isKo = curLang === 'ko';

  if (!user) {
    sec.innerHTML = '<div style="background:#FFF5E6;border-radius:12px;padding:14px;font-size:13px;color:var(--t2);text-align:center;margin-bottom:8px;">' +
      (isKo ? '로그인 후 후기를 작성할 수 있습니다.' : 'Please login to write a review.') + '</div>';
    return;
  }

  var isOrg = !!ORG_MAP[user.email];

  // 봉사자: email+status 쿼리 (인덱스 없으면 fallback)
  // 기관: status==done 전체 조회 후 필터
  var query = isOrg
    ? db.collection('volunteers').where('status', '==', 'done').orderBy('flightDate', 'desc')
    : db.collection('volunteers').where('email', '==', user.email).where('status', '==', 'done');

  query.get()
    .then(function(snap) {
      var mine = isOrg
        ? snap.docs.filter(function(d) { return d.data().orgEmail === user.email; })
        : snap.docs;
      renderRevWriteCards(mine, user, isOrg, sec, isKo);
    })
    .catch(function() {
      // 복합 인덱스 없는 경우 fallback — email만으로 조회 후 클라이언트 필터
      db.collection('volunteers').where('email', '==', user.email).get()
        .then(function(s2) {
          var done2 = s2.docs.filter(function(d) { return d.data().status === 'done'; });
          renderRevWriteCards(done2, user, isOrg, sec, isKo);
        })
        .catch(function() { sec.innerHTML = ''; });
    });
}


function renderRevWriteCards(mine, user, isOrg, sec, isKo) {
    if (!mine.length) {
      sec.innerHTML = '<div style="background:#F3F4F6;border-radius:12px;padding:14px;font-size:13px;color:var(--t2);text-align:center;margin-bottom:8px;">' +
        (isKo ? '이동완료된 매칭이 없어요.' : 'No completed transports yet.') + '</div>';
      return;
    }
    // 이미 후기 작성한 matchId 목록 조회
    db.collection('reviews')
      .where('authorUid', '==', user.uid)
      .get()
      .then(function(revSnap) {
        var writtenIds = {};
        revSnap.docs.forEach(function(d) { writtenIds[d.data().matchId] = true; });

        var cards = mine.map(function(doc) {
          var v = doc.data(); var vid = doc.id;
          var already = writtenIds[vid];
          var orgInfo  = ORG_MAP[v.orgEmail] || { name: v.org||'기관', ico:'🏥' };
          var partner  = isOrg ? (v.name||'봉사자') : orgInfo.name;
          var partIco  = isOrg ? '👤' : orgInfo.ico;

          return '<div class="card" style="margin-bottom:10px;">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
            '<div style="width:38px;height:38px;border-radius:50%;background:#FFF5E6;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + partIco + '</div>' +
            '<div style="flex:1;">' +
            '<div style="font-weight:700;font-size:13px;">' + partner + '</div>' +
            '<div style="font-size:11px;color:var(--t2);">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
            '</div>' +
            '<span style="font-size:10px;padding:3px 8px;border-radius:9px;background:#E8F7F0;color:#2D9E6B;font-weight:700;">' + (isKo?'이동완료':'Completed') + '</span>' +
            '</div>' +
            (already
              ? '<div style="text-align:center;padding:8px;background:#F3F4F6;border-radius:10px;font-size:12px;color:var(--t2);">✅ ' + (isKo?'후기를 이미 작성했어요':'Review already submitted') + '</div>'
              : '<button onclick="openRevModal(\'' + vid + '\',\'' + partner.replace(/'/g,"\\'") + '\')" class="btn-pr" style="width:100%;padding:9px;font-size:13px;">✏️ ' + (isKo?'후기 작성하기':'Write a Review') + '</button>'
            ) +
            '</div>';
        });

        sec.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--t2);margin-bottom:8px;">✍️ ' +
          (isKo ? '후기 작성 가능한 이동' : 'Write a Review') + '</div>' +
          cards.join('');
      })
      .catch(function() { sec.innerHTML = ''; });
}

// ── 후기 작성 모달 열기 ──
function openRevModal(matchId, partnerName) {
  var isKo = curLang === 'ko';
  var existing = document.getElementById('rev-modal');
  if (existing) existing.remove();

  _revStars = 5;

  var modal = document.createElement('div');
  modal.id = 'rev-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;';

  // 별점 HTML
  var starHtml = '';
  for (var i = 1; i <= 5; i++) {
    starHtml += '<button id="rstar-' + matchId + '-' + i + '" onclick="selectRevStar(' + i + ',\'' + matchId + '\')" ' +
      'style="background:none;border:none;font-size:28px;cursor:pointer;color:' + (i <= 5 ? '#F59E0B' : '#E5E7EB') + ';padding:2px;">★</button>';
  }

  modal.innerHTML =
    '<div style="background:var(--wh);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:22px;max-height:80vh;overflow-y:auto;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
    '<div style="font-size:16px;font-weight:800;">✏️ ' + (isKo ? '후기 작성' : 'Write a Review') + '</div>' +
    '<button onclick="document.getElementById(\'rev-modal\').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--t2);">×</button>' +
    '</div>' +

    '<div style="text-align:center;margin-bottom:14px;">' +
    '<div style="font-size:13px;color:var(--t2);margin-bottom:8px;">' + (isKo ? '상대방' : 'Partner') + ': <b>' + partnerName + '</b></div>' +
    '<div id="rev-stars-' + matchId + '">' + starHtml + '</div>' +
    '<div id="rev-star-label" style="font-size:12px;color:#F59E0B;font-weight:700;margin-top:4px;">★★★★★ ' + (isKo?'최고예요!':'Excellent!') + '</div>' +
    '</div>' +

    '<textarea id="rev-textarea" class="fi" style="height:100px;resize:none;display:block;margin-bottom:14px;" ' +
    'placeholder="' + (isKo ? '이동봉사 경험을 공유해 주세요... (10자 이상)' : 'Share your transport experience... (10+ chars)') + '"></textarea>' +

    '<div id="rev-modal-err" style="display:none;color:var(--re);font-size:12px;margin-bottom:10px;"></div>' +
    '<button onclick="submitRevModal(\'' + matchId + '\')" class="btn-pr">' + (isKo ? '후기 등록' : 'Submit Review') + '</button>' +
    '<button onclick="document.getElementById(\'rev-modal\').remove()" class="btn-sec" style="margin-top:8px;">' + (isKo?'취소':'Cancel') + '</button>' +
    '</div>';

  document.body.appendChild(modal);
}

// ── 별점 선택 (모달용) ──
function selectRevStar(n, matchId) {
  _revStars = n;
  var labels = { 1:'⭐ 별로예요', 2:'⭐⭐ 그저 그래요', 3:'⭐⭐⭐ 보통이에요', 4:'⭐⭐⭐⭐ 좋아요!', 5:'⭐⭐⭐⭐⭐ 최고예요!' };
  var labelsEn = { 1:'⭐ Poor', 2:'⭐⭐ Fair', 3:'⭐⭐⭐ Okay', 4:'⭐⭐⭐⭐ Good!', 5:'⭐⭐⭐⭐⭐ Excellent!' };
  for (var i = 1; i <= 5; i++) {
    var el = document.getElementById('rstar-' + matchId + '-' + i);
    if (el) el.style.color = i <= n ? '#F59E0B' : '#E5E7EB';
  }
  var labelEl = document.getElementById('rev-star-label');
  if (labelEl) labelEl.textContent = (curLang === 'ko' ? labels : labelsEn)[n] || '';
}

// ── 후기 Firestore 저장 ──
function submitRevModal(matchId) {
  var user = auth.currentUser;
  if (!user) return;
  var isKo   = curLang === 'ko';
  var txt    = (document.getElementById('rev-textarea').value || '').trim();
  var errEl  = document.getElementById('rev-modal-err');

  if (txt.length < 10) {
    errEl.textContent = isKo ? '후기를 10자 이상 작성해 주세요.' : 'Please write at least 10 characters.';
    errEl.style.display = 'block';
    return;
  }

  var isOrg   = !!ORG_MAP[user.email];
  var orgInfo = isOrg ? ORG_MAP[user.email] : null;

  // matchId(=volId)로 봉사자 정보 조회
  db.collection('volunteers').doc(matchId).get().then(function(doc) {
    if (!doc.exists) { errEl.textContent = '매칭 정보를 찾을 수 없습니다.'; errEl.style.display = 'block'; return; }
    var v = doc.data();

    var review = {
      matchId:      matchId,
      authorUid:    user.uid,
      authorEmail:  user.email,
      authorType:   isOrg ? 'org' : 'volunteer',
      authorName:   isOrg ? (orgInfo ? orgInfo.name : '기관') : (v.name || user.email),
      targetName:   isOrg ? (v.name || '봉사자') : (ORG_MAP[v.orgEmail] ? ORG_MAP[v.orgEmail].name : v.org || '기관'),
      rating:       _revStars,
      text:         txt,
      airline:      v.airline || '',
      flightNo:     v.flightNo || '',
      flightDate:   v.flightDate || '',
      createdAt:    firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('reviews').add(review).then(function() {
      document.getElementById('rev-modal').remove();
      alert(isKo ? '후기가 등록되었습니다 🐾 감사합니다!' : 'Review submitted 🐾 Thank you!');
      rRevs(); // 목록 새로고침
    }).catch(function(e) {
      errEl.textContent = '오류: ' + e.message;
      errEl.style.display = 'block';
    });
  });
}

// ── 전체 후기 목록 불러오기 ──
function loadRevList() {
  var listEl = document.getElementById('rev-list');
  if (!listEl) return;
  var isKo = curLang === 'ko';

  listEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);font-size:13px;">불러오는 중...</div>';

  db.collection('reviews')
    .orderBy('createdAt', 'desc')
    .limit(30)
    .get()
    .then(function(snap) {
      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">' +
          '<div style="font-size:36px;margin-bottom:8px;">⭐</div>' +
          (isKo ? '아직 후기가 없어요. 첫 번째 후기를 남겨보세요!' : 'No reviews yet. Be the first to write one!') + '</div>';
        return;
      }

      listEl.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--t2);margin-bottom:10px;">⭐ ' +
        (isKo ? '전체 후기 ' : 'All Reviews ') + '(' + snap.size + ')' + '</div>' +
        snap.docs.map(function(doc) {
          var r = doc.data();
          var stars = '';
          for (var i = 0; i < 5; i++) stars += i < r.rating ? '<span style="color:#F59E0B;">★</span>' : '<span style="color:#E5E7EB;">★</span>';
          var typeLabel = r.authorType === 'org'
            ? '<span style="font-size:10px;background:#EFF6FF;color:#2563EB;padding:2px 7px;border-radius:8px;font-weight:700;">🏥 기관</span>'
            : '<span style="font-size:10px;background:#FFF5E6;color:#FF8C00;padding:2px 7px;border-radius:8px;font-weight:700;">✈️ 봉사자</span>';
          var dateStr = r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString('ko') : '';

          return '<div class="card" style="margin-bottom:10px;">' +
            '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">' +
            '<div style="width:36px;height:36px;border-radius:50%;background:#FFF5E6;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">' +
            (r.authorType === 'org' ? '🏥' : '👤') + '</div>' +
            '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' +
            '<span style="font-weight:700;font-size:13px;">' + (r.authorName||'') + '</span>' + typeLabel +
            '</div>' +
            '<div style="font-size:11px;color:var(--t2);margin-top:2px;">→ ' + (r.targetName||'') + ' · ✈️ ' + (r.airline||'') + ' ' + (r.flightNo||'') + ' · ' + (r.flightDate||'') + '</div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0;">' +
            '<div style="font-size:14px;">' + stars + '</div>' +
            '<div style="font-size:10px;color:var(--t3);">' + dateStr + '</div>' +
            '</div>' +
            '</div>' +
            '<p style="font-size:13px;line-height:1.7;color:#374151;margin:0;padding-top:8px;border-top:1px solid var(--br);">' + r.text + '</p>' +
            '</div>';
        }).join('');
    })
    .catch(function(e) {
      // 인덱스 없을 경우 createdAt 없이 재시도
      db.collection('reviews').limit(30).get().then(function(snap2) {
        if (snap2.empty) {
          listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;"><div style="font-size:36px;margin-bottom:8px;">⭐</div>' +
            (isKo ? '아직 후기가 없어요.' : 'No reviews yet.') + '</div>';
          return;
        }
        // 간단히 표시
        listEl.innerHTML = snap2.docs.map(function(doc) {
          var r = doc.data();
          var stars = '';
          for (var i = 0; i < 5; i++) stars += i < r.rating ? '★' : '☆';
          return '<div class="card" style="margin-bottom:10px;">' +
            '<div style="font-weight:700;">' + (r.authorName||'') + ' <span style="color:#F59E0B;">' + stars + '</span></div>' +
            '<div style="font-size:11px;color:var(--t2);">→ ' + (r.targetName||'') + '</div>' +
            '<p style="font-size:13px;color:#374151;margin:8px 0 0;">' + r.text + '</p>' +
            '</div>';
        }).join('');
      });
    });
}

// 기존 함수 하위호환 유지
function togRF() {}
function subRev() {}
function ldPh() {}
function rmPh() {}

// ── FIREBASE 화면 전환 ──
// ── 현재 화면 추적 (백버튼 처리용) ──
var _curScreen = 's-splash';
var _curTab    = 'home';

function scGo(id) {
  document.querySelectorAll('.sc').forEach(function(el) { el.classList.remove('on'); });
  var target = document.getElementById(id);
  if (target) target.classList.add('on');
  window.scrollTo(0, 0);
  _curScreen = id;

  // history 스택에 현재 화면 기록 (갤럭시 백버튼용)
  window.history.pushState({ screen: id, tab: _curTab }, '', '');
}

// ── 갤럭시/안드로이드 백버튼 (popstate) 처리 ──
window.addEventListener('popstate', function(e) {
  // 앱 종료 확인 팝업 열려 있으면 닫기
  var exitPop = document.getElementById('app-exit-popup');
  if (exitPop) { exitPop.remove(); window.history.pushState({}, '', ''); return; }

  // 수정 모달 열려 있으면 닫기
  var modal = document.getElementById('edit-flight-modal');
  if (modal) { modal.remove(); window.history.pushState({}, '', ''); return; }

  // 채팅방 열려 있으면 닫기
  var cr = document.getElementById('s-chatroom');
  if (cr && cr.style.display !== 'none') { closeChatRoom(); window.history.pushState({}, '', ''); return; }

  // 봉사자 프로필 열려 있으면 닫기
  var vp = document.getElementById('s-volprofile');
  if (vp && vp.style.display !== 'none') { closeVolProfile(); window.history.pushState({}, '', ''); return; }

  // 서브화면(기관 대시보드, 로그인 등) → 스플래시로
  if (_curScreen !== 's-main' && _curScreen !== 's-splash') {
    scGo('s-splash');
    window.history.pushState({}, '', '');
    return;
  }

  // 메인 탭에서 홈이 아닌 탭 → 홈으로
  if (_curScreen === 's-main' && _curTab !== 'home') {
    setTab('home');
    window.history.pushState({}, '', '');
    return;
  }

  // 홈에서 백버튼 → 스플래시
  if (_curScreen === 's-main' && _curTab === 'home') {
    scGo('s-splash');
    window.history.pushState({}, '', '');
    return;
  }

  // 스플래시에서 백버튼 → 앱 종료 확인 팝업
  if (_curScreen === 's-splash') {
    showAppExitPopup();
    window.history.pushState({}, '', '');
    return;
  }
});

// ── 앱 종료 확인 팝업 ──
function showAppExitPopup() {
  var existing = document.getElementById('app-exit-popup');
  if (existing) return;
  var isKo = curLang === 'ko';

  var popup = document.createElement('div');
  popup.id = 'app-exit-popup';
  popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99999;display:flex;align-items:flex-end;justify-content:center;';
  popup.innerHTML =
    '<div style="background:var(--wh);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:28px 24px 32px;">' +
    '<div style="text-align:center;margin-bottom:20px;">' +
    '<div style="font-size:36px;margin-bottom:10px;">🐾</div>' +
    '<div style="font-size:17px;font-weight:800;color:var(--tx);margin-bottom:6px;">' +
    (isKo ? 'PAWST CLASS를 종료할까요?' : 'Exit PAWST CLASS?') + '</div>' +
    '<div style="font-size:13px;color:var(--t2);">' +
    (isKo ? '강아지들이 기다리고 있어요 🐶' : 'The pups are waiting for you 🐶') + '</div>' +
    '</div>' +
    '<button onclick="appExit()" style="width:100%;background:#1F2937;color:#fff;border:none;border-radius:14px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px;">' +
    (isKo ? '앱 종료' : 'Exit App') + '</button>' +
    '<button onclick="document.getElementById(\'app-exit-popup\').remove()" style="width:100%;background:var(--or);color:#fff;border:none;border-radius:14px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;">' +
    (isKo ? '계속 사용하기' : 'Keep Using') + '</button>' +
    '</div>';

  document.body.appendChild(popup);
}

// ── 앱 종료 실행 ──
function appExit() {
  // Android WebView / PWA 종료
  if (window.Android && window.Android.exitApp) {
    window.Android.exitApp();
    return;
  }
  // 브라우저 탭 닫기 시도
  window.close();
  // window.close()가 막힌 경우 히스토리 비우고 빈 페이지로
  setTimeout(function() {
    window.location.href = 'about:blank';
  }, 200);
}

// setTab override — _curTab 추적
var _origSetTabNav = setTab;
setTab = function(t) {
  _curTab = t;
  _origSetTabNav(t);
  window.history.pushState({ screen: 's-main', tab: t }, '', '');
};

// ── 기관 로그인 ──
function doLogin() {
  var email = document.getElementById('org-email').value.trim();
  var pw    = document.getElementById('org-pw').value;
  var btn   = document.getElementById('login-btn');
  var err   = document.getElementById('login-err');

  if (!email || !pw) { showErr('login-err', '이메일과 비밀번호를 입력해 주세요.'); return; }

  btn.textContent = '로그인 중...';
  btn.style.opacity = '.6';

  auth.signInWithEmailAndPassword(email, pw)
    .then(function(cred) {
      btn.textContent = '로그인';
      btn.style.opacity = '1';
      err.style.display = 'none';
      var orgInfo = ORG_MAP[email] || { name: email, ico: '🏥', color: '#FFF5E6' };
      document.getElementById('dash-orgname').textContent = orgInfo.ico + ' ' + orgInfo.name;
      saveEmailToStorage(email, false); // 기관 이메일 저장
      loadOrgDogs(email);
      scGo('s-orgdash');
    })
    .catch(function(e) {
      btn.textContent = '로그인';
      btn.style.opacity = '1';
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        showErr('login-err', '비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
      } else if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-email') {
        showErr('login-err', '등록되지 않은 이메일입니다. 이메일을 확인해 주세요.');
      } else if (e.code === 'auth/too-many-requests') {
        showErr('login-err', '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.');
      } else if (e.code === 'auth/network-request-failed') {
        showErr('login-err', '네트워크 연결을 확인해 주세요.');
      } else {
        showErr('login-err', '로그인 오류가 발생했습니다. (' + (e.code||'unknown') + ')');
      }
    });
}

function loadOrgSavedEmail() {
  var saved = loadSavedEmail(false);
  if (saved) {
    var el = document.getElementById('login-email');
    if (el) el.value = saved;
  }
}

function doLogout() {
  auth.signOut().then(function() {
    document.getElementById('org-email').value = '';
    document.getElementById('org-pw').value = '';
    var nav = document.getElementById('main-nav');
    if (nav) nav.style.display = '';
    scGo('s-splash');
  });
}

// ── 에러 표시 ──
function showErr(id, msg) {
  var el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

// ── 강아지 사진 ──
var dogPhotoBase64 = null;
var isUrgent = false;

function ldDogPhoto(e) {
  var file = e.target.files[0];
  if (!file) return;
  var r = new FileReader();
  r.onload = function(ev) {
    dogPhotoBase64 = ev.target.result;
    document.getElementById('dog-photo-img').src = dogPhotoBase64;
    document.getElementById('dog-photo-prev').style.display = 'block';
    document.getElementById('dog-photo-drop').style.display = 'none';
  };
  r.readAsDataURL(file);
}
function rmDogPhoto() {
  dogPhotoBase64 = null;
  document.getElementById('dog-photo-img').src = '';
  document.getElementById('dog-photo-prev').style.display = 'none';
  document.getElementById('dog-photo-drop').style.display = 'block';
  document.getElementById('dog-photo-inp').value = '';
}
function setUrg(v) {
  isUrgent = v;
  document.getElementById('urg-no').classList.toggle('on', !v);
  document.getElementById('urg-yes').classList.toggle('on', v);
}

// ── 강아지 등록 (Firestore) ──
function submitDog() {
  var name      = document.getElementById('dog-name').value.trim();
  var breed     = document.getElementById('dog-breed').value.trim();
  var weight    = document.getElementById('dog-weight').value.trim();
  var age       = document.getElementById('dog-age').value.trim();
  var dateFrom  = document.getElementById('dog-date-from').value;
  var dateTo    = document.getElementById('dog-date-to').value;
  var memo      = document.getElementById('dog-memo').value.trim();
  var errEl     = document.getElementById('dogform-err');
  var btn       = document.getElementById('dog-submit-btn');

  errEl.style.display = 'none';

  if (!name || !breed || !weight || !dateFrom || !dateTo) {
    showErr('dogform-err', '이름, 견종, 몸무게, 이동 기간은 필수 항목입니다.');
    return;
  }
  if (dateTo < dateFrom) {
    showErr('dogform-err', '이동 기간 종료일은 시작일 이후여야 합니다.');
    return;
  }
  if (dogPhotoBase64) {
    var sizeBytes = Math.round((dogPhotoBase64.length * 3) / 4);
    if (sizeBytes > 5 * 1024 * 1024) {
      showErr('dogform-err', '사진 파일이 너무 큽니다. 5MB 이하로 올려주세요.');
      return;
    }
  }

  var user = auth.currentUser;
  if (!user) { showErr('dogform-err', '로그인이 필요합니다.'); return; }

  var orgInfo = ORG_MAP[user.email] || { name: user.email, ico: '🐾', color: '#FFF5E6' };

  btn.textContent = '등록 중...';
  btn.style.opacity = '.6';

  db.collection('dogs').add({
    name:      name,
    breed:     breed,
    weight:    parseFloat(weight),
    age:       age,
    dateFrom:  dateFrom,
    dateTo:    dateTo,
    urgent:    isUrgent,
    memo:      memo,
    photo:     dogPhotoBase64 || null,
    org:       orgInfo.name,
    orgEmail:  user.email,
    orgIco:    orgInfo.ico,
    orgColor:  orgInfo.color,
    dest:      'ATL',
    status:    'waiting',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function() {
    btn.textContent = '등록 완료 🐾';
    btn.style.opacity = '1';
    ['dog-name','dog-breed','dog-weight','dog-age','dog-date-from','dog-date-to','dog-memo'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
    rmDogPhoto();
    setUrg(false);
    loadOrgDogs(user.email);
    setTimeout(function() {
      btn.textContent = '등록 완료 🐾';
      scGo('s-orgdash');
    }, 800);
  })
  .catch(function(e) {
    btn.textContent = '등록 완료 🐾';
    btn.style.opacity = '1';
    showErr('dogform-err', '등록 중 오류가 발생했습니다: ' + e.message);
  });
}
// ── 기관 강아지 목록 불러오기 ──
function loadOrgDogs(email) {
  var listEl = document.getElementById('org-doglist');
  listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:13px;">불러오는 중...</div>';

  db.collection('dogs')
    .where('orgEmail', '==', email)
    .orderBy('createdAt', 'desc')
    .onSnapshot(function(snap) {
      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">아직 등록된 강아지가 없어요 🐾<br>위 버튼으로 첫 강아지를 등록해보세요!</div>';
        return;
      }
      listEl.innerHTML = snap.docs.map(function(doc) {
        var d = doc.data();
        var did = doc.id;
        var stMap = { waiting:'대기중', matched:'매칭완료', done:'이동완료' };
        var stColorMap = { waiting:'#FF8C00', matched:'#3B82F6', done:'#2D9E6B' };
        var stBgMap = { waiting:'#FFF5E6', matched:'#EFF6FF', done:'#E8F7F0' };
        var st = d.status || 'waiting';
        var photoHtml = d.photo
          ? '<img src="' + d.photo + '" style="width:48px;height:48px;border-radius:10px;object-fit:cover;flex-shrink:0;">'
          : '<div style="width:48px;height:48px;border-radius:10px;background:' + (d.orgColor||'#FFF5E6') + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + (d.orgIco||'🐶') + '</div>';

        // 상태별 액션 버튼
        var actions = '';
        if (st === 'waiting') {
          var editData = encodeURIComponent(JSON.stringify({name:d.name,breed:d.breed,weight:d.weight,age:d.age,dateFrom:d.dateFrom,dateTo:d.dateTo,memo:d.memo,urgent:d.urgent}));
          actions = '<button onclick="editDogById(\'' + did + '\')" style="font-size:10px;padding:3px 8px;border-radius:8px;background:#EFF6FF;color:#3B82F6;border:none;cursor:pointer;font-family:inherit;margin-right:4px;">수정</button>' +
                    '<button onclick="deleteDog(\'' + did + '\')" style="font-size:10px;padding:3px 8px;border-radius:8px;background:#FCEBEB;color:#A32D2D;border:none;cursor:pointer;font-family:inherit;">삭제</button>';
        } else if (st === 'matched') {
          actions = '<button onclick="cancelMatch(\'' + did + '\',\'' + (d.matchedVol||'') + '\')" style="font-size:10px;padding:3px 8px;border-radius:8px;background:#FAEEDA;color:#854F0B;border:none;cursor:pointer;font-family:inherit;margin-right:4px;">매칭취소</button>' +
                    '<button onclick="orgMarkDone(\'' + (d.matchedVol||'') + '\',\'' + did + '\')" style="font-size:10px;padding:3px 8px;border-radius:8px;background:#E8F7F0;color:#2D9E6B;border:none;cursor:pointer;font-family:inherit;">이동완료</button>';
        }

        return '<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;border:1px solid #E8E0D8;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
          photoHtml +
          '<div style="flex:1;min-width:0;">' +
          '<div style="font-weight:700;font-size:14px;">' + (d.urgent?'⚡ ':'') + d.name + ' <span style="font-weight:400;color:#9CA3AF;font-size:12px;">· ' + d.breed + ' · ' + d.weight + 'kg</span></div>' +
          '<div style="font-size:11px;color:#3B82F6;margin-top:1px;">→ ' + (d.dest||'ATL') + ' · ' + (d.dateFrom||'') + ' ~ ' + (d.dateTo||'') + '</div>' +
          (d.matchedVol ? '<div style="font-size:11px;color:#2D9E6B;margin-top:1px;">✅ 봉사자 매칭됨</div>' : '') +
          '</div>' +
          '<span style="font-size:11px;padding:3px 9px;border-radius:9px;font-weight:700;background:' + stBgMap[st] + ';color:' + stColorMap[st] + ';flex-shrink:0;">' + stMap[st] + '</span>' +
          '</div>' +
          (actions ? '<div style="display:flex;gap:6px;margin-top:8px;justify-content:flex-end;">' + actions + '</div>' : '') +
          '</div>';
      }).join('');
    }, function(e) {
      listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--re);font-size:13px;">오류: ' + e.message + '</div>';
    });
}

// ── 홈 화면 강아지 실시간 로드 (Firestore) ──
function loadHomeDogs() {
  db.collection('dogs')
    .where('status', '==', 'waiting')
    .orderBy('urgent', 'desc')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function(snap) {
      if (snap.empty) return; // 데이터 없으면 더미 유지
      // dog grid 업데이트
      var grid = document.querySelector('.dog-grid');
      if (!grid) return;
      grid.innerHTML = snap.docs.slice(0, 4).map(function(doc) {
        var d = doc.data();
        var photoInner = d.photo
          ? '<img src="' + d.photo + '" style="width:100%;height:100%;object-fit:cover;">'
          : '<span style="font-size:32px;">' + (d.orgIco||'🐶') + '</span>';
        return '<div class="dc">' +
          '<div class="dt" style="background:' + (d.orgColor||'#FFF0EB') + ';">' +
          photoInner +
          (d.urgent ? '<span class="du" data-ko="긴급" data-en="Urgent">긴급</span>' : '') +
          '</div>' +
          '<div class="di">' +
          '<div class="dn">' + d.name + '</div>' +
          '<div class="db">' + d.breed + ' · ' + d.weight + 'kg</div>' +
          '<div class="dr">→ ' + (d.dest||'ATL') + '</div>' +
          '<div class="do">' + (d.org||'') + '</div>' +
          '</div></div>';
      }).join('');
    });
}

// 홈 진입 시 실시간 로드
document.addEventListener('DOMContentLoaded', function() {
  loadHomeDogs();
});

// ── 대시보드 탭 전환 ──
function setDashTab(t) {
  document.getElementById('dash-dogs-panel').style.display   = t === 'dogs'   ? 'block' : 'none';
  document.getElementById('dash-vols-panel').style.display   = t === 'vols'   ? 'block' : 'none';
  document.getElementById('dash-foster-panel').style.display = t === 'foster' ? 'block' : 'none';
  var chatPanelEl = document.getElementById('dash-chat-panel');
  if (chatPanelEl) chatPanelEl.style.display = t === 'chat' ? 'block' : 'none';

  document.getElementById('tab-dogs').classList.toggle('on',   t === 'dogs');
  document.getElementById('tab-vols').classList.toggle('on',   t === 'vols');
  document.getElementById('tab-foster').classList.toggle('on', t === 'foster');
  var tabChatEl = document.getElementById('tab-chat');
  if (tabChatEl) tabChatEl.classList.toggle('on', t === 'chat');

  if (t === 'chat') loadOrgChatList();
}

// ── 봉사자 목록 실시간 로드 ──
function loadVolunteers() {
  var listEl = document.getElementById('org-vollist');
  if (!listEl) return;

  db.collection('volunteers')
    .where('status', '==', 'booked')
    .orderBy('flightDate', 'asc')
    .onSnapshot(function(snap) {
      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">대기 중인 봉사자가 없어요 ✈️</div>';
        return;
      }
      listEl.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data();
        var vid = doc.id;
        return '<div style="background:#fff;border-radius:12px;padding:12px 13px;margin-bottom:8px;border:1px solid #E8E0D8;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
          '<div><div style="font-weight:700;font-size:14px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-top:1px;">ICN → ATL · ' + (v.flightDate||'날짜 미정') + '</div></div>' +
          '<span style="background:#FFF5E6;color:#FF8C00;font-size:10px;font-weight:700;padding:3px 8px;border-radius:9px;">예약완료</span>' +
          '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-bottom:4px;">👤 ' + (v.name||'미입력') + ' · ' + (v.nation||'') + '</div>' +
          (v.resno ? '<div style="font-size:12px;color:var(--t2);margin-bottom:4px;">🎫 예약번호: ' + v.resno + '</div>' : '') +
          (v.kakao ? '<div style="font-size:12px;color:var(--t2);margin-bottom:8px;">💬 ' + v.kakao + '</div>' : '<div style="margin-bottom:8px;"></div>') +
          '<button class="btn-pr" onclick="openMatchModal(\'' + vid + '\')" style="padding:9px;font-size:12px;">이 봉사자와 매칭하기 🐾</button>' +
          '</div>';
      }).join('');
    }, function(err) {
      listEl.innerHTML = '<div style="text-align:center;padding:20px;color:#C0392B;font-size:13px;">데이터를 불러오지 못했어요.<br><span style="font-size:11px;color:var(--t3);">Firebase 인덱스 설정이 필요합니다.<br>pawstclass.1@gmail.com으로 문의해 주세요.</span></div>';
    });
}

// ── 매칭 모달 ──
var selectedVolId  = null;
var selectedDogIds = [];   // 최대 2마리 (배열)
var cachedDogs     = [];
// 하위 호환: selectedDogId → selectedDogIds[0]
Object.defineProperty(window, 'selectedDogId', {
  get: function() { return selectedDogIds[0] || null; },
  set: function(v) { selectedDogIds = v ? [v] : []; }
});

function openMatchModal(volId) {
  selectedVolId  = volId;
  selectedDogIds = [];

  // 봉사자 정보 표시
  db.collection('volunteers').doc(volId).get().then(function(doc) {
    var v = doc.data();
    document.getElementById('mm-vol-info').innerHTML =
      '✈️ <b>' + (v.airline||'') + ' ' + (v.flightNo||'') + '</b> · ' + (v.flightDate||'') +
      '<br>👤 ' + (v.name||'') + ' · ' + (v.nation||'') +
      (v.kakao ? '<br>💬 카카오 ID: ' + v.kakao : '');
  });

  // 현재 기관의 대기 중인 강아지 목록
  var user = auth.currentUser;
  if (!user) return;

  db.collection('dogs')
    .where('orgEmail', '==', user.email)
    .where('status', '==', 'waiting')
    .get()
    .then(function(snap) {
      cachedDogs = snap.docs;
      if (snap.empty) {
        document.getElementById('mm-dog-list').innerHTML =
          '<div style="text-align:center;padding:16px;color:var(--t3);font-size:13px;">매칭 가능한 강아지가 없어요.<br>먼저 강아지를 등록해주세요!</div>';
        document.getElementById('mm-confirm').style.display = 'none';
        return;
      }
      document.getElementById('mm-confirm').style.display = 'block';
      document.getElementById('mm-confirm').style.opacity = '0.5';
      document.getElementById('mm-confirm').style.cursor = 'not-allowed';

      // 안내 문구 (최대 2마리)
      var isKo = curLang === 'ko';
      var guideHtml = '<div style="background:#FFF5E6;border-radius:10px;padding:9px 12px;font-size:12px;color:#854F0B;margin-bottom:10px;">' +
        '🐾 ' + (isKo ? '한 항공편당 최대 <b>2마리</b>까지 선택할 수 있습니다.' : 'You can select up to <b>2 dogs</b> per flight.') + '</div>';

      document.getElementById('mm-dog-list').innerHTML = guideHtml + snap.docs.map(function(doc) {
        var d = doc.data();
        var photoHtml = d.photo
          ? '<img src="' + d.photo + '" style="width:40px;height:40px;border-radius:9px;object-fit:cover;flex-shrink:0;">'
          : '<div style="width:40px;height:40px;border-radius:9px;background:' + (d.orgColor||'#FFF5E6') + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + (d.orgIco||'🐶') + '</div>';
        return '<div class="match-dog-item" id="mdog-' + doc.id + '" onclick="selectDog(\'' + doc.id + '\')">' +
          photoHtml +
          '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">' + (d.urgent?'⚡ ':'') + d.name + '</div>' +
          '<div style="font-size:11px;color:var(--t2);">' + d.breed + ' · ' + d.weight + 'kg · ' + (d.dateFrom||'') + ' ~ ' + (d.dateTo||'') + '</div></div>' +
          '<div class="match-dog-check" id="mdog-chk-' + doc.id + '" style="width:20px;height:20px;border-radius:50%;border:2px solid #E8E0D8;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;"></div>' +
          '</div>';
      }).join('');

      updateMatchCount();
    });

  document.getElementById('mm').classList.add('on');
}

function selectDog(dogId) {
  var isKo = curLang === 'ko';
  var idx  = selectedDogIds.indexOf(dogId);

  if (idx > -1) {
    // 이미 선택된 항목 → 해제
    selectedDogIds.splice(idx, 1);
  } else {
    // 최대 2마리 제한
    if (selectedDogIds.length >= 2) {
      // 선택 불가 시각적 피드백 (흔들기)
      var el = document.getElementById('mdog-' + dogId);
      if (el) {
        el.style.transition = 'transform 0.1s';
        el.style.transform  = 'translateX(4px)';
        setTimeout(function() { el.style.transform = 'translateX(-4px)'; }, 100);
        setTimeout(function() { el.style.transform = 'translateX(0)'; },  200);
      }
      alert(isKo ? '한 항공편당 최대 2마리까지만 매칭할 수 있습니다.' : 'You can only match up to 2 dogs per flight.');
      return;
    }
    selectedDogIds.push(dogId);
  }

  // UI 업데이트 — 선택된 항목 강조
  cachedDogs.forEach(function(doc) {
    var item = document.getElementById('mdog-' + doc.id);
    var chk  = document.getElementById('mdog-chk-' + doc.id);
    if (!item || !chk) return;
    var sel = selectedDogIds.indexOf(doc.id) > -1;
    item.classList.toggle('on', sel);
    chk.style.background   = sel ? 'var(--or)' : '';
    chk.style.borderColor  = sel ? 'var(--or)' : '#E8E0D8';
    chk.textContent        = sel ? '✓' : '';
    chk.style.color        = sel ? '#fff' : '';
  });

  updateMatchCount();
}

// 선택 카운트 표시 + 버튼 텍스트 갱신
function updateMatchCount() {
  var isKo = curLang === 'ko';
  var btn  = document.getElementById('mm-confirm');
  if (!btn) return;
  var cnt = selectedDogIds.length;
  if (cnt === 0) {
    btn.textContent = isKo ? '강아지를 선택해 주세요' : 'Please select a dog';
    btn.style.opacity = '.5';
    btn.style.cursor  = 'not-allowed';
  } else {
    btn.textContent = isKo ? '매칭 확정 🐾 (' + cnt + '마리)' : 'Confirm Match 🐾 (' + cnt + ')';
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
  }
}

function confirmMatch() {
  var isKo = curLang === 'ko';
  if (!selectedVolId || selectedDogIds.length === 0) {
    alert(isKo ? '강아지를 선택해주세요.' : 'Please select a dog.');
    return;
  }
  var btn = document.getElementById('mm-confirm');
  btn.textContent = isKo ? '매칭 중...' : 'Matching...';
  btn.style.opacity = '.6';

  // 스냅샷 — 비동기 처리 중 값 변경 방지
  var snapVolId  = selectedVolId;
  var snapDogIds = selectedDogIds.slice();

  db.collection('volunteers').doc(snapVolId).get().then(function(doc) {
    var v = doc.data();
    if (v.status !== 'booked') {
      btn.textContent = isKo ? '매칭 확정 🐾' : 'Confirm Match 🐾';
      btn.style.opacity = '1';
      clMo('mm');
      alert(isKo ? '이미 매칭된 봉사자입니다. 새로고침 후 다시 확인해주세요.' : 'Already matched. Please refresh and try again.');
      return;
    }

    var batch = db.batch();
    batch.update(db.collection('volunteers').doc(snapVolId), {
      status:      'matched',
      matchedDog:  snapDogIds[0],
      matchedDogs: snapDogIds,
      orgEmail:    auth.currentUser ? auth.currentUser.email : null
    });
    snapDogIds.forEach(function(dogId) {
      batch.update(db.collection('dogs').doc(dogId), {
        status:     'matched',
        matchedVol: snapVolId
      });
    });

    batch.commit()
      .then(function() {
        btn.textContent = isKo ? '매칭 확정 🐾' : 'Confirm Match 🐾';
        btn.style.opacity = '1';
        clMo('mm');
        var cnt = snapDogIds.length;
        alert('🎉 ' + (isKo
          ? '매칭이 완료되었습니다! (' + cnt + '마리) 봉사자에게 카카오톡으로 연락해주세요.'
          : 'Matching complete! (' + cnt + ' dog' + (cnt>1?'s':'') + ') Please contact the volunteer via KakaoTalk.'));

        // ── 채팅방 자동 생성 (매칭 직후) ──
        var orgInfo = ORG_MAP[auth.currentUser ? auth.currentUser.email : ''] || { name: v.org || '기관' };
        if (snapDogIds.length === 0) {
          createChatRoom(snapVolId, orgInfo.name, v.name || '봉사자', null);
          return;
        }
        var dogInfoLines = [];
        var fetched = 0;
        snapDogIds.forEach(function(dogId) {
          db.collection('dogs').doc(dogId).get().then(function(ddoc) {
            if (ddoc.exists) {
              var d = ddoc.data();
              dogInfoLines.push('🐾 ' + d.name + ' · ' + d.breed + ' · ' + d.weight + 'kg');
            }
            fetched++;
            if (fetched === snapDogIds.length) {
              var dogInfoText = '📋 매칭된 강아지 정보:\n' + dogInfoLines.join('\n') +
                '\n\n✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') +
                '\n👤 봉사자: ' + (v.name||'') + (v.kakao ? ' · 💬 ' + v.kakao : '');
              createChatRoom(snapVolId, orgInfo.name, v.name || '봉사자', dogInfoText);
            }
          });
        });
      })
      .catch(function(e) {
        btn.textContent = isKo ? '매칭 확정 🐾' : 'Confirm Match 🐾';
        btn.style.opacity = '1';
        alert('오류: ' + e.message);
      });
  }).catch(function(e) {
    btn.textContent = isKo ? '매칭 확정 🐾' : 'Confirm Match 🐾';
    btn.style.opacity = '1';
    alert('오류: ' + e.message);
  });
}

// loadOrgDogs 호출 시 봉사자도 같이 로드
var _origLoadOrgDogs = loadOrgDogs;
loadOrgDogs = function(email) {
  _origLoadOrgDogs(email);
  loadVolunteers();
};

// ── FOSTER 신청 저장 ──
function submitFoster() {
  var name  = document.getElementById('fos-name')  ? document.getElementById('fos-name').value.trim()  : '';
  var email = document.getElementById('fos-email') ? document.getElementById('fos-email').value.trim() : '';
  var city  = document.getElementById('fos-city')  ? document.getElementById('fos-city').value.trim()  : '';
  var home  = document.getElementById('fos-home')  ? document.getElementById('fos-home').value  : '';
  var pets  = document.getElementById('fos-pets')  ? document.getElementById('fos-pets').value  : '';

  if (!name || !email || !city) {
    alert(curLang === 'ko' ? '이름, 이메일, 거주 도시는 필수입니다.' : 'Name, email, and city are required.');
    return;
  }

  db.collection('fosters').add({
    name:      name,
    email:     email,
    city:      city,
    homeType:  home,
    pets:      pets,
    status:    'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function() {
    ['fos-name','fos-email','fos-city'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var msg = curLang === 'ko' ? '신청이 완료되었습니다! 곧 연락드릴게요 🐾' : 'Application submitted! We\'ll be in touch soon 🐾';
    alert(msg);
  })
  .catch(function(e) { alert('오류: ' + e.message); });
}

// ── FOSTER 신청자 목록 로드 (기관 대시보드) ──
function loadFosterList() {
  var listEl = document.getElementById('org-fosterlist');
  if (!listEl) return;

  db.collection('fosters')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function(snap) {
      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">아직 신청자가 없어요 🏠</div>';
        return;
      }
      listEl.innerHTML = snap.docs.map(function(doc) {
        var f = doc.data();
        var stColor = f.status === 'approved' ? '#2D9E6B' : '#FF8C00';
        var stBg    = f.status === 'approved' ? '#E8F7F0' : '#FFF5E6';
        var stLabel = f.status === 'approved' ? '승인' : '검토중';
        return '<div style="background:#fff;border-radius:12px;padding:12px 13px;margin-bottom:8px;border:1px solid #E8E0D8;display:flex;align-items:center;gap:10px;">' +
          '<div style="width:38px;height:38px;border-radius:10px;background:#FFF5E6;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🏠</div>' +
          '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">' + (f.name||'') + '</div>' +
          '<div style="font-size:11px;color:#9CA3AF;margin-top:1px;">' + (f.city||'') + ' · ' + (f.homeType||'') + '</div>' +
          '<div style="font-size:11px;color:#9CA3AF;">' + (f.email||'') + ' · 반려동물: ' + (f.pets||'없음') + '</div></div>' +
          '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">' +
          '<span style="font-size:11px;padding:3px 9px;border-radius:9px;font-weight:700;background:' + stBg + ';color:' + stColor + ';">' + stLabel + '</span>' +
          (f.status !== 'approved' ? '<button onclick="approveFoster(\'' + doc.id + '\')" style="font-size:10px;padding:3px 8px;border-radius:8px;background:var(--gr);color:#fff;border:none;cursor:pointer;font-family:inherit;">승인</button>' : '') +
          '</div></div>';
      }).join('');
    });
}

// ── FOSTER 승인 ──
function approveFoster(id) {
  db.collection('fosters').doc(id).update({ status: 'approved' })
    .then(function() { alert('임시보호 신청이 승인되었습니다! 🏠'); })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// loadOrgDogs 호출 시 foster도 같이 로드 (기존 override 업데이트)
var _origLoad2 = loadOrgDogs;
loadOrgDogs = function(email) {
  _origLoad2(email);
  loadFosterList();
};

// ══════════════════════════════
// v1.8 · CALENDAR + REMINDERS
// ══════════════════════════════

var calYear, calMonth, calEvents = [], calSelected = null;

// ── 캘린더 초기화 ──
function initCal() {
  var now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  loadCalEvents();
}

// ── Firestore에서 봉사 일정 불러오기 ──
function loadCalEvents() {
  calEvents = [];
  // 봉사자 본인 항공편 (로컬 스토리지 임시 — 로그인 없는 봉사자용)
  var saved = localStorage.getItem('pawst_flight');
  if (saved) {
    try {
      var f = JSON.parse(saved);
      if (f.flightDate) calEvents.push({ date: f.flightDate, type: 'flight', label: '✈️ ' + (f.airline||'') + ' ' + (f.flightNo||''), org: f.org||'' });
    } catch(e) {}
  }
  // 로그인한 봉사자 본인 항공편만 표시 (타인 일정 노출 방지)
  var calUser = auth.currentUser;
  if (calUser) {
    db.collection('volunteers')
      .where('email', '==', calUser.email)
      .get()
      .then(function(snap) {
        snap.forEach(function(doc) {
          var v = doc.data();
          if (v.flightDate) {
            calEvents.push({ date: v.flightDate, type: 'flight', label: '✈️ ' + (v.airline||'') + ' ' + (v.flightNo||''), volName: v.name||'', id: doc.id });
          }
        });
        renderCal();
        renderReminders();
      })
      .catch(function() { renderCal(); renderReminders(); });
  } else {
    // 비로그인: 로컬스토리지 데이터만 표시
    renderCal();
    renderReminders();
  }
}

// ── 캘린더 렌더링 ──
function renderCal() {
  var months_ko = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var months_en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var isKo = curLang === 'ko';

  document.getElementById('cal-title').textContent =
    calYear + (isKo ? '년 ' : ' ') + (isKo ? months_ko[calMonth] : months_en[calMonth]);

  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  var daysInPrev  = new Date(calYear, calMonth, 0).getDate();
  var today = new Date();
  var todayStr = toDateStr(today);

  // 이벤트 날짜 세트
  var eventDates = {};
  calEvents.forEach(function(e) { eventDates[e.date] = e; });

  var cells = '';
  // 이전달 날짜
  for (var i = firstDay - 1; i >= 0; i--) {
    cells += '<div class="cal-day other-month">' + (daysInPrev - i) + '</div>';
  }
  // 이번달 날짜
  for (var d = 1; d <= daysInMonth; d++) {
    var ds = calYear + '-' + pad(calMonth+1) + '-' + pad(d);
    var cls = 'cal-day';
    if (ds === todayStr) cls += ' today';
    if (ds === calSelected) cls += ' selected';
    if (eventDates[ds]) cls += ' has-event';
    cells += '<div class="' + cls + '" onclick="selectDay(\'' + ds + '\')">' + d + '</div>';
  }
  // 다음달 날짜
  var remaining = 42 - (firstDay + daysInMonth);
  for (var n = 1; n <= remaining; n++) {
    cells += '<div class="cal-day other-month">' + n + '</div>';
  }
  document.getElementById('cal-grid').innerHTML = cells;

  // 선택된 날짜 상세
  if (calSelected) showCalDetail(calSelected);
}

function selectDay(ds) {
  calSelected = ds;
  renderCal();
  showCalDetail(ds);
}

function showCalDetail(ds) {
  var dayEvents = calEvents.filter(function(e) { return e.date === ds; });
  var detailEl = document.getElementById('cal-detail');
  if (!dayEvents.length) {
    detailEl.innerHTML = '<div style="text-align:center;padding:12px;color:var(--t3);font-size:12px;">' + ds + ' — 일정 없음</div>';
    return;
  }
  detailEl.innerHTML = dayEvents.map(function(e) {
    return '<div class="cal-event-item">' +
      '<div class="cal-event-title">' + e.label + '</div>' +
      (e.volName ? '<div class="cal-event-meta">👤 ' + e.volName + '</div>' : '') +
      '<div class="cal-event-meta">📍 ICN → ATL · ' + ds + '</div>' +
      '</div>';
  }).join('');
}

function calPrev() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } calSelected = null; renderCal(); }
function calNext() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } calSelected = null; renderCal(); }

// ── 리마인더 계산 & 렌더링 ──

// 봉사자 리마인더 타이밍 정의
var VOL_REMINDERS = [
  { dday: -7,  type: 'warn',   icon: '✈️',
    ko: '항공사 반려동물 동반 신청하셨나요? (D-7)',
    en: 'Have you registered your pet with the airline? (D-7)' },
  { dday: -3,  type: 'warn',   icon: '⚠️',
    ko: '반려동물 동반 신청 마감 D-3! 48시간 전까지 필수 완료',
    en: 'Pet registration deadline in 3 days! Must complete 48hrs before' },
  { dday: -2,  type: 'danger', icon: '🚨',
    ko: '오늘까지 항공사 반려동물 동반 신청 완료하세요! (D-2)',
    en: 'Complete airline pet registration TODAY! (D-2)' },
  { dday: -1,  type: 'warn',   icon: '📋',
    ko: '내일 출발! 공항 집합 시간과 서류 최종 확인하세요',
    en: 'Departing tomorrow! Confirm airport time and documents' },
  { dday:  0,  type: 'info',   icon: '🐾',
    ko: '오늘 봉사일입니다! 안전하고 따뜻한 비행 되세요 🐾',
    en: 'Today is your volunteer day! Safe and warm flight 🐾' },
  { dday:  1,  type: 'review', icon: '✍️',
    ko: '봉사 완료! 소중한 경험을 후기로 남겨주세요',
    en: 'Volunteer complete! Share your experience in a review' }
];

// 기관 리마인더 타이밍
var ORG_REMINDERS = [
  { dday: -3,  type: 'warn',   icon: '📋',
    ko: '봉사 3일 전! 서류 준비 및 봉사자 최종 확인하세요',
    en: '3 days before transport! Check documents and volunteer' },
  { dday:  0,  type: 'info',   icon: '🐾',
    ko: '오늘 이동일입니다! 공항 담당자 배치 확인하세요',
    en: 'Transport day! Confirm airport coordinator assignment' },
  { dday:  3,  type: 'info',   icon: '✅',
    ko: '이동 완료 3일 경과. 상태를 \'이동완료\'로 업데이트해주세요',
    en: '3 days since transport. Please update status to Completed' }
];

function diffDays(dateStr) {
  var today = new Date(); today.setHours(0,0,0,0);
  var target = new Date(dateStr); target.setHours(0,0,0,0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function renderReminders() {
  var isKo = curLang === 'ko';
  var listEl = document.getElementById('reminder-list');
  var bannerEl = document.getElementById('reminder-banners');

  // 항공편 이벤트 없으면 빈 상태
  var flightEvents = calEvents.filter(function(e) { return e.type === 'flight'; });
  if (!flightEvents.length) {
    if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:13px;">' +
      (isKo ? '등록된 항공편이 없어요' : 'No flights registered yet') + '</div>';
    if (bannerEl) bannerEl.innerHTML = '';
    return;
  }

  // ── 전체 리마인더 타임라인 (D-14 ~ D+3) ──
  var ALL_REMINDERS = [
    { dday:-14, type:'info',   icon:'📅', ko:'D-14 · 항공편 등록 확인 및 개인 일정 조정하세요', en:'D-14 · Confirm flight and adjust personal schedule' },
    { dday:-7,  type:'warn',   icon:'✈️', ko:'D-7 · 항공사 반려동물 동반 신청 여부 확인하세요', en:'D-7 · Check if airline pet registration has been submitted' },
    { dday:-3,  type:'warn',   icon:'⚠️', ko:'D-3 · 기관에서 반려동물 동반 신청 후 카톡 알림 확인', en:'D-3 · Confirm KakaoTalk notification after org submits pet registration' },
    { dday:-2,  type:'danger', icon:'🚨', ko:'D-2 · 오늘까지 반려동물 동반 신청 완료! (48시간 전 마감)', en:'D-2 · Pet registration must be complete today! (48hr deadline)' },
    { dday:-1,  type:'warn',   icon:'📋', ko:'D-1 · 내일 출발! 건강증명서·케이지 최종 확인', en:'D-1 · Departing tomorrow! Check health certificate and crate' },
    { dday: 0,  type:'info',   icon:'🐾', ko:'D-Day · 오늘 봉사일! 안전하고 따뜻한 비행 되세요 🐾', en:'D-Day · Volunteer day! Safe and warm flight 🐾' },
    { dday: 1,  type:'review', icon:'✍️', ko:'D+1 · 봉사 완료! 소중한 후기를 남겨주세요', en:'D+1 · Complete! Please leave a review' }
  ];

  var banners = [];
  var listItems = [];

  flightEvents.forEach(function(event) {
    var dd = diffDays(event.date);

    ALL_REMINDERS.forEach(function(r) {
      // 배너: 오늘 해당되는 항목만
      if (r.dday === dd) {
        banners.push({ type:r.type, icon:r.icon, msg:isKo?r.ko:r.en, date:event.date, label:event.label });
      }
      // 목록: 항상 전체 표시 (완료 표시 포함)
      var absDiff = dd - r.dday; // absDiff > 0 이면 해당 D-day가 이미 지남
      var ddLabel = r.dday === 0 ? 'D-Day'
                  : r.dday > 0  ? 'D+' + r.dday
                  : 'D' + r.dday;
      listItems.push({
        type:    r.type,
        icon:    r.icon,
        msg:     isKo ? r.ko : r.en,
        ddLabel: ddLabel,
        date:    event.date,
        label:   event.label,
        sortKey: r.dday,
        past:    absDiff > 0   // 이미 지난 리마인더
      });
    });
  });

  // 배너 렌더
  if (bannerEl) {
    bannerEl.innerHTML = banners.map(function(b) {
      var actionBtn = b.type === 'review'
        ? '<button onclick="setTab(\'reviews\')" style="margin-left:auto;background:var(--sk);color:#fff;border:none;padding:5px 11px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0;">' + (isKo?'후기 작성':'Write Review') + '</button>'
        : '';
      return '<div class="reminder-banner ' + b.type + '">' +
        '<span class="reminder-banner-icon">' + b.icon + '</span>' +
        '<span style="flex:1;">' + b.msg + '</span>' +
        actionBtn + '</div>';
    }).join('');
  }

  // 리마인더 목록 렌더
  if (!listEl) return;
  listItems.sort(function(a, b) { return a.sortKey - b.sortKey; });
  listEl.innerHTML = listItems.map(function(item) {
    var ddClass = item.past ? 'done'
                : item.sortKey === 0 ? 'danger'
                : item.sortKey >= -2 ? 'soon'
                : 'normal';
    var pastStyle = item.past ? 'opacity:.45;text-decoration:line-through;' : '';
    return '<div class="reminder-item" style="' + pastStyle + '">' +
      '<div class="reminder-dday ' + ddClass + '">' + item.ddLabel + '</div>' +
      '<div style="flex:1;">' +
      '<div style="font-size:13px;font-weight:600;color:var(--tx);">' + item.icon + ' ' + item.msg + '</div>' +
      '<div style="font-size:11px;color:var(--t3);margin-top:2px;">✈️ ' + item.label + ' · ' + item.date + '</div>' +
      '</div>' +
      (item.past ? '<span style="font-size:11px;color:var(--gr);font-weight:700;">✓</span>' : '') +
      '</div>';
  }).join('');
}

// ── 기관 D-day 카운트다운 (대시보드) ──
function renderAdmDday() {
  var ddayEl = document.getElementById('adm-dday');
  if (!ddayEl) return;
  var isKo = curLang === 'ko';

  db.collection('volunteers')
    .where('status', 'in', ['booked','matched'])
    .orderBy('flightDate', 'asc')
    .get()
    .then(function(snap) {
      if (snap.empty) { ddayEl.innerHTML = ''; return; }
      var upcoming = snap.docs.map(function(d) { return d.data(); })
        .filter(function(v) { return diffDays(v.flightDate) >= -1; })
        .slice(0, 3);
      if (!upcoming.length) { ddayEl.innerHTML = ''; return; }

      ddayEl.innerHTML = upcoming.map(function(v) {
        var dd = diffDays(v.flightDate);
        var ddStr = dd === 0 ? 'D-Day' : (dd > 0 ? 'D+' + dd : 'D' + dd);
        var bgC = dd <= 0 ? 'rgba(224,90,43,.15)' : (dd <= 3 ? 'rgba(255,140,0,.12)' : 'rgba(255,255,255,.12)');
        return '<div style="background:' + bgC + ';border-radius:10px;padding:8px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">' +
          '<div style="color:#fff;">' +
          '<div style="font-size:11px;opacity:.75;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.name||'') + '</div>' +
          '<div style="font-size:12px;margin-top:2px;">' + v.flightDate + '</div>' +
          '</div>' +
          '<div style="font-size:18px;font-weight:800;color:' + (dd <= 1 ? '#FFB347' : '#fff') + ';">' + ddStr + '</div>' +
          '</div>';
      }).join('');
    })
    .catch(function() {});
}

// ── setTab에 calendar 추가 ──
var _origSetTab = setTab;
setTab = function(t) {
  _origSetTab(t);
  if (t === 'calendar') {
    initCal();
  }
};

// ── setAdm에 dday 추가 ──
var _origSetAdm = setAdm;
setAdm = function() {
  _origSetAdm();
  setTimeout(renderAdmDday, 300);
};

// ── 유틸 ──
function toDateStr(d) {
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
}
function pad(n) { return n < 10 ? '0' + n : '' + n; }

// ══════════════════════════════
// v1.8 추가 기능
// ══════════════════════════════

// ── 항공사 체크리스트 ──
var chkState = { chk1: false, chk2: false, chk4: false };

function togCheck(id) {
  chkState[id] = !chkState[id];
  var box = document.getElementById(id);
  var mark = box ? box.querySelector('.chk-mark') : null;
  if (box) box.classList.toggle('on', chkState[id]);
  if (mark) mark.style.display = chkState[id] ? 'inline' : 'none';

  // 부모 check-item에 done 클래스
  if (box && box.parentElement) {
    box.parentElement.classList.toggle('done', chkState[id]);
  }

  // 진행률 업데이트
  var done = Object.values(chkState).filter(Boolean).length;
  var total = 3; // chk1, chk2, chk4 (chk3 기내반입 제거됨)
  var progEl = document.getElementById('chk-progress');
  if (progEl) {
    var isKo = curLang === 'ko';
    progEl.textContent = done + ' / ' + total + (isKo ? ' 완료' : ' completed');
    progEl.style.color = done === total ? '#2D9E6B' : '#6B7280';
    if (done === total) {
      progEl.textContent = '✅ ' + (isKo ? '모두 완료! 준비됐어요 🐾' : 'All done! You\'re ready 🐾');
    }
  }

  // localStorage 저장
  try { localStorage.setItem('pawst_chk', JSON.stringify(chkState)); } catch(e) {}
}

// 체크리스트 상태 복원
function restoreChk() {
  try {
    var saved = localStorage.getItem('pawst_chk');
    if (saved) {
      chkState = JSON.parse(saved);
      Object.keys(chkState).forEach(function(id) {
        if (chkState[id]) togCheck(id); // 복원 (이미 true → toggle해서 false가 되는 문제 방지)
      });
    }
  } catch(e) {}
}

// ── 홈 화면 리마인더 배너 ──
function renderHomeBanners() {
  var bannerEl = document.getElementById('home-reminder-banners');
  if (!bannerEl) return;
  var isKo = curLang === 'ko';

  db.collection('volunteers')
    .where('status', 'in', ['booked', 'matched'])
    .orderBy('flightDate', 'asc')
    .get()
    .then(function(snap) {
      if (snap.empty) { bannerEl.innerHTML = ''; return; }

      var banners = [];
      snap.forEach(function(doc) {
        var v = doc.data();
        if (!v.flightDate) return;
        var dd = diffDays(v.flightDate);

        // 중요 D-day만 홈 배너로 표시
        var homeReminders = [
          { dday: -3, type: 'warn',   icon: '⚠️',
            ko: '반려동물 동반 신청 마감 D-3! 일정 탭에서 확인하세요',
            en: 'Pet registration deadline in 3 days! Check Schedule tab' },
          { dday: -2, type: 'danger', icon: '🚨',
            ko: '오늘까지 항공사 반려동물 동반 신청 완료하세요!',
            en: 'Complete airline pet registration TODAY!' },
          { dday: -1, type: 'warn',   icon: '📋',
            ko: '내일 출발! 공항 집합 시간 확인하세요',
            en: 'Departing tomorrow! Confirm airport meeting time' },
          { dday:  0, type: 'info',   icon: '🐾',
            ko: '오늘 봉사일입니다! 안전한 비행 되세요 🐾',
            en: 'Today is your volunteer day! Safe flight 🐾' },
          { dday:  1, type: 'review', icon: '✍️',
            ko: '봉사 완료! 후기를 남겨주세요',
            en: 'Volunteer complete! Please write a review' }
        ];

        homeReminders.forEach(function(r) {
          if (r.dday === dd) {
            banners.push({ type: r.type, icon: r.icon, msg: isKo ? r.ko : r.en, dday: dd });
          }
        });
      });

      if (!banners.length) { bannerEl.innerHTML = ''; return; }

      bannerEl.innerHTML = banners.map(function(b) {
        var actionBtn = b.type === 'review'
          ? '<button onclick="setTab(\'reviews\')" style="margin-left:auto;background:var(--sk);color:#fff;border:none;padding:5px 11px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0;">' + (isKo?'후기 작성':'Write Review') + '</button>'
          : (b.dday <= -2
            ? '<button onclick="setTab(\'calendar\')" style="margin-left:auto;background:var(--re);color:#fff;border:none;padding:5px 11px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0;">' + (isKo?'체크리스트':'Checklist') + '</button>'
            : '');
        return '<div class="reminder-banner ' + b.type + '">' +
          '<span class="reminder-banner-icon">' + b.icon + '</span>' +
          '<span style="flex:1;font-size:12px;">' + b.msg + '</span>' +
          actionBtn + '</div>';
      }).join('');
    })
    .catch(function() { bannerEl.innerHTML = ''; });
}

// ── setTab에서 홈 배너 갱신 ──
var _origSetTab2 = setTab;
setTab = function(t) {
  _origSetTab2(t);
  if (t === 'home') renderHomeBanners();
};

// ── 초기화 시 홈 배너 + 체크리스트 복원 ──
document.addEventListener('DOMContentLoaded', function() {
  renderHomeBanners();
  setTimeout(restoreChk, 500);
});

// ══════════════════════════════
// v1.9 · 실시간 채팅
// ══════════════════════════════

var curChatRoom = null;
var chatUnsubscribe = null;

// ── 채팅방 목록 로드 ──
function loadChatRooms() {
  var listEl = document.getElementById('chat-room-list');
  if (!listEl) return;
  var isKo = curLang === 'ko';

  // 현재 로그인 유저 (기관) 또는 봉사자
  var user = auth.currentUser;

  // volunteers 컬렉션에서 matched 상태인 것만
  var query = user
    ? db.collection('volunteers').where('status', '==', 'matched')
    : db.collection('volunteers').where('status', '==', 'matched');

  query.onSnapshot(function(snap) {
    if (snap.empty) {
      listEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--t3);font-size:13px;"><div style="font-size:36px;margin-bottom:10px;">💬</div><div>' +
        (isKo ? '매칭 완료 후 채팅방이 생성됩니다' : 'Chat rooms open after matching') + '</div></div>';
      return;
    }

    listEl.innerHTML = snap.docs.map(function(doc) {
      var v = doc.data();
      var rid = doc.id;
      var orgInfo = ORG_MAP[v.orgEmail] || { name: v.org || '기관', ico: '🏥', color: '#FFF5E6' };
      return '<div class="card" style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:13px 14px;margin-bottom:8px;" onclick="openChatRoom(\'' + rid + '\')">' +
        '<div style="width:44px;height:44px;border-radius:50%;background:' + orgInfo.color + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + orgInfo.ico + '</div>' +
        '<div style="flex:1;min-width:0;">' +
        '<div style="font-weight:700;font-size:14px;">' + orgInfo.name + '</div>' +
        '<div style="font-size:12px;color:var(--t2);margin-top:2px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
        '<div style="font-size:11px;color:var(--t3);margin-top:1px;">👤 ' + (v.name||'') + '</div>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--t3);">›</div>' +
        '</div>';
    }).join('');
  });
}

// ── 채팅방 열기 ──
function openChatRoom(volId) {
  curChatRoom = volId;

  // 기존 리스너 해제
  if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }

  // 모든 탭 숨기고 채팅룸 표시
  ['home','register','orgs','reviews','foster','calendar','chat'].forEach(function(id) {
    var el = document.getElementById('t-' + id);
    if (el) el.style.display = 'none';
  });
  var cr = document.getElementById('s-chatroom');
  cr.style.display = 'flex';
  cr.style.flexDirection = 'column';

  // 채팅방 정보 로드
  db.collection('volunteers').doc(volId).get().then(function(doc) {
    var v = doc.data();
    var orgInfo = ORG_MAP[v.orgEmail] || { name: v.org || '기관', ico: '🏥' };
    document.getElementById('chatroom-title').textContent = orgInfo.ico + ' ' + orgInfo.name;
    document.getElementById('chatroom-sub').textContent = '✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + ' · 👤 ' + (v.name||'');
    var stEl = document.getElementById('chatroom-status');
    stEl.textContent = v.status === 'matched' ? '매칭완료' : '이동완료';
    stEl.style.background = v.status === 'matched' ? '#EFF6FF' : '#E8F7F0';
    stEl.style.color = v.status === 'matched' ? '#2563EB' : '#2D9E6B';
  });

  // 메시지 실시간 로드
  chatUnsubscribe = db.collection('chats').doc(volId).collection('messages')
    .orderBy('createdAt', 'asc')
    .onSnapshot(function(snap) {
      var msgs = document.getElementById('chat-messages');
      if (!msgs) return;
      var user = auth.currentUser;
      // 빈 채팅방 안내
      if (snap.empty) {
        msgs.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">첫 메시지를 보내보세요 🐾</div>';
        return;
      }
      msgs.innerHTML = snap.docs.map(function(doc) {
        var m = doc.data();
        var isMe = user ? m.senderEmail === user.email : m.senderType === 'volunteer';
        var time = m.createdAt ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString('ko', {hour:'2-digit', minute:'2-digit'}) : '';
        return '<div style="display:flex;flex-direction:column;align-items:' + (isMe?'flex-end':'flex-start') + ';">' +
          '<div style="font-size:10px;color:var(--t3);margin-bottom:3px;">' + (m.senderName||'') + '</div>' +
          '<div style="border-radius:' + (isMe?'16px 16px 4px 16px':'16px 16px 16px 4px') + ';padding:10px 13px;font-size:13px;max-width:75%;' +
          (isMe ? 'background:var(--or);color:#fff;' : 'background:var(--wh);color:var(--tx);border:1px solid var(--bd);') + '">' +
          m.text + '</div>' +
          '<div style="font-size:10px;color:var(--t3);margin-top:3px;">' + time + '</div>' +
          '</div>';
      }).join('');
      msgs.scrollTop = msgs.scrollHeight;
    });
}

// ── 채팅방 닫기 ──
function closeChatRoom() {
  if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }
  curChatRoom = null;
  document.getElementById('s-chatroom').style.display = 'none';
  setTab('chat');
}

// ── 메시지 전송 ──
function sendChatMsg() {
  var inp = document.getElementById('chat-input');
  var txt = inp.value.trim();
  if (!txt || !curChatRoom) return;

  var user = auth.currentUser;
  var isOrgUser  = user && !!ORG_MAP[user.email];
  var senderName = user ? (isOrgUser ? ORG_MAP[user.email].name : user.email) : '봉사자';
  var senderType = isOrgUser ? 'org' : 'volunteer';

  inp.value = '';

  db.collection('chats').doc(curChatRoom).collection('messages').add({
    text:        txt,
    senderName:  senderName,
    senderEmail: user ? user.email : null,
    senderType:  senderType,
    createdAt:   firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(e) {
    alert('메시지 전송 실패: ' + e.message);
    inp.value = txt;
  });
}

// ── 매칭 확정 시 채팅방 자동 생성 ──
function createChatRoom(volId, orgName, volName, dogInfoText) {
  db.collection('chats').doc(volId).set({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    orgName: orgName,
    volName: volName
  }, { merge: true }).then(function() {
    // 시스템 메시지 자동 발송 — 강아지 정보 포함
    var sysMsg = '🎉 매칭이 완료되었습니다! 이 채팅방에서 소통해주세요 🐾';
    if (dogInfoText) sysMsg += '\n\n' + dogInfoText;
    db.collection('chats').doc(volId).collection('messages').add({
      text: sysMsg,
      senderName: 'PAWST CLASS',
      senderType: 'system',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  });
}

// ── setTab에 chat 로드 연결 ──
var _origSetTab3 = setTab;
setTab = function(t) {
  _origSetTab3(t);
  if (t === 'chat') loadChatRooms();
};

// ══════════════════════════════
// v2.0 · 슈퍼어드민
// ══════════════════════════════

// 슈퍼어드민 계정 (지안이)
var SUPER_ADMIN_EMAIL = 'pawstclass.1@gmail.com';
var newOrgColor = '#FFF0EB';

// ── 슈퍼어드민 로그인 ──
function doAdminLogin() {
  var email = document.getElementById('admin-email').value.trim();
  var pw    = document.getElementById('admin-pw').value;
  var btn   = document.getElementById('admin-login-btn');
  var err   = document.getElementById('admin-login-err');

  if (!email || !pw) { showAdminErr('이메일과 비밀번호를 입력해 주세요.'); return; }
  if (email !== SUPER_ADMIN_EMAIL) { showAdminErr('슈퍼어드민 계정이 아닙니다.'); return; }

  btn.textContent = '로그인 중...'; btn.style.opacity = '.6';
  err.style.display = 'none';

  auth.signInWithEmailAndPassword(email, pw)
    .then(function() {
      btn.textContent = '로그인'; btn.style.opacity = '1';
      scGo('s-admindash');
      loadAdminDash();
    })
    .catch(function() {
      btn.textContent = '로그인'; btn.style.opacity = '1';
      showAdminErr('이메일 또는 비밀번호가 올바르지 않습니다.');
    });
}

function showAdminErr(msg) {
  var el = document.getElementById('admin-login-err');
  el.textContent = msg; el.style.display = 'block';
}

function doAdminLogout() {
  auth.signOut().then(function() {
    document.getElementById('admin-email').value = '';
    document.getElementById('admin-pw').value = '';
    scGo('s-splash');
  });
}

// ── 어드민 대시보드 로드 ──
function loadAdminDash() {
  // 통계
  db.collection('dogs').get().then(function(s) {
    document.getElementById('stat-dogs').textContent = s.size;
  });
  db.collection('volunteers').get().then(function(s) {
    document.getElementById('stat-vols').textContent = s.size;
  });
  db.collection('volunteers').where('status','==','matched').get().then(function(s) {
    document.getElementById('stat-matched').textContent = s.size;
  });
  db.collection('fosters').get().then(function(s) {
    document.getElementById('stat-fosters').textContent = s.size;
  });

  // 기본 탭 로드
  loadAdminOrgs();
}

// ── 어드민 탭 전환 ──
function setAdminTab(t) {
  ['orgs','match','vols','fosters'].forEach(function(id) {
    document.getElementById('sadm-' + id + '-panel').style.display = id === t ? 'block' : 'none';
    document.getElementById('sadm-tab-' + id).classList.toggle('on', id === t);
  });
  if (t === 'orgs')    loadAdminOrgs();
  if (t === 'match')   loadAdminMatch();
  if (t === 'vols')    loadAdminVols();
  if (t === 'fosters') loadAdminFosters();
}

// ── 기관 목록 ──
function loadAdminOrgs() {
  var listEl = document.getElementById('sadm-org-list');
  // firebase.js의 ORG_MAP 기반 + Firestore orgs 컬렉션
  var orgs = Object.keys(ORG_MAP).map(function(email) {
    return Object.assign({ email: email }, ORG_MAP[email]);
  });

  // Firestore에 추가된 기관도 불러오기
  db.collection('orgs').get().then(function(snap) {
    snap.forEach(function(doc) {
      var d = doc.data();
      if (!ORG_MAP[d.email]) orgs.push(d);
    });
    renderAdminOrgs(orgs, listEl);
  }).catch(function() {
    renderAdminOrgs(orgs, listEl);
  });
}

function renderAdminOrgs(orgs, listEl) {
  listEl.innerHTML = orgs.map(function(org) {
    return '<div style="background:#fff;border-radius:12px;padding:12px 13px;margin-bottom:8px;display:flex;align-items:center;gap:10px;border:1px solid #E8E0D8;">' +
      '<div style="width:40px;height:40px;border-radius:10px;background:' + org.color + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + org.ico + '</div>' +
      '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">' + org.name + '</div>' +
      '<div style="font-size:11px;color:#9CA3AF;">' + org.email + '</div></div>' +
      '<button onclick="removeOrg(\'' + org.email + '\')" style="background:none;border:none;color:#E05A2B;font-size:11px;cursor:pointer;font-family:inherit;font-weight:600;">삭제</button>' +
      '</div>';
  }).join('');
}

// ── 전체 매칭 현황 ──
function loadAdminMatch() {
  var listEl = document.getElementById('sadm-match-list');
  db.collection('volunteers').where('status','in',['matched','done'])
    .orderBy('flightDate','asc')
    .get().then(function(snap) {
      if (snap.empty) { listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:13px;">매칭 내역이 없어요</div>'; return; }
      listEl.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data();
        var stColor = v.status === 'done' ? '#2D9E6B' : '#3B82F6';
        var stBg    = v.status === 'done' ? '#E8F7F0' : '#EFF6FF';
        var stLabel = v.status === 'done' ? '이동완료' : '매칭완료';
        return '<div style="background:#fff;border-radius:12px;padding:11px 13px;margin-bottom:8px;border:1px solid #E8E0D8;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">' +
          '<div style="font-weight:700;font-size:13px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:9px;font-weight:700;background:' + stBg + ';color:' + stColor + ';">' + stLabel + '</span>' +
          '</div>' +
          '<div style="font-size:11px;color:#6B7280;">👤 ' + (v.name||'') + ' · ' + (v.nation||'') + '</div>' +
          (v.orgEmail ? '<div style="font-size:11px;color:#6B7280;">🏥 ' + (ORG_MAP[v.orgEmail]?ORG_MAP[v.orgEmail].name:v.orgEmail) + '</div>' : '') +
          '<div style="display:flex;gap:6px;margin-top:8px;">' +
          (v.status !== 'done' ? '<button onclick="markDone(\'' + doc.id + '\')" style="font-size:11px;padding:4px 10px;border-radius:8px;background:#E8F7F0;color:#2D9E6B;border:none;cursor:pointer;font-family:inherit;font-weight:600;">이동완료 처리</button>' : '') +
          '</div></div>';
      }).join('');
    });
}

// ── 이동완료 처리 ──
function markDone(volId, dogId) {
  if (!confirm('이동완료로 처리할까요?')) return;
  var batch = db.batch();
  batch.update(db.collection('volunteers').doc(volId), { status: 'done' });
  // ── 강아지 status도 동기화 ──
  if (dogId) {
    batch.update(db.collection('dogs').doc(dogId), { status: 'done' });
  }
  batch.commit().then(function() {
    alert('이동완료 처리되었습니다 🐾');
    loadAdminMatch();
    loadAdminDash();
  }).catch(function(e) { alert('오류: ' + e.message); });
}

// ── 전체 봉사자 목록 ──
function loadAdminVols() {
  var listEl = document.getElementById('sadm-vol-list');
  db.collection('volunteers').orderBy('createdAt','desc').get().then(function(snap) {
    if (snap.empty) { listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:13px;">봉사자가 없어요</div>'; return; }
    var sl = { booked:'예약완료', matched:'매칭완료', done:'이동완료' };
    var sb = { booked:'#FFF5E6', matched:'#EFF6FF', done:'#E8F7F0' };
    var sc2 = { booked:'#FF8C00', matched:'#3B82F6', done:'#2D9E6B' };
    listEl.innerHTML = snap.docs.map(function(doc) {
      var v = doc.data(); var st = v.status || 'booked';
      return '<div style="background:#fff;border-radius:12px;padding:11px 13px;margin-bottom:8px;border:1px solid #E8E0D8;display:flex;align-items:center;gap:10px;">' +
        '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">' + (v.name||'이름없음') + '</div>' +
        '<div style="font-size:11px;color:#9CA3AF;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
        '<div style="font-size:11px;color:#9CA3AF;">' + (v.email||'') + (v.kakao?' · 💬 '+v.kakao:'') + '</div></div>' +
        '<span style="font-size:10px;padding:3px 8px;border-radius:9px;font-weight:700;background:' + (sb[st]||'#FFF5E6') + ';color:' + (sc2[st]||'#FF8C00') + ';">' + (sl[st]||st) + '</span>' +
        '</div>';
    }).join('');
  });
}

// ── 임보 신청자 (어드민용) ──
function loadAdminFosters() {
  var listEl = document.getElementById('sadm-foster-list');
  db.collection('fosters').orderBy('createdAt','desc').get().then(function(snap) {
    if (snap.empty) { listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:13px;">임보 신청자가 없어요</div>'; return; }
    listEl.innerHTML = snap.docs.map(function(doc) {
      var f = doc.data();
      var stColor = f.status === 'approved' ? '#2D9E6B' : '#FF8C00';
      var stBg    = f.status === 'approved' ? '#E8F7F0' : '#FFF5E6';
      var stLabel = f.status === 'approved' ? '승인' : '검토중';
      return '<div style="background:#fff;border-radius:12px;padding:11px 13px;margin-bottom:8px;border:1px solid #E8E0D8;display:flex;align-items:center;gap:10px;">' +
        '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">🏠 ' + (f.name||'') + '</div>' +
        '<div style="font-size:11px;color:#9CA3AF;">' + (f.city||'') + ' · ' + (f.homeType||'') + '</div>' +
        '<div style="font-size:11px;color:#9CA3AF;">' + (f.email||'') + '</div></div>' +
        '<span style="font-size:10px;padding:3px 8px;border-radius:9px;font-weight:700;background:' + stBg + ';color:' + stColor + ';">' + stLabel + '</span>' +
        '</div>';
    }).join('');
  });
}

// ── 기관 추가 모달 ──
function opAddOrg() { document.getElementById('add-org-modal').classList.add('on'); }

function selOrgColor(color) {
  newOrgColor = color;
  document.querySelectorAll('.color-swatch').forEach(function(el) {
    el.style.borderColor = el.style.background === color ? '#FF8C00' : 'transparent';
  });
}

function saveNewOrg() {
  var name  = document.getElementById('new-org-name').value.trim();
  var email = document.getElementById('new-org-email').value.trim();
  var ico   = document.getElementById('new-org-ico').value.trim() || '🏥';

  if (!name || !email) { alert('기관명과 이메일을 입력해 주세요.'); return; }

  // ORG_MAP에 추가
  ORG_MAP[email] = { name: name, ico: ico, color: newOrgColor };

  // Firestore에도 저장
  db.collection('orgs').doc(email).set({
    name: name, email: email, ico: ico, color: newOrgColor,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function() {
    clMo('add-org-modal');
    ['new-org-name','new-org-email','new-org-ico'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
    alert('기관이 등록되었습니다! Firebase Console에서 계정도 생성해주세요 🐾');
    loadAdminOrgs();
  }).catch(function(e) { alert('오류: ' + e.message); });
}

function removeOrg(email) {
  if (Object.keys(ORG_MAP).indexOf(email) !== -1 &&
      ['kpups@pawst-class.com','adoptme@pawst-class.com','gamjane@pawst-class.com'].indexOf(email) !== -1) {
    alert('기본 협력 단체는 삭제할 수 없습니다.');
    return;
  }
  if (!confirm(email + ' 기관을 삭제할까요?')) return;
  delete ORG_MAP[email];
  db.collection('orgs').doc(email).delete().then(function() {
    alert('삭제되었습니다.');
    loadAdminOrgs();
  });
}

// ══════════════════════════════
// v2.1 · 버그 수정 추가 함수
// ══════════════════════════════

// ── 강아지 삭제 (기관) ──
function deleteDog(dogId) {
  if (!confirm('이 강아지를 삭제할까요? 삭제 후 복구되지 않습니다.')) return;
  db.collection('dogs').doc(dogId).delete()
    .then(function() { alert('삭제되었습니다.'); })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// ── 매칭 취소 (기관) ──
function cancelMatch(dogId, volId) {
  if (!confirm('매칭을 취소할까요? 취소 후 다시 매칭해야 합니다.')) return;
  var batch = db.batch();
  batch.update(db.collection('dogs').doc(dogId), { status: 'waiting', matchedVol: null });
  if (volId) {
    batch.update(db.collection('volunteers').doc(volId), {
      status: 'booked',
      matchedDog: null,
      matchedDogs: [],
      orgEmail: null
    });
  }
  batch.commit()
    .then(function() {
      alert('매칭이 취소되었습니다.');
      loadAdminMatch(); // 어드민 목록 새로고침
    })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// ── 이동완료 처리 (기관) ──
function orgMarkDone(volId, dogId) {
  if (!confirm('이동완료로 처리할까요?')) return;
  var batch = db.batch();
  if (volId) batch.update(db.collection('volunteers').doc(volId), { status: 'done' });
  if (dogId) batch.update(db.collection('dogs').doc(dogId), { status: 'done' });
  batch.commit()
    .then(function() { alert('이동완료 처리되었습니다 🐾'); })
    .catch(function(e) { alert('오류: ' + e.message); });
}

// ── ORG_MAP Firestore에서 추가 기관 로드 (새로고침 시 유지) ──
function loadOrgMapFromFirestore() {
  db.collection('orgs').get().then(function(snap) {
    snap.forEach(function(doc) {
      var d = doc.data();
      if (d.email && !ORG_MAP[d.email]) {
        ORG_MAP[d.email] = { name: d.name, ico: d.ico || '🏥', color: d.color || '#FFF5E6' };
      }
    });
  }).catch(function() {});
}

// ── 앱 시작 시 ORG_MAP 로드 ──
document.addEventListener('DOMContentLoaded', function() {
  loadOrgMapFromFirestore();
});

// ══════════════════════════════
// v2.1 · 봉사자 로그인/회원가입
// ══════════════════════════════

var currentVolUser = null;

// ── 봉사자 탭 전환 (로그인/회원가입) ──
function setVolTab(t) {
  document.getElementById('vol-login-form').style.display  = t === 'login'  ? 'block' : 'none';
  document.getElementById('vol-signup-form').style.display = t === 'signup' ? 'block' : 'none';
  document.getElementById('vol-tab-login').classList.toggle('on',  t === 'login');
  document.getElementById('vol-tab-signup').classList.toggle('on', t === 'signup');
  document.getElementById('vol-login-err').style.display = 'none';
}

// ── 봉사자 로그인 ──
function doVolLogin() {
  var email = document.getElementById('vol-login-email').value.trim();
  var pw    = document.getElementById('vol-login-pw').value;
  var btn   = document.getElementById('vol-login-btn');
  var isKo  = curLang === 'ko';

  if (!email || !pw) {
    showVolErr(isKo ? '이메일과 비밀번호를 입력해 주세요.' : 'Please enter your email and password.');
    return;
  }
  btn.textContent = isKo ? '로그인 중...' : 'Logging in...';
  btn.style.opacity = '.6';

  auth.signInWithEmailAndPassword(email, pw)
    .then(function(cred) {
      btn.textContent = isKo ? '로그인' : 'Login';
      btn.style.opacity = '1';
      currentVolUser = cred.user;
      onVolLoggedIn(cred.user);
    })
    .catch(function(e) {
      btn.textContent = isKo ? '로그인' : 'Login';
      btn.style.opacity = '1';
      // 계정 없으면 자동 회원가입 유도
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        showVolErr(isKo ? '계정이 없습니다. 회원가입 탭에서 가입해 주세요.' : 'No account found. Please sign up.');
      } else if (e.code === 'auth/wrong-password') {
        showVolErr(isKo ? '비밀번호가 올바르지 않습니다.' : 'Incorrect password.');
      } else if (e.code === 'auth/invalid-email') {
        showVolErr(isKo ? '이메일 형식을 확인해 주세요.' : 'Please check your email format.');
      } else {
        showVolErr(isKo ? '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.' : 'Login error. Please try again.');
      }
    });
}

// ── 봉사자 회원가입 ──
function doVolSignup() {
  var email = document.getElementById('vol-signup-email').value.trim();
  var pw    = document.getElementById('vol-signup-pw').value;
  var pw2   = document.getElementById('vol-signup-pw2').value;
  var btn   = document.getElementById('vol-signup-btn');
  var isKo  = curLang === 'ko';

  if (!email || !pw) {
    showVolErr(isKo ? '이메일과 비밀번호를 입력해 주세요.' : 'Please enter email and password.');
    return;
  }
  if (pw.length < 6) {
    showVolErr(isKo ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.');
    return;
  }
  if (pw !== pw2) {
    showVolErr(isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.');
    return;
  }
  // 기관 이메일로 가입 방지
  if (ORG_MAP[email]) {
    showVolErr(isKo ? '기관 계정으로는 봉사자 가입이 불가합니다.' : 'Organization accounts cannot sign up as volunteers.');
    return;
  }

  btn.textContent = isKo ? '가입 중...' : 'Signing up...';
  btn.style.opacity = '.6';

  auth.createUserWithEmailAndPassword(email, pw)
    .then(function(cred) {
      btn.textContent = isKo ? '회원가입' : 'Sign Up';
      btn.style.opacity = '1';
      currentVolUser = cred.user;
      // Firestore에 봉사자 프로필 저장
      db.collection('vol_users').doc(cred.user.uid).set({
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      onVolLoggedIn(cred.user);
    })
    .catch(function(e) {
      btn.textContent = isKo ? '회원가입' : 'Sign Up';
      btn.style.opacity = '1';
      if (e.code === 'auth/email-already-in-use') {
        showVolErr(isKo ? '이미 가입된 이메일입니다. 로그인 탭을 이용해 주세요.' : 'Email already in use. Please log in instead.');
      } else if (e.code === 'auth/invalid-email') {
        showVolErr(isKo ? '이메일 형식이 올바르지 않습니다. (예: name@gmail.com)' : 'Invalid email format. (e.g. name@gmail.com)');
      } else if (e.code === 'auth/weak-password') {
        showVolErr(isKo ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.');
      } else if (e.code === 'auth/missing-email') {
        showVolErr(isKo ? '이메일을 입력해 주세요.' : 'Please enter your email.');
      } else if (e.code === 'auth/network-request-failed') {
        showVolErr(isKo ? '네트워크 연결을 확인해 주세요.' : 'Please check your network connection.');
      } else if (e.code === 'auth/too-many-requests') {
        showVolErr(isKo ? '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' : 'Too many requests. Please try again later.');
      } else {
        showVolErr(isKo ? '가입 중 오류가 발생했습니다. 다시 시도해 주세요. (' + e.code + ')' : 'Signup error. Please try again. (' + e.code + ')');
      }
    });
}

function showVolErr(msg) {
  var el = document.getElementById('vol-login-err');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ── 로그인 후 처리 ──
function onVolLoggedIn(user) {
  currentVolUser = user;
  updateHomeUsername(user);
  goVolHome();
}

function updateHomeUsername(user) {
  var nameEl = document.getElementById('home-username');
  var avatarEl = document.getElementById('home-avatar');
  if (user && nameEl) {
    var displayName = user.email.split('@')[0];
    nameEl.textContent = displayName;
  }
  if (avatarEl) {
    avatarEl.style.background = user ? 'var(--orL)' : 'var(--bg)';
  }
}

// ── 봉사자 홈으로 이동 ──
function goVolHome() {
  scGo('s-main');
  setTab('home');
}

// ── 봉사자 프로필 화면 ──
function goVolProfile() {
  var user = auth.currentUser;
  if (!user || ORG_MAP[user.email]) {
    // 비로그인 또는 기관 → 로그인 화면으로
    scGo('s-vollogin');
    return;
  }
  // 프로필 화면 표시
  ['home','register','orgs','reviews','foster','calendar','chat'].forEach(function(id) {
    var el = document.getElementById('t-' + id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('s-chatroom').style.display = 'none';
  var pf = document.getElementById('s-volprofile');
  pf.style.display = 'flex';
  pf.style.flexDirection = 'column';

  // 이름 표시 (이름 없으면 이메일)
  var emailEl = document.getElementById('prof-email');
  if (emailEl) {
    // Firestore에서 이름 조회
    db.collection('volunteers').where('email','==',user.email).orderBy('createdAt','desc').limit(1).get()
      .then(function(s) {
        if (!s.empty && s.docs[0].data().name) {
          emailEl.textContent = s.docs[0].data().name;
        } else {
          emailEl.textContent = user.email;
        }
      }).catch(function() { emailEl.textContent = user.email; });
  }

  // 내 항공편 불러오기
  loadMyFlights(user.email);
}

function closeVolProfile() {
  document.getElementById('s-volprofile').style.display = 'none';
  setTab('home');
}

// ── 내 항공편 현황 ──
function loadMyFlights(email) {
  var listEl = document.getElementById('vol-my-flights');
  if (!listEl) return;
  var isKo = curLang === 'ko';

  db.collection('volunteers')
    .where('email', '==', email)
    .orderBy('createdAt', 'desc')
    .get()
    .then(function(snap) {
      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:13px;">' +
          (isKo ? '등록된 항공편이 없어요' : 'No flights registered') + '</div>';
        return;
      }
      var stMap_ko = { booked:'예약완료', matched:'매칭완료', done:'이동완료' };
      var stMap_en = { booked:'Booked', matched:'Matched', done:'Completed' };
      var stColor  = { booked:'#FF8C00', matched:'#3B82F6', done:'#2D9E6B' };
      var stBg     = { booked:'#FFF5E6', matched:'#EFF6FF', done:'#E8F7F0' };

      listEl.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data(); var st = v.status || 'booked';
        var stLabel = isKo ? (stMap_ko[st]||st) : (stMap_en[st]||st);
        return '<div class="card" style="margin-bottom:8px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
          '<div style="font-weight:700;font-size:14px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + '</div>' +
          '<span style="font-size:11px;padding:3px 9px;border-radius:9px;font-weight:700;background:' + (stBg[st]||'#FFF5E6') + ';color:' + (stColor[st]||'#FF8C00') + ';">' + stLabel + '</span>' +
          '</div>' +
          '<div style="font-size:12px;color:var(--t2);">ICN → ATL · ' + (v.flightDate||'') + '</div>' +
          (v.kakao ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">💬 ' + v.kakao + '</div>' : '') +
          (st === 'matched' ? '<div style="font-size:12px;color:var(--gr);margin-top:4px;font-weight:600;">🎉 ' + (isKo?'매칭완료! 기관에서 연락이 올 거예요':'Matched! The org will contact you.') + '</div>' : '') +
          '</div>';
      }).join('');
    })
    .catch(function(e) {
      listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--re);font-size:13px;">오류: ' + e.message + '</div>';
    });
}

// ── 봉사자 로그아웃 ──
function doVolLogout() {
  auth.signOut().then(function() {
    currentVolUser = null;
    var nameEl = document.getElementById('home-username');
    if (nameEl) nameEl.textContent = curLang === 'ko' ? '게스트' : 'Guest';
    closeVolProfile();
    scGo('s-splash');
  });
}

// ── 채팅탭 v2.3: 봉사자/기관 모두 명확한 채팅방 목록 ──
var _origLoadChatRooms = loadChatRooms;
loadChatRooms = function() {
  var user   = auth.currentUser;
  var listEl = document.getElementById('chat-room-list');
  if (!listEl) return;
  var isKo = curLang === 'ko';

  // ── 비로그인 ──
  if (!user) {
    listEl.innerHTML = '<div style="text-align:center;padding:40px 20px;">' +
      '<div style="font-size:36px;margin-bottom:10px;">💬</div>' +
      '<div style="font-size:13px;color:var(--t2);margin-bottom:16px;">' +
      (isKo ? '채팅은 로그인 후 이용 가능합니다' : 'Please login to access chat') + '</div>' +
      '<button class="btn-pr" onclick="scGo(\'s-vollogin\')" style="width:auto;padding:10px 24px;">' +
      (isKo ? '로그인하기' : 'Login') + '</button></div>';
    return;
  }

  listEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);font-size:13px;">불러오는 중...</div>';

  // ── 기관 로그인 ──
  if (ORG_MAP[user.email]) {
    db.collection('volunteers')
      .where('status', 'in', ['matched', 'done'])
      .orderBy('flightDate', 'asc')
      .get()
      .then(function(snap) {
        // 내 기관과 매칭된 봉사자만 필터
        var mine = snap.docs.filter(function(d) {
          return d.data().orgEmail === user.email;
        });
        if (!mine.length) {
          listEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--t3);font-size:13px;">' +
            '<div style="font-size:36px;margin-bottom:10px;">💬</div>' +
            '<div>' + (isKo ? '매칭 완료 후 채팅방이 생성됩니다' : 'Chat rooms open after matching') + '</div></div>';
          return;
        }
        listEl.innerHTML = mine.map(function(doc) {
          var v = doc.data(); var vid = doc.id;
          var stBg2   = v.status === 'done' ? '#E8F7F0' : '#EFF6FF';
          var stClr2  = v.status === 'done' ? '#2D9E6B' : '#2563EB';
          var stLbl   = isKo ? (v.status==='done'?'이동완료':'매칭완료') : (v.status==='done'?'Completed':'Matched');
          var dogCnt  = (v.matchedDogs && v.matchedDogs.length) ? v.matchedDogs.length : (v.matchedDog ? 1 : 0);
          var dogBadge = dogCnt ? '<span style="font-size:10px;background:#FFF5E6;color:#FF8C00;padding:2px 7px;border-radius:9px;font-weight:700;margin-left:4px;">🐾 ' + dogCnt + (isKo?'마리':'dog'+(dogCnt>1?'s':'')) + '</span>' : '';
          return '<div class="card" style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:13px 14px;margin-bottom:8px;" onclick="openChatRoom(\'' + vid + '\')">' +
            '<div style="width:44px;height:44px;border-radius:50%;background:#FFF0EB;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">👤</div>' +
            '<div style="flex:1;min-width:0;">' +
            '<div style="font-weight:700;font-size:14px;display:flex;align-items:center;gap:4px;">' + (v.name||'봉사자') + dogBadge + '</div>' +
            '<div style="font-size:12px;color:var(--t2);margin-top:2px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
            '<div style="font-size:11px;color:var(--t3);margin-top:1px;">' + (v.email||'') + (v.kakao?' · 💬 '+v.kakao:'') + '</div>' +
            '</div>' +
            '<span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:9px;background:' + stBg2 + ';color:' + stClr2 + ';flex-shrink:0;">' + stLbl + '</span>' +
            '</div>';
        }).join('');
      })
      .catch(function() {
        listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--re);font-size:13px;">' +
          (isKo ? '잠시 후 다시 시도해 주세요.' : 'Please try again later.') + '</div>';
      });
    return;
  }

  // ── 봉사자 로그인 ──
  db.collection('volunteers')
    .where('email', '==', user.email)
    .where('status', 'in', ['matched', 'done'])
    .get()
    .then(function(snap) {
      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--t3);font-size:13px;">' +
          '<div style="font-size:36px;margin-bottom:10px;">💬</div>' +
          '<div>' + (isKo ? '매칭 완료 후 채팅방이 생성됩니다' : 'Chat rooms open after matching') + '</div></div>';
        return;
      }
      listEl.innerHTML = snap.docs.map(function(doc) {
        var v = doc.data(); var vid = doc.id;
        var orgInfo = ORG_MAP[v.orgEmail] || { name: v.org||'기관', ico:'🏥', color:'#FFF5E6' };
        var stBg2   = v.status === 'done' ? '#E8F7F0' : '#EFF6FF';
        var stClr2  = v.status === 'done' ? '#2D9E6B' : '#2563EB';
        var stLbl   = isKo ? (v.status==='done'?'이동완료':'매칭완료') : (v.status==='done'?'Completed':'Matched');
        return '<div class="card" style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:13px 14px;margin-bottom:8px;" onclick="openChatRoom(\'' + vid + '\')">' +
          '<div style="width:44px;height:44px;border-radius:50%;background:' + orgInfo.color + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + orgInfo.ico + '</div>' +
          '<div style="flex:1;min-width:0;">' +
          '<div style="font-weight:700;font-size:14px;">' + orgInfo.name + '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-top:2px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
          '<div style="font-size:11px;color:#6B7280;margin-top:1px;">🏥 ' + (isKo?'매칭된 기관':'Matched organization') + '</div>' +
          '</div>' +
          '<span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:9px;background:' + stBg2 + ';color:' + stClr2 + ';flex-shrink:0;">' + stLbl + '</span>' +
          '</div>';
      }).join('');
    })
    .catch(function() {
      listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--re);font-size:13px;">' +
        (isKo ? '잠시 후 다시 시도해 주세요.' : 'Please try again later.') + '</div>';
    });
};

// ── 기관 대시보드 채팅 목록 ──
function loadOrgChatList() {
  var listEl = document.getElementById('org-chatlist');
  if (!listEl) return;
  var user = auth.currentUser;
  if (!user) return;
  var isKo = curLang === 'ko';

  listEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);font-size:13px;">불러오는 중...</div>';

  db.collection('volunteers')
    .where('status', 'in', ['matched', 'done'])
    .orderBy('flightDate', 'asc')
    .get()
    .then(function(snap) {
      var mine = snap.docs.filter(function(d) { return d.data().orgEmail === user.email; });
      if (!mine.length) {
        listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">매칭 완료 후 채팅방이 생성됩니다 💬</div>';
        return;
      }
      listEl.innerHTML = mine.map(function(doc) {
        var v = doc.data(); var vid = doc.id;
        var stBg2  = v.status === 'done' ? '#E8F7F0' : '#EFF6FF';
        var stClr2 = v.status === 'done' ? '#2D9E6B' : '#2563EB';
        var stLbl  = isKo ? (v.status==='done'?'이동완료':'매칭완료') : (v.status==='done'?'Completed':'Matched');
        var dogCnt = (v.matchedDogs && v.matchedDogs.length) ? v.matchedDogs.length : (v.matchedDog ? 1 : 0);
        var dogBadge = dogCnt ? ' 🐾 ' + dogCnt + (isKo?'마리':'') : '';
        return '<div class="card" style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:13px 14px;margin-bottom:8px;" onclick="openOrgChatRoom(\'' + vid + '\')">' +
          '<div style="width:44px;height:44px;border-radius:50%;background:#FFF0EB;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">👤</div>' +
          '<div style="flex:1;min-width:0;">' +
          '<div style="font-weight:700;font-size:14px;">' + (v.name||'봉사자') + dogBadge + '</div>' +
          '<div style="font-size:12px;color:var(--t2);margin-top:2px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
          (v.kakao ? '<div style="font-size:11px;color:var(--t3);">💬 카카오: ' + v.kakao + '</div>' : '') +
          '</div>' +
          '<span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:9px;background:' + stBg2 + ';color:' + stClr2 + ';flex-shrink:0;">' + stLbl + '</span>' +
          '</div>';
      }).join('');
    })
    .catch(function() {
      // fallback — 인덱스 없는 경우
      listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--re);font-size:13px;">' +
        (isKo ? '잠시 후 다시 시도해 주세요.' : 'Please try again later.') + '</div>';
    });
}

// 기관이 대시보드에서 채팅방 열기
function openOrgChatRoom(volId) {
  // s-orgdash를 .sc 방식으로 숨기고 채팅방 표시
  document.querySelectorAll('.sc').forEach(function(el) { el.classList.remove('on'); });

  // 채팅방 직접 표시
  curChatRoom = volId;
  if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }

  var cr = document.getElementById('s-chatroom');
  cr.style.display = 'flex';
  cr.style.flexDirection = 'column';

  // 채팅방 정보 로드 — 기관 시점: 봉사자 이름/항공편 표시
  db.collection('volunteers').doc(volId).get().then(function(doc) {
    if (!doc.exists) return;
    var v = doc.data();
    document.getElementById('chatroom-title').textContent = '👤 ' + (v.name || '봉사자');
    document.getElementById('chatroom-sub').textContent = '✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + (v.kakao ? ' · 💬 ' + v.kakao : '');
    var stEl = document.getElementById('chatroom-status');
    stEl.textContent = v.status === 'matched' ? '매칭완료' : '이동완료';
    stEl.style.background = v.status === 'matched' ? '#EFF6FF' : '#E8F7F0';
    stEl.style.color = v.status === 'matched' ? '#2563EB' : '#2D9E6B';
  });

  // 메시지 실시간 로드
  chatUnsubscribe = db.collection('chats').doc(volId).collection('messages')
    .orderBy('createdAt', 'asc')
    .onSnapshot(function(snap) {
      var msgs = document.getElementById('chat-messages');
      if (!msgs) return;
      var user = auth.currentUser;
      if (snap.empty) {
        msgs.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">첫 메시지를 보내보세요 🐾</div>';
        return;
      }
      msgs.innerHTML = snap.docs.map(function(d) {
        var m = d.data();
        var isMe = user && m.senderEmail === user.email;
        var time = m.createdAt ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString('ko', {hour:'2-digit', minute:'2-digit'}) : '';
        return '<div style="display:flex;flex-direction:column;align-items:' + (isMe?'flex-end':'flex-start') + ';">' +
          '<div style="font-size:10px;color:var(--t3);margin-bottom:3px;">' + (m.senderName||'') + '</div>' +
          '<div style="border-radius:' + (isMe?'16px 16px 4px 16px':'16px 16px 16px 4px') + ';padding:10px 13px;font-size:13px;max-width:75%;white-space:pre-wrap;' +
          (isMe ? 'background:var(--or);color:#fff;' : 'background:var(--wh);color:var(--tx);border:1px solid var(--bd);') + '">' +
          m.text + '</div>' +
          '<div style="font-size:10px;color:var(--t3);margin-top:3px;">' + time + '</div>' +
          '</div>';
      }).join('');
      msgs.scrollTop = msgs.scrollHeight;
    });

  // 닫기 버튼 → 기관 대시보드로 복귀
  var _prevClose = closeChatRoom;
  closeChatRoom = function() {
    if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }
    curChatRoom = null;
    cr.style.display = 'none';
    // 기관 대시보드 복귀
    document.querySelectorAll('.sc').forEach(function(el) { el.classList.remove('on'); });
    var orgDash = document.getElementById('s-orgdash');
    if (orgDash) orgDash.classList.add('on');
    closeChatRoom = _prevClose;
  };
}


auth.onAuthStateChanged(function(user) {
  if (user) {
    // 슈퍼어드민
    if (user.email === SUPER_ADMIN_EMAIL) return;
    // 기관
    if (ORG_MAP[user.email]) return;
    // 봉사자
    currentVolUser = user;
    updateHomeUsername(user);

    // ── 매칭 완료 팝업 (이동완료 전까지 로그인 시마다 표시) ──
    db.collection('volunteers')
      .where('email', '==', user.email)
      .where('status', '==', 'matched')
      .get()
      .then(function(snap) {
        if (snap.empty) return;
        var v   = snap.docs[0].data();
        var vid = snap.docs[0].id;
        var isKo = curLang === 'ko';
        var orgInfo = ORG_MAP[v.orgEmail] || { name: v.org || (isKo ? '기관' : 'Organization'), ico:'🏥' };

        // 팝업 생성 — 스플래시 완료 후 표시
        var showPopup = function() {
          var existing = document.getElementById('match-notify-popup');
          if (existing) existing.remove();

          var popup = document.createElement('div');
          popup.id = 'match-notify-popup';
          popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
        popup.innerHTML =
          '<div style="background:var(--wh);border-radius:20px;width:100%;max-width:360px;padding:24px;text-align:center;">' +
          '<div style="font-size:44px;margin-bottom:10px;">🎉</div>' +
          '<div style="font-size:17px;font-weight:800;margin-bottom:6px;">' + (isKo?'매칭 완료!':'Match Complete!') + '</div>' +
          '<div style="font-size:13px;color:var(--t2);margin-bottom:14px;">' +
          (isKo ? '기관과 매칭되었습니다.' : 'You have been matched with an organization.') + '</div>' +
          '<div style="background:#FFF5E6;border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">' +
          '<div style="font-size:12px;color:#FF8C00;font-weight:700;margin-bottom:6px;">🐾 ' + (isKo?'매칭 정보':'Match Info') + '</div>' +
          '<div style="font-size:13px;">🏥 ' + orgInfo.ico + ' ' + orgInfo.name + '</div>' +
          '<div style="font-size:13px;margin-top:4px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + ' · ' + (v.flightDate||'') + '</div>' +
          (snap.docs[0].data().matchedDogs && snap.docs[0].data().matchedDogs.length
            ? '<div style="font-size:13px;margin-top:4px;">🐾 ' + snap.docs[0].data().matchedDogs.length + (isKo?'마리 배정':'dogs assigned') + '</div>' : '') +
          '</div>' +
          '<button onclick="document.getElementById(\'match-notify-popup\').remove();openVolChatRoom(\'' + vid + '\')" ' +
          'style="width:100%;background:var(--or);color:#fff;border:none;border-radius:14px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px;">💬 ' +
          (isKo?'채팅방 바로 가기':'Go to Chat') + '</button>' +
          '<button onclick="document.getElementById(\'match-notify-popup\').remove()" ' +
          'style="width:100%;background:none;border:none;padding:10px;font-size:13px;color:var(--t2);cursor:pointer;font-family:inherit;">' +
          (isKo?'나중에 확인하기':'Remind me later') + '</button>' +
          '</div>';
          document.body.appendChild(popup);
        };

        // 스플래시가 아직 표시 중이면 완료 후 표시
        var checkAndShow = function() {
          var splashEl = document.getElementById('splash-screen');
          if (splashEl && splashEl.style.display !== 'none') {
            // 아직 스플래시 중 — 0.5초마다 다시 확인
            setTimeout(checkAndShow, 500);
          } else {
            // 스플래시 완료 — 0.5초 여유 후 팝업
            setTimeout(showPopup, 500);
          }
        };
        checkAndShow();
      })
      .catch(function() {});
  }
});

// ══════════════════════════════════════════
// v2.1 · 19개 수정 추가 기능
// ══════════════════════════════════════════

// ── Fix 4 v2.5: 봉사자 항공편 전체 필드 수정 모달 ──
function editMyFlight(volId) {
  db.collection('volunteers').doc(volId).get().then(function(doc) {
    if (!doc.exists) { alert('항공편 정보를 찾을 수 없습니다.'); return; }
    var v = doc.data();
    var isKo = curLang === 'ko';

    // 모달 HTML 동적 생성
    var existing = document.getElementById('edit-flight-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'edit-flight-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;';
    modal.innerHTML =
      '<div style="background:var(--wh);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px;max-height:90vh;overflow-y:auto;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
      '<div style="font-size:16px;font-weight:800;">' + (isKo ? '✏️ 항공편 정보 수정' : '✏️ Edit Flight Info') + '</div>' +
      '<button onclick="document.getElementById(\'edit-flight-modal\').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--t2);">×</button>' +
      '</div>' +

      // 항공사 칩
      '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:6px;">' + (isKo?'항공사':'Airline') + '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:14px;" id="edit-airline-chips">' +
      ['대한항공 KE','아시아나 OZ','에어프레미아 RS'].map(function(a) {
        var on = (v.airline||'') === a ? ' on' : '';
        return '<button class="chip' + on + '" onclick="editChip(this)" style="flex:1;padding:8px 0;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">' + a + '</button>';
      }).join('') +
      '</div>' +

      // 항공편 번호
      '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:6px;">' + (isKo?'항공편 번호':'Flight No.') + '</div>' +
      '<input id="edit-fno" class="fi" value="' + (v.flightNo||'') + '" placeholder="KE 035" style="margin-bottom:14px;">' +

      // 출발 날짜
      '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:6px;">' + (isKo?'출발 날짜':'Departure Date') + '</div>' +
      '<input id="edit-fdate" type="date" class="fi" value="' + (v.flightDate||'') + '" style="margin-bottom:14px;">' +

      // 이름
      '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:6px;">' + (isKo?'이름 (영문)':'Full Name') + '</div>' +
      '<input id="edit-fname" class="fi" value="' + (v.name||'') + '" placeholder="Hong Gil Dong" style="margin-bottom:14px;">' +

      // 국적
      '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:6px;">' + (isKo?'국적':'Nationality') + '</div>' +
      '<input id="edit-fnation" class="fi" value="' + (v.nation||'') + '" placeholder="Korean" style="margin-bottom:14px;">' +

      // 카카오ID
      '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:6px;">카카오 ID</div>' +
      '<input id="edit-fkakao" class="fi" value="' + (v.kakao||'') + '" placeholder="kakao_id" style="margin-bottom:14px;">' +

      // 연락처
      '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:6px;">' + (isKo?'연락처':'Phone') + '</div>' +
      '<input id="edit-fphone" class="fi" value="' + (v.phone||'') + '" placeholder="+1-404-000-0000" style="margin-bottom:20px;">' +

      '<div id="edit-flight-err" style="display:none;color:var(--re);font-size:12px;margin-bottom:10px;"></div>' +
      '<button onclick="saveMyFlight(\'' + volId + '\')" class="btn-pr">' + (isKo?'저장하기':'Save Changes') + '</button>' +
      '<button onclick="document.getElementById(\'edit-flight-modal\').remove()" class="btn-sec" style="margin-top:8px;">' + (isKo?'취소':'Cancel') + '</button>' +
      '</div>';

    document.body.appendChild(modal);
  }).catch(function(e) { alert('오류: ' + e.message); });
}

function editChip(el) {
  document.querySelectorAll('#edit-airline-chips .chip').forEach(function(c) { c.classList.remove('on'); });
  el.classList.add('on');
}

function saveMyFlight(volId) {
  var isKo    = curLang === 'ko';
  var airline = '';
  document.querySelectorAll('#edit-airline-chips .chip.on').forEach(function(c) { airline = c.textContent.trim(); });
  var flightNo   = (document.getElementById('edit-fno').value||'').trim().toUpperCase();
  var flightDate = (document.getElementById('edit-fdate').value||'').trim();
  var name       = (document.getElementById('edit-fname').value||'').trim();
  var nation     = (document.getElementById('edit-fnation').value||'').trim();
  var kakao      = (document.getElementById('edit-fkakao').value||'').trim();
  var phone      = (document.getElementById('edit-fphone').value||'').trim();
  var errEl      = document.getElementById('edit-flight-err');

  if (!flightNo || !flightDate) {
    errEl.textContent = isKo ? '항공편 번호와 날짜는 필수입니다.' : 'Flight number and date are required.';
    errEl.style.display = 'block';
    return;
  }
  var today = new Date(); today.setHours(0,0,0,0);
  if (new Date(flightDate) < today) {
    errEl.textContent = isKo ? '출발 날짜는 오늘 이후여야 합니다.' : 'Date must be in the future.';
    errEl.style.display = 'block';
    return;
  }

  db.collection('volunteers').doc(volId).update({
    airline: airline, flightNo: flightNo, flightDate: flightDate,
    name: name, nation: nation, kakao: kakao, phone: phone
  }).then(function() {
    document.getElementById('edit-flight-modal').remove();
    alert(isKo ? '수정되었습니다 🐾' : 'Updated successfully 🐾');
    var user = auth.currentUser;
    if (user) loadMyFlights(user.email);
  }).catch(function(e) { alert('오류: ' + e.message); });
}

function deleteMyFlight(volId) {
  var isKo = curLang === 'ko';
  // 상태 확인 후 삭제 방지
  db.collection('volunteers').doc(volId).get().then(function(doc) {
    if (!doc.exists) { alert(isKo ? '항공편을 찾을 수 없습니다.' : 'Flight not found.'); return; }
    var st = doc.data().status;
    if (st === 'matched' || st === 'done') {
      alert(isKo ? '매칭 또는 이동완료 상태의 항공편은 삭제할 수 없습니다. 취소가 필요하면 관리자에게 문의하세요.' : 'Cannot delete a matched or completed flight. Contact admin to cancel.');
      return;
    }
    if (!confirm(isKo ? '항공편 등록을 삭제할까요? 삭제 후 복구되지 않습니다.' :
                        'Delete this flight? This cannot be undone.')) return;
    db.collection('volunteers').doc(volId).delete()
      .then(function() {
        alert(isKo ? '삭제되었습니다.' : 'Deleted.');
        var user = auth.currentUser;
        if (user) loadMyFlights(user.email);
      })
      .catch(function(e) { alert('오류: ' + e.message); });
  }).catch(function(e) { alert('오류: ' + e.message); });
}

// ── Fix 5: 카카오ID 복사 버튼 ──
function copyKakao(kakaoId) {
  if (!kakaoId) return;
  navigator.clipboard.writeText(kakaoId).then(function() {
    alert('카카오ID 복사됨: ' + kakaoId);
  }).catch(function() {
    prompt('카카오ID를 복사하세요:', kakaoId);
  });
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(function() {
    alert('복사됨: ' + text);
  }).catch(function() {
    prompt('복사하세요:', text);
  });
}

// ── Fix 6: 비밀번호 찾기 ──
function sendPasswordReset(emailVal, isVol) {
  if (!emailVal) {
    var el = isVol ? document.getElementById('vol-login-email') : document.getElementById('org-email');
    emailVal = el ? el.value.trim() : '';
  }
  if (!emailVal) {
    alert('이메일을 먼저 입력해 주세요.');
    return;
  }
  auth.sendPasswordResetEmail(emailVal)
    .then(function() {
      alert('비밀번호 재설정 이메일을 보냈습니다.\n' + emailVal + '\n메일함을 확인해 주세요.');
    })
    .catch(function(e) {
      if (e.code === 'auth/user-not-found') {
        alert('등록되지 않은 이메일입니다.');
      } else {
        alert('오류: ' + e.message);
      }
    });
}

// ── Fix 7: 자동 로그인 유지 + 아이디 저장 ──
function saveEmailToStorage(email, isVol) {
  try {
    if (isVol) localStorage.setItem('pawst_vol_email', email);
    else localStorage.setItem('pawst_org_email', email);
  } catch(e) {}
}

function loadSavedEmail(isVol) {
  try {
    return isVol ? localStorage.getItem('pawst_vol_email') : localStorage.getItem('pawst_org_email');
  } catch(e) { return null; }
}

// 저장된 이메일 자동 입력
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var volEmail = loadSavedEmail(true);
    if (volEmail) {
      var el = document.getElementById('vol-login-email');
      if (el) el.value = volEmail;
    }
    var orgEmail = loadSavedEmail(false);
    if (orgEmail) {
      var el2 = document.getElementById('org-email');
      if (el2) el2.value = orgEmail;
    }
  }, 500);
});

// ── Fix 8: 강아지 수정 기능 (기관) ──
var editingDogId = null;
function editDog(dogId, data) {
  editingDogId = dogId;
  // 폼에 기존 데이터 채우기
  document.getElementById('dog-name').value  = data.name  || '';
  document.getElementById('dog-breed').value = data.breed || '';
  document.getElementById('dog-weight').value= data.weight|| '';
  document.getElementById('dog-age').value   = data.age   || '';
  document.getElementById('dog-date-from').value = data.dateFrom || '';
  document.getElementById('dog-date-to').value   = data.dateTo   || '';
  document.getElementById('dog-memo').value  = data.memo  || '';
  if (data.urgent) setUrg(true);
  // 사진 미리보기
  if (data.photo) {
    dogPhotoBase64 = data.photo;
    var prev = document.getElementById('dog-photo-preview');
    if (prev) { prev.src = data.photo; prev.style.display = 'block'; }
  }
  // 버튼 텍스트 변경
  var btn = document.getElementById('dog-submit-btn');
  if (btn) btn.textContent = '수정 완료 🐾';
  // 강아지 폼으로 이동
  scGo('s-dogform');
}

// submitDog에서 수정 모드 처리 (editingDogId가 있으면 update)
var _origSubmitDog = submitDog;
submitDog = function() {
  if (!editingDogId) { _origSubmitDog(); return; }

  var name     = document.getElementById('dog-name').value.trim();
  var breed    = document.getElementById('dog-breed').value.trim();
  var weight   = document.getElementById('dog-weight').value.trim();
  var age      = document.getElementById('dog-age').value.trim();
  var dateFrom = document.getElementById('dog-date-from').value;
  var dateTo   = document.getElementById('dog-date-to').value;
  var memo     = document.getElementById('dog-memo').value.trim();
  var btn      = document.getElementById('dog-submit-btn');

  if (!name || !breed || !weight || !dateFrom || !dateTo) {
    showErr('dogform-err','이름, 견종, 몸무게, 이동 기간은 필수입니다.');
    return;
  }
  if (dateTo < dateFrom) {
    showErr('dogform-err','종료일은 시작일 이후여야 합니다.');
    return;
  }

  btn.textContent = '수정 중...'; btn.style.opacity = '.6';
  db.collection('dogs').doc(editingDogId).update({
    name: name, breed: breed, weight: parseFloat(weight),
    age: age, dateFrom: dateFrom, dateTo: dateTo,
    urgent: isUrgent, memo: memo,
    photo: dogPhotoBase64 || null
  }).then(function() {
    btn.textContent = '수정 완료 🐾'; btn.style.opacity = '1';
    editingDogId = null;
    rmDogPhoto(); setUrg(false);
    var user = auth.currentUser;
    if (user) loadOrgDogs(user.email);
    scGo('s-orgdash');
    alert('수정되었습니다 🐾');
  }).catch(function(e) {
    btn.textContent = '수정 완료 🐾'; btn.style.opacity = '1';
    showErr('dogform-err','오류: ' + e.message);
  });
};

// ── Fix 9: 로그아웃 후 뒤로가기 방지 ──
function safeLogout() {
  auth.signOut().then(function() {
    // history 스택 클리어
    window.history.replaceState(null, '', window.location.href);
    scGo('s-splash');
  });
}

// ── Fix 10: 봉사자 탭 매칭완료/대기중 구분 ──
// loadOrgVols 함수 오버라이드
var _origLoadOrgVols = typeof loadOrgVols === 'function' ? loadOrgVols : null;

function loadOrgVolsV2(email) {
  var listEl = document.getElementById('org-vollist');
  if (!listEl) return;
  var isKo = curLang === 'ko';

  db.collection('volunteers')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function(snap) {
      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">' +
          (isKo ? '대기 중인 봉사자가 없어요 ✈️' : 'No volunteers yet ✈️') + '</div>';
        return;
      }

      // 대기중 / 매칭완료 분리
      var booked = [], matched = [], done2 = [];
      snap.forEach(function(doc) {
        var v = doc.data(); var vid = doc.id;
        if (v.status === 'booked') booked.push({id:vid, data:v});
        else if (v.status === 'matched') matched.push({id:vid, data:v});
        else done2.push({id:vid, data:v});
      });

      var html = '';

      // 대기중 섹션
      if (booked.length > 0) {
        html += '<div style="font-size:11px;font-weight:700;color:var(--or);margin:8px 0 6px;">✈️ ' +
          (isKo ? '대기 중 · 매칭 가능' : 'Available · Waiting') + ' (' + booked.length + ')</div>';
        booked.forEach(function(item) {
          html += renderVolCard(item.id, item.data, isKo, true);
        });
      }

      // 매칭완료 섹션
      if (matched.length > 0) {
        html += '<div style="font-size:11px;font-weight:700;color:var(--sk);margin:12px 0 6px;">✅ ' +
          (isKo ? '매칭완료' : 'Matched') + ' (' + matched.length + ')</div>';
        matched.forEach(function(item) {
          html += renderVolCard(item.id, item.data, isKo, false);
        });
      }

      if (!booked.length && !matched.length) {
        html = '<div style="text-align:center;padding:30px;color:var(--t3);font-size:13px;">' +
          (isKo ? '대기 중인 봉사자가 없어요 ✈️' : 'No volunteers yet ✈️') + '</div>';
      }

      listEl.innerHTML = html;
    }, function() {
      // Firestore index 에러 처리
      listEl.innerHTML = '<div style="background:#FFF5E6;border-radius:12px;padding:14px;font-size:12px;color:#854F0B;line-height:1.7;">' +
        '⚠️ ' + (isKo ? 'Firestore 인덱스 설정이 필요합니다.<br>관리자(pawstclass.1@gmail.com)에게 문의해 주세요.' :
        'Firestore index setup required.<br>Please contact pawstclass.1@gmail.com') + '</div>';
    });
}

function renderVolCard(vid, v, isKo, canMatch) {
  var stColor = v.status === 'matched' ? '#3B82F6' : '#FF8C00';
  var stBg    = v.status === 'matched' ? '#EFF6FF' : '#FFF5E6';
  var stLabel = v.status === 'matched' ? (isKo?'매칭완료':'Matched') : (isKo?'대기중':'Waiting');
  return '<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;border:1px solid var(--bd);">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
    '<div style="font-weight:700;font-size:13px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + '</div>' +
    '<span style="font-size:10px;padding:2px 8px;border-radius:9px;font-weight:700;background:' + stBg + ';color:' + stColor + ';">' + stLabel + '</span>' +
    '</div>' +
    '<div style="font-size:12px;color:var(--t2);">📅 ' + (v.flightDate||'') + ' · ICN→ATL</div>' +
    '<div style="font-size:12px;color:var(--t2);">👤 ' + (v.name||'') + ' · ' + (v.nation||'') + '</div>' +
    '<div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap;">' +
    (v.kakao ? '<button onclick="copyKakao(\'' + v.kakao + '\')" style="font-size:10px;padding:3px 8px;border-radius:8px;background:#FEF08A;color:#854D0E;border:none;cursor:pointer;font-family:inherit;">💬 ' + v.kakao + '</button>' : '') +
    (v.phone ? '<button onclick="copyText(\'' + v.phone + '\')" style="font-size:10px;padding:3px 8px;border-radius:8px;background:#E8F7F0;color:#2D9E6B;border:none;cursor:pointer;font-family:inherit;">📞 ' + v.phone + '</button>' : '') +
    (canMatch ? '<button onclick="opMatch(\'' + vid + '\')" style="font-size:10px;padding:3px 10px;border-radius:8px;background:var(--or);color:#fff;border:none;cursor:pointer;font-family:inherit;margin-left:auto;">' + (isKo?'매칭하기':'Match') + '</button>' : '') +
    '</div></div>';
}

// ── Fix 11: 날짜 자동 필터링 (봉사자 날짜 ↔ 강아지 기간) ──
// loadOrgVols에 날짜 필터 추가 — 현재 선택된 날짜 범위로 필터
var volDateFilter = null;
function setVolDateFilter(dateStr) {
  volDateFilter = dateStr;
  var user = auth.currentUser;
  if (user) loadOrgVolsV2(user.email);
}

// ── Fix 12: Firebase 로딩 인디케이터 ──
function showAppLoading() {
  var el = document.getElementById('app-loading');
  if (el) el.style.display = 'flex';
}
function hideAppLoading() {
  var el = document.getElementById('app-loading');
  if (el) el.style.display = 'none';
}

// ── Fix 14: 몸무게 단위 kg 표시 (placeholder) ──
document.addEventListener('DOMContentLoaded', function() {
  var wEl = document.getElementById('dog-weight');
  if (wEl && !wEl.placeholder.includes('kg')) {
    wEl.placeholder = wEl.placeholder || '예: 2.5 kg';
  }
  var fnoEl = document.getElementById('fno');
  if (fnoEl) fnoEl.placeholder = 'KE 035';
});

// ── Fix 15 v2.3: 봉사자 프로필 — 항공편 카드(수정/삭제) + 매칭 강아지 정보 + 긴급매칭 내역 ──
var _origLoadMyFlights = loadMyFlights;
loadMyFlights = function(email) {
  var listEl = document.getElementById('vol-my-flights');
  if (!listEl) return;
  var isKo = curLang === 'ko';

  listEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t3);font-size:13px;">불러오는 중...</div>';

  db.collection('volunteers')
    .where('email', '==', email)
    .orderBy('createdAt', 'desc')
    .get()
    .then(function(snap) {
      // ── 이름 업데이트 ──
      if (!snap.empty) {
        var firstVol = snap.docs[0].data();
        var nameEl = document.getElementById('home-username');
        if (nameEl && firstVol.name) nameEl.textContent = firstVol.name;
      }

      if (snap.empty) {
        listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--t3);font-size:13px;">' +
          (isKo ? '아직 등록된 항공편이 없어요<br><span style="font-size:11px;">아래 버튼으로 첫 항공편을 등록해보세요!</span>' :
                  'No flights registered yet<br><span style="font-size:11px;">Register your first flight below!</span>') + '</div>';
        return;
      }

      var stMap_ko = { booked:'예약완료', matched:'매칭완료', done:'이동완료' };
      var stMap_en = { booked:'Booked',   matched:'Matched',  done:'Completed' };
      var stColor  = { booked:'#FF8C00',  matched:'#3B82F6',  done:'#2D9E6B' };
      var stBg     = { booked:'#FFF5E6',  matched:'#EFF6FF',  done:'#E8F7F0' };

      // 매칭된 강아지 정보를 포함해서 렌더링 (Promise.all)
      var promises = snap.docs.map(function(doc) {
        var v = doc.data(); var vid = doc.id; var st = v.status || 'booked';

        // 매칭된 강아지 fetch (matchedDogs 배열 또는 matchedDog 단일)
        var dogIds = v.matchedDogs && v.matchedDogs.length ? v.matchedDogs
                   : (v.matchedDog ? [v.matchedDog] : []);

        var dogPromise = dogIds.length > 0
          ? Promise.all(dogIds.map(function(did) {
              return db.collection('dogs').doc(did).get()
                .then(function(dd) { return dd.exists ? dd.data() : null; })
                .catch(function() { return null; });
            }))
          : Promise.resolve([]);

        return dogPromise.then(function(dogs) {
          dogs = dogs.filter(Boolean);
          var stLabel  = isKo ? (stMap_ko[st]||st) : (stMap_en[st]||st);
          var canEdit  = (st === 'booked');

          // 강아지 정보 카드
          var dogHtml = '';
          if (dogs.length > 0) {
            dogHtml = '<div style="background:#FFF5E6;border-radius:10px;padding:10px 12px;margin-top:8px;">' +
              '<div style="font-size:11px;font-weight:700;color:#FF8C00;margin-bottom:6px;">🐾 ' +
              (isKo ? '매칭된 강아지' : 'Matched Dogs') + ' (' + dogs.length + '마리)</div>' +
              dogs.map(function(d) {
                var photoEl = d.photo
                  ? '<img src="' + d.photo + '" style="width:32px;height:32px;border-radius:8px;object-fit:cover;flex-shrink:0;">'
                  : '<div style="width:32px;height:32px;border-radius:8px;background:' + (d.orgColor||'#FFE0CC') + ';display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">' + (d.orgIco||'🐶') + '</div>';
                return '<div style="display:flex;align-items:center;gap:8px;' + (dogs.indexOf(d)>0?'margin-top:6px;':'') + '">' +
                  photoEl +
                  '<div><div style="font-size:12px;font-weight:700;">' + (d.urgent?'⚡ ':'') + d.name +
                  ' <span style="font-weight:400;color:var(--t2);">· ' + d.breed + ' · ' + d.weight + 'kg</span></div>' +
                  '<div style="font-size:11px;color:var(--t2);">📍 ' + (d.org||'') + ' · → ' + (d.dest||'ATL') + '</div></div></div>';
              }).join('') + '</div>';
          }

          // 매칭완료 안내 + 채팅방 열기
          var matchedMsg = '';
          if (st === 'matched' || st === 'done') {
            var chatBtnTxt = isKo ? '💬 채팅방 열기 →' : '💬 Open Chat →';
            matchedMsg = '<div style="display:flex;align-items:center;gap:6px;margin-top:8px;background:#EFF6FF;border-radius:10px;padding:9px 12px;">' +
              '<span style="font-size:16px;">' + (st==='done'?'✅':'🎉') + '</span>' +
              '<div style="flex:1;font-size:12px;color:#2563EB;font-weight:600;">' +
              (st==='done'
                ? (isKo?'이동완료!':'Transport complete!')
                : (isKo?'매칭완료! 기관과 소통하세요.':'Matched! Chat with the org.')) +
              '<button onclick="openVolChatRoom(\'' + vid + '\')" style="display:block;margin-top:4px;background:var(--or);color:#fff;border:none;border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">' +
              chatBtnTxt + '</button></div></div>';
          }

          // 수정/삭제 버튼
          var editHtml = canEdit
            ? '<div style="display:flex;gap:6px;margin-top:8px;">' +
              '<button onclick="editMyFlight(\'' + vid + '\')" style="flex:1;font-size:11px;padding:6px;border-radius:8px;background:#EFF6FF;color:#3B82F6;border:none;cursor:pointer;font-family:inherit;font-weight:600;">' + (isKo?'✏️ 수정':'✏️ Edit') + '</button>' +
              '<button onclick="deleteMyFlight(\'' + vid + '\')" style="flex:1;font-size:11px;padding:6px;border-radius:8px;background:#FCEBEB;color:#A32D2D;border:none;cursor:pointer;font-family:inherit;font-weight:600;">' + (isKo?'🗑 삭제':'🗑 Delete') + '</button>' +
              '</div>' : '';

          return '<div class="card" style="margin-bottom:10px;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
            '<div style="font-weight:700;font-size:14px;">✈️ ' + (v.airline||'') + ' ' + (v.flightNo||'') + '</div>' +
            '<span style="font-size:10px;padding:3px 9px;border-radius:9px;font-weight:700;background:' + (stBg[st]||'#FFF5E6') + ';color:' + (stColor[st]||'#FF8C00') + ';">' + stLabel + '</span>' +
            '</div>' +
            '<div style="font-size:12px;color:var(--t2);">📅 ICN → ATL · ' + (v.flightDate||'') + '</div>' +
            (v.name  ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">👤 ' + v.name + (v.nation?' · '+v.nation:'') + '</div>' : '') +
            (v.kakao ? '<div style="font-size:12px;color:var(--t2);margin-top:2px;">💬 ' + v.kakao + '</div>' : '') +
            dogHtml + matchedMsg + editHtml +
            '</div>';
        });
      });

      Promise.all(promises).then(function(cards) {
        listEl.innerHTML = cards.join('');
        // 긴급매칭 신청 내역 섹션 추가
        loadUrgentRequestSection(email, listEl, isKo);
      });
    })
    .catch(function(e) {
      var msg = e && e.message && e.message.indexOf('index') > -1
        ? (isKo ? '데이터 로딩 오류입니다. 문의: pawstclass.1@gmail.com' : 'Data loading error. Contact: pawstclass.1@gmail.com')
        : (isKo ? '잠시 후 다시 시도해 주세요.' : 'Please try again later.');
      listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--re);font-size:13px;">' + msg + '</div>';
    });
};

// ── 봉사자가 내 봉사정보에서 채팅방 바로 열기 ──
function openVolChatRoom(volId) {
  // 봉사자 프로필 닫기
  var vp = document.getElementById('s-volprofile');
  if (vp) vp.style.display = 'none';
  // 매칭 팝업 닫기
  var pop = document.getElementById('match-notify-popup');
  if (pop) pop.remove();
  // 채팅 탭으로 전환 후 바로 해당 채팅방 열기
  setTab('chat');
  setTimeout(function() {
    openChatRoom(volId);
  }, 150);
}

// ── 긴급매칭 신청 내역 로드 ──
// ── 긴급매칭 내역 렌더 헬퍼 ──
function renderUrgentSection(docs, listEl, isKo) {
  if (!docs || !docs.length) return;
  var secHtml = '<div style="margin-top:16px;">' +
    '<div style="font-size:13px;font-weight:700;color:var(--t2);margin-bottom:8px;">🚨 ' +
    (isKo ? '긴급매칭 신청 내역' : 'Urgent Match Requests') + '</div>' +
    docs.map(function(doc) {
      var r = doc.data(); var rid = doc.id;
      var stBg2  = r.status === 'matched' ? '#EFF6FF' : (r.status === 'cancelled' ? '#F3F4F6' : '#FFF5E6');
      var stClr2 = r.status === 'matched' ? '#2563EB' : (r.status === 'cancelled' ? '#9CA3AF' : '#FF8C00');
      var stLbl  = r.status === 'matched' ? (isKo?'매칭완료':'Matched')
                 : r.status === 'cancelled' ? (isKo?'취소됨':'Cancelled')
                 : (isKo?'신청중':'Pending');
      var date   = r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString('ko') : '';
      var canCancel = r.status === 'pending';
      return '<div class="card" style="margin-bottom:8px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">' +
        '<div style="font-weight:700;font-size:13px;">🚨 ' + (r.orgName||'기관') + '</div>' +
        '<span style="font-size:10px;padding:2px 8px;border-radius:9px;font-weight:700;background:' + stBg2 + ';color:' + stClr2 + ';">' + stLbl + '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--t2);">✈️ ICN → ATL · ' + (r.flightDate||'') + ' · 신청일: ' + date + '</div>' +
        (canCancel ? '<button onclick="cancelUrgentRequest(\'' + rid + '\')" style="margin-top:8px;width:100%;font-size:11px;padding:6px;border-radius:8px;background:#FCEBEB;color:#A32D2D;border:none;cursor:pointer;font-family:inherit;font-weight:600;">🗑 ' + (isKo?'신청 취소':'Cancel Request') + '</button>' : '') +
        '</div>';
    }).join('') + '</div>';
  listEl.innerHTML += secHtml;
}

function loadUrgentRequestSection(email, listEl, isKo) {
  db.collection('urgentRequests')
    .where('volunteerEmail', '==', email)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()
    .then(function(snap) {
      if (snap.empty) return;
      renderUrgentSection(snap.docs, listEl, isKo);
    })
    .catch(function() {
      // 인덱스 없는 경우 fallback — email만으로 조회
      db.collection('urgentRequests')
        .where('volunteerEmail', '==', email)
        .get()
        .then(function(snap2) {
          if (snap2.empty) return;
          var items = snap2.docs.sort(function(a,b) {
            var ta = a.data().createdAt ? a.data().createdAt.seconds : 0;
            var tb = b.data().createdAt ? b.data().createdAt.seconds : 0;
            return tb - ta;
          });
          renderUrgentSection(items, listEl, isKo);
        })
        .catch(function() {});
    });
}

// ── 긴급매칭 신청 취소 ──
function cancelUrgentRequest(reqId) {
  var isKo = curLang === 'ko';
  if (!confirm(isKo ? '신청을 취소할까요?' : 'Cancel this request?')) return;
  db.collection('urgentRequests').doc(reqId).update({ status: 'cancelled' })
    .then(function() {
      var user = auth.currentUser;
      if (user) loadMyFlights(user.email);
    })
    .catch(function(e) { alert('오류: ' + e.message); });
}
var _origOrgMarkDone2 = orgMarkDone;
orgMarkDone = function(volId, dogId) {
  if (!confirm('이동완료로 처리할까요?')) return;
  var batch = db.batch();
  if (volId) batch.update(db.collection('volunteers').doc(volId), { status: 'done' });
  if (dogId) batch.update(db.collection('dogs').doc(dogId), { status: 'done' });
  batch.commit().then(function() {
    alert('이동완료 처리되었습니다 🐾\n봉사자에게 후기 작성을 안내해 주세요!');
    var user = auth.currentUser;
    if (user) loadOrgDogs(user.email);
  }).catch(function(e) { alert('오류: ' + e.message); });
};

// ── Fix 17: 로그아웃 후 뒤로가기 방지 ──
var _origDoLogout = doLogout;
doLogout = function() {
  auth.signOut().then(function() {
    window.history.replaceState(null, '', window.location.href);
    scGo('s-splash');
  });
};

// ── Fix 18: 세션 충돌 방지 - 기관 로그인 상태에서 봉사자 로그인 차단 ──
var _origGoVolProfile2 = goVolProfile;
goVolProfile = function() {
  var user = auth.currentUser;
  if (user && ORG_MAP[user.email]) {
    alert('기관 계정으로 로그인 중입니다. 기관 대시보드를 이용해 주세요.');
    return;
  }
  _origGoVolProfile2();
};

// ── Fix 19: Firestore 인덱스 에러 공통 처리 ──
function handleFirestoreError(e, listEl, isKo) {
  if (!listEl) return;
  if (e && e.message && e.message.indexOf('index') > -1) {
    listEl.innerHTML = '<div style="background:#FFF5E6;border-radius:12px;padding:14px;font-size:12px;color:#854F0B;line-height:1.8;">' +
      '⚠️ ' + (isKo ? '데이터 로딩 오류가 발생했습니다.<br>문의: pawstclass.1@gmail.com' :
      'Data loading error occurred.<br>Contact: pawstclass.1@gmail.com') + '</div>';
  } else {
    listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--re);font-size:12px;">' +
      (isKo ? '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' : 'An error occurred. Please try again.') + '</div>';
  }
}

// ── 봉사자/기관 로그인에 아이디 저장 로직 연결 ──
// doVolLogin 완료 후 이메일 저장
var _origDoVolLogin2 = doVolLogin;
doVolLogin = function() {
  var rememberEl = document.getElementById('vol-remember');
  if (rememberEl && rememberEl.checked) {
    var emailEl = document.getElementById('vol-login-email');
    if (emailEl) saveEmailToStorage(emailEl.value.trim(), true);
  }
  _origDoVolLogin2();
};

// ── loadOrgVolsV2를 기관 대시보드 탭에 연결 ──
var _origSetDashTabOrg = setDashTab;
setDashTab = function(t) {
  _origSetDashTabOrg(t);
  if (t === 'vols') {
    var user = auth.currentUser;
    if (user) loadOrgVolsV2(user.email);
  }
};

// editDog 헬퍼 - Firestore에서 데이터 불러와서 폼 채우기
function editDogById(dogId) {
  db.collection('dogs').doc(dogId).get().then(function(doc) {
    if (!doc.exists) { alert('강아지 정보를 찾을 수 없습니다.'); return; }
    editDog(dogId, doc.data());
  });
}
// ── 백버튼 초기 history state 세팅 ──
document.addEventListener('DOMContentLoaded', function() {
  window.history.replaceState({ screen: 's-splash', tab: 'home' }, '', '');
});


// ── PAWST CLASS 스플래시 애니메이션 (Award Compass 방식) ──
(function() {
  var splash = document.getElementById('splash-screen');
  if (!splash) return;

  // 0.1s: SVG fade in
  setTimeout(function() {
    document.getElementById('splash-svg').classList.add('show');
  }, 100);

  // 0.5s: 비행기 애니메이션
  setTimeout(function() {
    document.getElementById('splash-plane').classList.add('animate');
  }, 500);

  // 1.3s: 타이틀 등장
  setTimeout(function() {
    document.getElementById('splash-title').classList.add('show');
  }, 1300);

  // 1.6s: 서브타이틀 + 구분선 + 크레딧
  setTimeout(function() {
    document.getElementById('splash-sub').classList.add('show');
    document.getElementById('splash-divider').classList.add('show');
    document.getElementById('splash-credit').classList.add('show');
  }, 1600);

  // 1.9s: 로딩 dots 표시
  setTimeout(function() {
    document.getElementById('splash-dots').classList.add('show');
  }, 1900);

  // dots 순차 점등
  setTimeout(function() { document.getElementById('dot1').classList.add('active'); }, 2000);
  setTimeout(function() { document.getElementById('dot2').classList.add('active'); }, 2250);
  setTimeout(function() { document.getElementById('dot3').classList.add('active'); }, 2500);

  // 4.0s: fade out 시작
  setTimeout(function() {
    splash.classList.add('fade-out');
  }, 5500);

  // 6.2s: splash-screen 제거 + s-splash 본화면 표시
  setTimeout(function() {
    splash.style.display = 'none';
  }, 6300);
})();