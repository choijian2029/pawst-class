// ── PAWST CLASS · firebase.js ──
// Firebase SDK (CDN 방식 - index.html에서 로드)

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCEHK3dpsfWJBbLaZqen_1JgnDq3zXY3Z8",
  authDomain: "pawstclass.com",
  projectId: "pawst-class",
  storageBucket: "pawst-class.firebasestorage.app",
  messagingSenderId: "114120835162",
  appId: "1:114120835162:web:98fbf82f9bdafaf2055863"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db   = firebase.firestore();
var auth = firebase.auth();

// ── 기관 계정 목록 (어드민 지안이가 직접 관리) ──
// 실제 기관 이메일/비밀번호는 Firebase Console > Authentication > Users 에서 직접 추가
// 현재 등록된 기관:
//   kpups@pc.com     / kpups!
//   adoptme@pc.com   / adoptme!
//   gamjane@pc.com   / gamjane!

// 현재 기관 계정 (로그인 + 대시보드 진입에 사용)
var ORG_MAP = {
  "kpups@pc.com":   { name: "K-Pups for Love", ico: "🐾", color: "#FFF0EB" },
  "adoptme@pc.com": { name: "Adopt Me Korea",  ico: "🐕", color: "#EFF6FF" },
  "gamjane@pc.com": { name: "감자네 하우스",     ico: "🏠", color: "#F5F3FF" }
};

// 구 이메일 호환 (Firestore 기존 데이터 표시용 - 카드/통계에만 사용)
var LEGACY_ORG_MAP = {
  "kpups@pawst-class.com":   { name: "K-Pups for Love", ico: "🐾", color: "#FFF0EB" },
  "adoptme@pawst-class.com": { name: "Adopt Me Korea",  ico: "🐕", color: "#EFF6FF" },
  "gamjane@pawst-class.com": { name: "감자네 하우스",     ico: "🏠", color: "#F5F3FF" }
};

// 이메일로 기관 정보 조회 (신/구 이메일 모두 지원)
function getOrgInfo(email) {
  return ORG_MAP[email] || LEGACY_ORG_MAP[email] || null;
}
