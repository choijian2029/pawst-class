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
  ['home','register','orgs','reviews','foster','calendar'].forEach(function(id) {
    var el = document.getElementById('t-' + id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('t-admin').style.display = 'none';

  var el = document.getElementById('t-' + t);
  if (el) el.style.display = 'block';

  document.querySelectorAll('.ni').forEach(function(b) { b.classList.remove('on'); });
  var tabs = ['home','register','orgs','reviews','calendar'];
  var idx = tabs.indexOf(t);
  var nb = document.querySelectorAll('.ni');
  if (nb[idx]) nb[idx].classList.add('on');

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

function showS() { document.getElementById('sm').classList.add('on'); }
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
  var msg = curLang === 'ko' ? '개인정보 수집·이용에 동의해 주세요.' : 'Please agree to the privacy policy.';
  if (!pvOk) { alert(msg); return; }

  var name     = document.getElementById('vol-name')    ? document.getElementById('vol-name').value.trim()    : '';
  var resno    = document.getElementById('vol-resno')   ? document.getElementById('vol-resno').value.trim()   : '';
  var phone    = document.getElementById('vol-phone')   ? document.getElementById('vol-phone').value.trim()   : '';
  var email    = document.getElementById('vol-email')   ? document.getElementById('vol-email').value.trim()   : '';
  var address  = document.getElementById('vol-address') ? document.getElementById('vol-address').value.trim() : '';
  var kakao    = document.getElementById('vol-kakao')   ? document.getElementById('vol-kakao').value.trim()   : '';
  var nation   = document.getElementById('vol-nation')  ? document.getElementById('vol-nation').value.trim()  : '';
  var dateEl   = document.querySelector('#t-register input[type="date"]');
  var flightNo = document.getElementById('fno') ? document.getElementById('fno').value.trim() : '';
  var airline  = '';
  document.querySelectorAll('#airline-chips .chip.on').forEach(function(c) { airline = c.textContent.trim(); });

  var btn = document.getElementById('rbtn');
  btn.textContent = curLang === 'ko' ? '등록 중...' : 'Submitting...';
  btn.style.opacity = '.6';

  db.collection('volunteers').add({
    name:       name,
    resno:      resno,
    phone:      phone,
    email:      email,
    address:    address,
    kakao:      kakao,
    nation:     nation,
    flightDate: dateEl ? dateEl.value : '',
    flightNo:   flightNo,
    airline:    airline,
    dest:       'ATL',
    status:     'booked',   // booked → matched → done
    matchedDog: null,
    createdAt:  firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function() {
    btn.textContent = curLang === 'ko' ? '등록 완료하기' : 'Complete Registration';
    btn.style.opacity = '1';
    showS();
  })
  .catch(function(e) {
    btn.textContent = curLang === 'ko' ? '등록 완료하기' : 'Complete Registration';
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
function sStar(n) {
  cStar = n;
  document.querySelectorAll('.star').forEach(function(s, i) {
    s.classList.toggle('on', i < n);
  });
}
function togRF() {
  var f = document.getElementById('rev-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}
function ldPh(e) {
  var file = e.target.files[0];
  if (!file) return;
  var r = new FileReader();
  r.onload = function(ev) {
    document.getElementById('ph-img').src = ev.target.result;
    document.getElementById('ph-prev').style.display = 'block';
    document.getElementById('ph-drop').style.display = 'none';
  };
  r.readAsDataURL(file);
}
function rmPh() {
  document.getElementById('ph-img').src = '';
  document.getElementById('ph-prev').style.display = 'none';
  document.getElementById('ph-drop').style.display = 'block';
  document.getElementById('ph-inp').value = '';
}
function subRev() {
  var isKo = curLang === 'ko';
  var txt = document.getElementById('rev-txt').value.trim();
  var errMsg = isKo ? '후기 내용을 입력해 주세요.' : 'Please write your review.';
  if (!txt) { alert(errMsg); return; }
  var img = document.getElementById('ph-img');
  var ph = img && img.src && img.src.length > 10 ? img.src : null;
  revs.unshift({ n: isKo?'나':'Me', d: new Date().toLocaleDateString('ko'), r: cStar, txt_ko: txt, txt_en: txt, route:'ICN→ATL', ph: ph });
  document.getElementById('rev-txt').value = '';
  rmPh(); togRF(); rRevs();
}
function rRevs() {
  var isKo = curLang === 'ko';
  document.getElementById('gal').innerHTML = revs.map(function(r) {
    return r.ph
      ? '<img src="' + r.ph + '" style="flex-shrink:0;width:70px;height:70px;border-radius:12px;object-fit:cover;">'
      : '<div style="flex-shrink:0;width:70px;height:70px;border-radius:12px;background:#FFF5E6;display:flex;align-items:center;justify-content:center;font-size:26px;">🐾</div>';
  }).join('');

  document.getElementById('rev-list').innerHTML = revs.map(function(r) {
    var st = ''; for (var i = 0; i < r.r; i++) st += '★';
    var txt = isKo ? r.txt_ko : r.txt_en;
    var img = r.ph ? '<img src="' + r.ph + '" style="width:100%;height:140px;object-fit:cover;">' : '';
    return '<div class="card" style="padding:0;overflow:hidden;margin-bottom:12px;">' + img +
      '<div style="padding:14px;">' +
      '<div style="display:flex;align-items:center;gap:9px;margin-bottom:9px;">' +
      '<div style="width:34px;height:34px;border-radius:50%;background:#FFF5E6;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;">👤</div>' +
      '<div style="flex:1;"><div style="font-weight:700;font-size:14px;">' + r.n + '</div><div style="font-size:11px;color:#9CA3AF;">' + r.route + ' · ' + r.d + '</div></div>' +
      '<div style="color:#F59E0B;font-size:13px;font-weight:700;">' + st + '</div>' +
      '</div>' +
      '<p style="font-size:13px;line-height:1.7;color:#6B7280;margin:0;">' + txt + '</p>' +
      '</div></div>';
  }).join('');
}

// ── INIT ──
rRevs();

// ── FIREBASE 화면 전환 ──
function scGo(id) {
  ['s-splash','s-ob','s-main','s-orglogin','s-orgdash','s-dogform'].forEach(function(s) {
    var el = document.getElementById(s);
    if (el) el.classList.remove('on');
  });
  document.getElementById(id).classList.add('on');
}

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
      loadOrgDogs(email);
      scGo('s-orgdash');
    })
    .catch(function(e) {
      btn.textContent = '로그인';
      btn.style.opacity = '1';
      showErr('login-err', '이메일 또는 비밀번호가 올바르지 않습니다.');
    });
}

function doLogout() {
  auth.signOut().then(function() {
    document.getElementById('org-email').value = '';
    document.getElementById('org-pw').value = '';
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
    // 폼 초기화
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
        var stMap = { waiting:'대기중', matched:'매칭완료', done:'완료' };
        var stColorMap = { waiting:'#FF8C00', matched:'#3B82F6', done:'#2D9E6B' };
        var stBgMap = { waiting:'#FFF5E6', matched:'#EFF6FF', done:'#E8F7F0' };
        var st = d.status || 'waiting';
        var photoHtml = d.photo
          ? '<img src="' + d.photo + '" style="width:48px;height:48px;border-radius:10px;object-fit:cover;flex-shrink:0;">'
          : '<div style="width:48px;height:48px;border-radius:10px;background:' + (d.orgColor||'#FFF5E6') + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + (d.orgIco||'🐶') + '</div>';
        return '<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;border:1px solid #E8E0D8;">' +
          photoHtml +
          '<div style="flex:1;min-width:0;">' +
          '<div style="font-weight:700;font-size:14px;">' + (d.urgent?'⚡ ':'') + d.name + ' <span style="font-weight:400;color:#9CA3AF;font-size:12px;">· ' + d.breed + ' · ' + d.weight + 'kg</span></div>' +
          '<div style="font-size:11px;color:#3B82F6;margin-top:1px;">→ ' + (d.dest||'ATL') + ' · ' + (d.dateFrom||'') + ' ~ ' + (d.dateTo||'') + '</div>' +
          '</div>' +
          '<span style="font-size:11px;padding:3px 9px;border-radius:9px;font-weight:700;background:' + stBgMap[st] + ';color:' + stColorMap[st] + ';flex-shrink:0;">' + stMap[st] + '</span>' +
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
  document.getElementById('tab-dogs').classList.toggle('on',   t === 'dogs');
  document.getElementById('tab-vols').classList.toggle('on',   t === 'vols');
  document.getElementById('tab-foster').classList.toggle('on', t === 'foster');
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
    });
}

// ── 매칭 모달 ──
var selectedVolId = null;
var selectedDogId = null;
var cachedDogs    = [];

function openMatchModal(volId) {
  selectedVolId = volId;
  selectedDogId = null;

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
      document.getElementById('mm-dog-list').innerHTML = snap.docs.map(function(doc) {
        var d = doc.data();
        var photoHtml = d.photo
          ? '<img src="' + d.photo + '" style="width:40px;height:40px;border-radius:9px;object-fit:cover;flex-shrink:0;">'
          : '<div style="width:40px;height:40px;border-radius:9px;background:' + (d.orgColor||'#FFF5E6') + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + (d.orgIco||'🐶') + '</div>';
        return '<div class="match-dog-item" id="mdog-' + doc.id + '" onclick="selectDog(\'' + doc.id + '\')">' +
          photoHtml +
          '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">' + (d.urgent?'⚡ ':'') + d.name + '</div>' +
          '<div style="font-size:11px;color:var(--t2);">' + d.breed + ' · ' + d.weight + 'kg · ' + (d.dateFrom||'') + ' ~ ' + (d.dateTo||'') + '</div></div>' +
          '</div>';
      }).join('');
    });

  document.getElementById('mm').classList.add('on');
}

function selectDog(dogId) {
  selectedDogId = dogId;
  document.querySelectorAll('.match-dog-item').forEach(function(el) { el.classList.remove('on'); });
  var el = document.getElementById('mdog-' + dogId);
  if (el) el.classList.add('on');
}

function confirmMatch() {
  if (!selectedVolId || !selectedDogId) {
    alert('강아지를 선택해주세요.');
    return;
  }
  var btn = document.getElementById('mm-confirm');
  btn.textContent = '매칭 중...';
  btn.style.opacity = '.6';

  var batch = db.batch();
  // 봉사자 상태 업데이트
  batch.update(db.collection('volunteers').doc(selectedVolId), {
    status: 'matched',
    matchedDog: selectedDogId
  });
  // 강아지 상태 업데이트
  batch.update(db.collection('dogs').doc(selectedDogId), {
    status: 'matched',
    matchedVol: selectedVolId
  });

  batch.commit()
    .then(function() {
      btn.textContent = '매칭 확정 🐾';
      btn.style.opacity = '1';
      clMo('mm');
      alert('🎉 매칭이 완료되었습니다! 봉사자에게 카카오톡으로 연락해주세요.');
    })
    .catch(function(e) {
      btn.textContent = '매칭 확정 🐾';
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
  // Firestore에서 매칭된 봉사 일정
  db.collection('volunteers')
    .where('status', 'in', ['booked','matched'])
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
  var isOrg = !!auth.currentUser;
  var reminders = isOrg ? ORG_REMINDERS : VOL_REMINDERS;
  var banners = [];
  var listItems = [];

  calEvents.forEach(function(event) {
    if (event.type !== 'flight') return;
    var dd = diffDays(event.date);

    reminders.forEach(function(r) {
      if (r.dday === dd) {
        banners.push({ type: r.type, icon: r.icon, msg: isKo ? r.ko : r.en, date: event.date, label: event.label });
      }
      // 리마인더 목록 (앞으로 7일 + 지난 3일)
      if (r.dday >= dd - 3 && r.dday <= dd + 7) {
        var ddLabel = r.dday === 0 ? 'D-Day' : (r.dday > 0 ? 'D+' + r.dday : 'D' + r.dday);
        listItems.push({ type: r.type, icon: r.icon, msg: isKo ? r.ko : r.en, ddLabel: ddLabel, date: event.date, dday: r.dday - dd });
      }
    });
  });

  // 배너 렌더
  var bannerEl = document.getElementById('reminder-banners');
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
  var listEl = document.getElementById('reminder-list');
  if (!listEl) return;
  if (!listItems.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:13px;">' +
      (isKo ? '등록된 항공편이 없어요' : 'No flights registered yet') + '</div>';
    return;
  }
  // 날짜순 정렬
  listItems.sort(function(a, b) { return a.dday - b.dday; });
  listEl.innerHTML = listItems.map(function(item) {
    var ddClass = item.dday <= 0 ? 'danger' : (item.dday <= 2 ? 'soon' : 'normal');
    return '<div class="reminder-item">' +
      '<div class="reminder-dday ' + ddClass + '">' + item.ddLabel + '</div>' +
      '<div style="flex:1;">' +
      '<div style="font-size:13px;font-weight:600;color:var(--tx);">' + item.icon + ' ' + item.msg + '</div>' +
      '<div style="font-size:11px;color:var(--t3);margin-top:2px;">' + item.date + ' · ' + item.label + '</div>' +
      '</div></div>';
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
var chkState = { chk1: false, chk2: false, chk3: false, chk4: false };

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
  var total = Object.keys(chkState).length;
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
