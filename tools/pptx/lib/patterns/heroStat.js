/**
 * heroStat — 대형 숫자 3~4개 카드
 * data: { title, subtitle?, stats: [{value, label, color?}], caption? }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle, addCaption } = require("../design-system");

function heroStat(slide, pres, data) {
  // 배경
  slide.background = { fill: C.light };

  // 제목
  addTitle(slide, data.title);

  // 부제
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: LAYOUT.mx,
      y: LAYOUT.titleY + 0.6,
      w: LAYOUT.cw,
      h: 0.4,
      fontSize: SIZE.body,
      fontFace: FONT.body,
      color: C.muted,
      margin: 0,
    });
  }

  const stats = data.stats || [];
  const count = stats.length;
  const cardGap = 0.3;
  const totalGap = cardGap * (count - 1);
  const cardW = (LAYOUT.cw - totalGap) / count;
  const cardH = 2.4;
  const startY = data.subtitle ? LAYOUT.contentY + 0.4 : LAYOUT.contentY + 0.2;

  stats.forEach((stat, i) => {
    const x = LAYOUT.mx + i * (cardW + cardGap);
    const accentColor = stat.color || C.secondary;

    // 카드 배경
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: startY,
      w: cardW,
      h: cardH,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0,
      shadow: makeShadow("soft"),
    });

    // 상단 액센트 바
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: startY,
      w: cardW,
      h: 0.06,
      fill: { color: accentColor },
    });

    // 대형 숫자
    slide.addText(stat.value, {
      x: x,
      y: startY + 0.4,
      w: cardW,
      h: 1.0,
      fontSize: SIZE.display,
      fontFace: FONT.header,
      color: accentColor,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    // 라벨
    slide.addText(stat.label, {
      x: x + 0.2,
      y: startY + 1.5,
      w: cardW - 0.4,
      h: 0.6,
      fontSize: SIZE.small,
      fontFace: FONT.body,
      color: C.text,
      align: "center",
      valign: "top",
      margin: 0,
    });
  });

  // 캡션
  if (data.caption) {
    addCaption(slide, data.caption);
  }
}

module.exports = heroStat;
