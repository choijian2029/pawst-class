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
function sc(id) {
  ['s-splash','s-ob','s-main'].forEach(function(s) {
    document.getElementById(s).classList.remove('on');
  });
  document.getElementById(id).classList.add('on');
}
function goOb()    { obI = 0; sc('s-ob'); rOb(); }
function goHome()  { sc('s-main'); setTab('home'); }
function goAdmin() { sc('s-main'); setAdm(); }
function bkOb()    { sc('s-splash'); }

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
  ['home','register','orgs','reviews','foster'].forEach(function(id) {
    var el = document.getElementById('t-' + id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('t-admin').style.display = 'none';

  var el = document.getElementById('t-' + t);
  if (el) el.style.display = 'block';

  document.querySelectorAll('.ni').forEach(function(b) { b.classList.remove('on'); });
  var tabs = ['home','register','orgs','reviews','foster'];
  var idx = tabs.indexOf(t);
  var nb = document.querySelectorAll('.ni');
  if (nb[idx]) nb[idx].classList.add('on');

  if (t === 'reviews') rRevs();
  sc('s-main');
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
  sc('s-main');
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
  showS();
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
