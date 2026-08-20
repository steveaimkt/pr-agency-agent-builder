/**
 * quoteHighlight · 인용/핵심 메시지 풀화면
 * data: { quote, author?, context?, mood: "dark"|"light" }
 */
const { C, FONT, SIZE, LAYOUT } = require("../design-system");

function quoteHighlight(slide, pres, data) {
  const isDark = data.mood === "dark";

  // 풀 배경
  slide.background = { fill: isDark ? C.dark : C.light };

  // 장식 바 (좌측) · 이 장의 형광은 여기 하나뿐이다
  slide.addShape(pres.ShapeType.rect, {
    x: LAYOUT.mx,
    y: 1.4,
    w: 0.08,
    h: 2.0,
    fill: { color: C.accent },
  });

  // 인용 부호
  slide.addText("\u201C", {
    x: LAYOUT.mx + 0.3,
    y: 0.9,
    w: 1.0,
    h: 0.9,
    fontSize: 72,
    fontFace: FONT.header,
    color: isDark ? "4C4D59" : C.border,
    bold: true,
    margin: 0,
  });

  // 인용문
  slide.addText(data.quote, {
    x: LAYOUT.mx + 0.4,
    y: 1.5,
    w: LAYOUT.cw - 0.8,
    h: 2.0,
    fontSize: SIZE.h2,
    fontFace: FONT.header,
    color: isDark ? C.white : C.text,
    bold: true,
    italic: true,
    valign: "middle",
    margin: 0,
    lineSpacingMultiple: 1.3,
  });

  // 닫는 인용 부호
  slide.addText("\u201D", {
    x: LAYOUT.slideW - LAYOUT.mx - 1.0,
    y: 2.8,
    w: 1.0,
    h: 0.9,
    fontSize: 72,
    fontFace: FONT.header,
    color: isDark ? "4C4D59" : C.border,
    bold: true,
    align: "right",
    margin: 0,
  });

  // 저자
  if (data.author) {
    slide.addShape(pres.ShapeType.rect, {
      x: LAYOUT.mx + 0.4,
      y: 3.85,
      w: 1.2,
      h: 0.03,
      fill: { color: C.muted },
    });

    slide.addText(data.author, {
      x: LAYOUT.mx + 0.4,
      y: 4.0,
      w: LAYOUT.cw - 0.8,
      h: 0.4,
      fontSize: SIZE.body,
      fontFace: FONT.header,
      color: isDark ? C.light : C.primary,
      bold: true,
      margin: 0,
    });
  }

  // 컨텍스트
  if (data.context) {
    slide.addText(data.context, {
      x: LAYOUT.mx + 0.4,
      y: data.author ? 4.4 : 4.0,
      w: LAYOUT.cw - 0.8,
      h: 0.35,
      fontSize: SIZE.small,
      fontFace: FONT.body,
      color: isDark ? C.muted : C.muted,
      margin: 0,
    });
  }
}

module.exports = quoteHighlight;
