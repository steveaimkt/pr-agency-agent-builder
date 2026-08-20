/**
 * processFlow — 3~5단계 수평 흐름
 * data: { title, steps: [{num, title, desc}] }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function processFlow(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const steps = data.steps || [];
  const count = steps.length;
  const arrowW = 0.35;
  const totalArrows = count - 1;
  const totalArrowW = arrowW * totalArrows;
  const stepW = (LAYOUT.cw - totalArrowW) / count;
  const stepH = 2.8;
  const startY = LAYOUT.contentY + 0.2;

  steps.forEach((step, i) => {
    const x = LAYOUT.mx + i * (stepW + arrowW);

    // 스텝 카드 배경
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: startY,
      w: stepW,
      h: stepH,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0,
      shadow: makeShadow("soft"),
    });

    // 넘버링 원형 배경 (사각형으로 구현)
    const numSize = 0.5;
    const numX = x + (stepW - numSize) / 2;
    slide.addShape(pres.ShapeType.rect, {
      x: numX,
      y: startY + 0.3,
      w: numSize,
      h: numSize,
      fill: { color: C.primary },
    });

    // 넘버링 텍스트
    slide.addText(String(step.num || i + 1), {
      x: numX,
      y: startY + 0.3,
      w: numSize,
      h: numSize,
      fontSize: SIZE.h4,
      fontFace: FONT.header,
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    // 스텝 제목
    slide.addText(step.title, {
      x: x + 0.15,
      y: startY + 1.0,
      w: stepW - 0.3,
      h: 0.5,
      fontSize: SIZE.h4,
      fontFace: FONT.header,
      color: C.text,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    // 스텝 설명
    if (step.desc) {
      slide.addText(step.desc, {
        x: x + 0.15,
        y: startY + 1.55,
        w: stepW - 0.3,
        h: 1.0,
        fontSize: SIZE.small,
        fontFace: FONT.body,
        color: C.muted,
        align: "center",
        valign: "top",
        margin: 0,
      });
    }

    // 화살표 (마지막 제외)
    if (i < count - 1) {
      const arrowX = x + stepW;
      const arrowMidY = startY + stepH / 2 - 0.15;
      slide.addText("\u25B6", {
        x: arrowX,
        y: arrowMidY,
        w: arrowW,
        h: 0.3,
        fontSize: SIZE.h4,
        fontFace: FONT.body,
        color: C.secondary,
        align: "center",
        valign: "middle",
        margin: 0,
      });
    }
  });
}

module.exports = processFlow;
