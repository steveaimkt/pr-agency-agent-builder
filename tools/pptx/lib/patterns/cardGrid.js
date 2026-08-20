/**
 * cardGrid · 2~4열 카드 그리드
 * data: { title, cards: [{icon?, title, body, color?}], columns: 2|3|4 }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function cardGrid(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const cards = data.cards || [];
  const cols = data.columns || 3;
  const rows = Math.ceil(cards.length / cols);
  const cardGap = 0.25;
  const totalGapX = cardGap * (cols - 1);
  const cardW = (LAYOUT.cw - totalGapX) / cols;
  const totalAvailH = LAYOUT.bottomY - LAYOUT.contentY - 0.2;
  const totalGapY = rows > 1 ? cardGap * (rows - 1) : 0;
  const cardH = rows > 1 ? (totalAvailH - totalGapY) / rows : Math.min(totalAvailH, 3.2);
  const startY = LAYOUT.contentY;

  cards.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = LAYOUT.mx + col * (cardW + cardGap);
    const y = startY + row * (cardH + cardGap);
    const accentColor = card.color || C.secondary;

    // 카드 배경
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: y,
      w: cardW,
      h: cardH,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0,
      shadow: makeShadow("soft"),
    });

    // 좌측 액센트 바
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: y,
      w: 0.06,
      h: cardH,
      fill: { color: accentColor },
    });

    let innerY = y + 0.25;
    const innerX = x + 0.3;
    const innerW = cardW - 0.55;

    // 아이콘 (텍스트 이모지)
    if (card.icon) {
      slide.addText(card.icon, {
        x: innerX,
        y: innerY,
        w: 0.5,
        h: 0.5,
        fontSize: SIZE.h3,
        fontFace: FONT.body,
        margin: 0,
      });
      innerY += 0.5;
    }

    // 카드 제목
    slide.addText(card.title, {
      x: innerX,
      y: innerY,
      w: innerW,
      h: 0.4,
      fontSize: SIZE.h4,
      fontFace: FONT.header,
      color: C.text,
      bold: true,
      margin: 0,
    });
    innerY += 0.45;

    // 카드 본문
    if (card.body) {
      const bodyH = cardH - (innerY - y) - 0.2;
      slide.addText(card.body, {
        x: innerX,
        y: innerY,
        w: innerW,
        h: Math.max(bodyH, 0.4),
        fontSize: SIZE.small,
        fontFace: FONT.body,
        color: C.muted,
        valign: "top",
        margin: 0,
      });
    }
  });
}

module.exports = cardGrid;
