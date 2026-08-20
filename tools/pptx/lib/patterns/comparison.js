/**
 * comparison — 좌우 2분할 (AS-IS / TO-BE)
 * data: { title, left: {label, items:[]}, right: {label, items:[]}, bottomMessage? }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function comparison(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const panelGap = 0.35;
  const panelW = (LAYOUT.cw - panelGap) / 2;
  const panelH = data.bottomMessage ? 2.8 : 3.2;
  const startY = LAYOUT.contentY;
  const leftX = LAYOUT.mx;
  const rightX = LAYOUT.mx + panelW + panelGap;

  // --- 좌측 패널 (AS-IS, 부정) ---
  slide.addShape(pres.ShapeType.rect, {
    x: leftX,
    y: startY,
    w: panelW,
    h: panelH,
    fill: { color: C.card },
    line: { color: C.border, width: 1 },
    rectRadius: 0,
    shadow: makeShadow("soft"),
  });

  // 좌측 헤더 바
  slide.addShape(pres.ShapeType.rect, {
    x: leftX,
    y: startY,
    w: panelW,
    h: 0.5,
    fill: { color: C.muted },
  });

  slide.addText(data.left.label || "AS-IS", {
    x: leftX,
    y: startY,
    w: panelW,
    h: 0.5,
    fontSize: SIZE.h4,
    fontFace: FONT.header,
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
    margin: 0,
  });

  // 좌측 아이템
  const leftItems = data.left.items || [];
  leftItems.forEach((item, i) => {
    const itemY = startY + 0.7 + i * 0.45;
    // 불릿 원
    slide.addShape(pres.ShapeType.rect, {
      x: leftX + 0.3,
      y: itemY + 0.1,
      w: 0.12,
      h: 0.12,
      fill: { color: C.danger },
    });
    slide.addText(item, {
      x: leftX + 0.55,
      y: itemY,
      w: panelW - 0.85,
      h: 0.35,
      fontSize: SIZE.small,
      fontFace: FONT.body,
      color: C.text,
      valign: "middle",
      margin: 0,
    });
  });

  // --- 우측 패널 (TO-BE, 긍정) ---
  slide.addShape(pres.ShapeType.rect, {
    x: rightX,
    y: startY,
    w: panelW,
    h: panelH,
    fill: { color: C.card },
    line: { color: C.border, width: 1 },
    rectRadius: 0,
    shadow: makeShadow("soft"),
  });

  // 우측 헤더 바
  slide.addShape(pres.ShapeType.rect, {
    x: rightX,
    y: startY,
    w: panelW,
    h: 0.5,
    fill: { color: C.secondary },
  });

  slide.addText(data.right.label || "TO-BE", {
    x: rightX,
    y: startY,
    w: panelW,
    h: 0.5,
    fontSize: SIZE.h4,
    fontFace: FONT.header,
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
    margin: 0,
  });

  // 우측 아이템
  const rightItems = data.right.items || [];
  rightItems.forEach((item, i) => {
    const itemY = startY + 0.7 + i * 0.45;
    slide.addShape(pres.ShapeType.rect, {
      x: rightX + 0.3,
      y: itemY + 0.1,
      w: 0.12,
      h: 0.12,
      fill: { color: C.success },
    });
    slide.addText(item, {
      x: rightX + 0.55,
      y: itemY,
      w: panelW - 0.85,
      h: 0.35,
      fontSize: SIZE.small,
      fontFace: FONT.body,
      color: C.text,
      valign: "middle",
      margin: 0,
    });
  });

  // 중앙 화살표
  const arrowY = startY + panelH / 2 - 0.2;
  slide.addText("\u25B6", {
    x: leftX + panelW - 0.05,
    y: arrowY,
    w: panelGap + 0.1,
    h: 0.4,
    fontSize: SIZE.h3,
    fontFace: FONT.body,
    color: C.accent,
    align: "center",
    valign: "middle",
    margin: 0,
  });

  // 하단 메시지
  if (data.bottomMessage) {
    slide.addShape(pres.ShapeType.rect, {
      x: LAYOUT.mx,
      y: startY + panelH + 0.25,
      w: LAYOUT.cw,
      h: 0.5,
      fill: { color: C.primary },
    });
    slide.addText(data.bottomMessage, {
      x: LAYOUT.mx,
      y: startY + panelH + 0.25,
      w: LAYOUT.cw,
      h: 0.5,
      fontSize: SIZE.small,
      fontFace: FONT.header,
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
  }
}

module.exports = comparison;
