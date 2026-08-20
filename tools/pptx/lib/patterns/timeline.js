/**
 * timeline — 수평 타임라인
 * data: { title, events: [{date, title, desc?}] }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function timeline(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const events = data.events || [];
  const count = events.length;

  // 타임라인 중앙 수평선
  const lineY = LAYOUT.contentY + 1.6;
  const lineH = 0.04;

  slide.addShape(pres.ShapeType.rect, {
    x: LAYOUT.mx,
    y: lineY,
    w: LAYOUT.cw,
    h: lineH,
    fill: { color: C.border },
  });

  const segmentW = LAYOUT.cw / count;

  events.forEach((evt, i) => {
    const centerX = LAYOUT.mx + segmentW * i + segmentW / 2;
    const isAbove = i % 2 === 0;

    // 노드 점
    const dotSize = 0.18;
    slide.addShape(pres.ShapeType.rect, {
      x: centerX - dotSize / 2,
      y: lineY - dotSize / 2 + lineH / 2,
      w: dotSize,
      h: dotSize,
      fill: { color: C.secondary },
    });

    // 수직 연결선
    const stemH = 0.5;
    if (isAbove) {
      slide.addShape(pres.ShapeType.rect, {
        x: centerX - 0.015,
        y: lineY - stemH,
        w: 0.03,
        h: stemH,
        fill: { color: C.border },
      });
    } else {
      slide.addShape(pres.ShapeType.rect, {
        x: centerX - 0.015,
        y: lineY + lineH,
        w: 0.03,
        h: stemH,
        fill: { color: C.border },
      });
    }

    // 카드
    const cardW = segmentW - 0.2;
    const cardH = 1.2;
    const cardX = centerX - cardW / 2;
    const cardY = isAbove ? lineY - stemH - cardH : lineY + lineH + stemH;

    slide.addShape(pres.ShapeType.rect, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0,
      shadow: makeShadow("soft"),
    });

    // 날짜 (배지)
    slide.addText(evt.date, {
      x: cardX + 0.1,
      y: cardY + 0.1,
      w: cardW - 0.2,
      h: 0.28,
      fontSize: SIZE.tiny,
      fontFace: FONT.header,
      color: C.secondary,
      bold: true,
      margin: 0,
    });

    // 이벤트 제목
    slide.addText(evt.title, {
      x: cardX + 0.1,
      y: cardY + 0.38,
      w: cardW - 0.2,
      h: 0.32,
      fontSize: SIZE.caption,
      fontFace: FONT.header,
      color: C.text,
      bold: true,
      margin: 0,
    });

    // 이벤트 설명
    if (evt.desc) {
      slide.addText(evt.desc, {
        x: cardX + 0.1,
        y: cardY + 0.7,
        w: cardW - 0.2,
        h: 0.4,
        fontSize: SIZE.tiny,
        fontFace: FONT.body,
        color: C.muted,
        margin: 0,
      });
    }
  });
}

module.exports = timeline;
