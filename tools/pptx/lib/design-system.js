/**
 * Design System for Proposal Generator (PptxGenJS)
 * 컨설팅 스타일 디자인 시스템
 */

// 컬러 팔레트 (컨설팅 스타일)
const C = {
  primary: "1E3A5F",    // 네이비 (신뢰감)
  secondary: "0891B2",  // 틸 (전문성)
  accent: "F59E0B",     // 앰버 (강조)
  dark: "0F172A",       // 차콜 (다크 배경)
  light: "F8FAFC",      // 오프화이트 (라이트 배경)
  text: "1E293B",       // 본문 텍스트
  muted: "64748B",      // 보조 텍스트
  white: "FFFFFF",
  card: "FFFFFF",       // 카드 배경
  border: "E2E8F0",     // 카드 테두리
  success: "10B981",
  danger: "EF4444",
};

const FONT = { header: "Pretendard", body: "Pretendard" };

const SIZE = {
  display: 48, h1: 36, h2: 28, h3: 22, h4: 18,
  body: 16, small: 14, caption: 12, tiny: 10,
};

const LAYOUT = {
  slideW: 10, slideH: 5.625,
  mx: 0.6, my: 0.5,       // 마진
  cw: 8.8,                 // 콘텐츠 너비 (10 - 0.6*2)
  gap: 0.3,                // 요소 간격
  titleY: 0.4,             // 제목 Y좌표
  contentY: 1.3,           // 콘텐츠 시작 Y
  bottomY: 5.1,            // 하단 한계
};

/**
 * 그림자 프리셋 생성 (매번 새 객체)
 */
function makeShadow(preset) {
  if (preset === "soft") {
    return { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 };
  }
  if (preset === "medium") {
    return { type: "outer", color: "000000", blur: 10, offset: 3, angle: 135, opacity: 0.12 };
  }
  return { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.15 };
}

/**
 * 공통: Action Title 배치
 * @param {object} slide - PptxGenJS slide
 * @param {string} title - 제목 텍스트
 * @param {object} opts - { color?, y?, fontSize? }
 */
function addTitle(slide, title, opts = {}) {
  const color = opts.color || C.text;
  const y = opts.y !== undefined ? opts.y : LAYOUT.titleY;
  const fontSize = opts.fontSize || SIZE.h2;

  slide.addText(title, {
    x: LAYOUT.mx,
    y: y,
    w: LAYOUT.cw,
    h: 0.6,
    fontSize: fontSize,
    fontFace: FONT.header,
    color: color,
    bold: true,
    margin: 0,
  });
}

/**
 * 공통: 하단 출처/캡션
 */
function addCaption(slide, text) {
  slide.addText(text, {
    x: LAYOUT.mx,
    y: LAYOUT.bottomY,
    w: LAYOUT.cw,
    h: 0.35,
    fontSize: SIZE.caption,
    fontFace: FONT.body,
    color: C.muted,
    italic: true,
    margin: 0,
  });
}

/**
 * 공통: 목차 넘버링
 */
function addPageNum(slide, num, isDark) {
  slide.addText(String(num).padStart(2, "0"), {
    x: LAYOUT.slideW - 1.0,
    y: LAYOUT.slideH - 0.5,
    w: 0.6,
    h: 0.35,
    fontSize: SIZE.caption,
    fontFace: FONT.body,
    color: isDark ? C.white : C.muted,
    align: "right",
    margin: 0,
  });
}

module.exports = { C, FONT, SIZE, LAYOUT, makeShadow, addTitle, addCaption, addPageNum };
