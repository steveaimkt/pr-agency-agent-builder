/**
 * funnel · 퍼널 다이어그램
 * data: { title, stages: [{label, value?, width}] }
 *   width: 0~1 비율 (1이 가장 넓음)
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function funnel(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const stages = data.stages || [];
  const count = stages.length;
  const totalH = LAYOUT.bottomY - LAYOUT.contentY - 0.3;
  const stageGap = 0.06;
  const stageH = (totalH - stageGap * (count - 1)) / count;
  const maxW = LAYOUT.cw;

  // 퍼널 색상 그라데이션 (primary → secondary → accent)
  const funnelColors = [C.primary, "4C4D59", C.secondary, "848383", C.accent];

  stages.forEach((stage, i) => {
    const w = maxW * (stage.width || 1 - i * 0.15);
    const x = LAYOUT.mx + (maxW - w) / 2;
    const y = LAYOUT.contentY + i * (stageH + stageGap);
    const color = funnelColors[i % funnelColors.length];

    // 퍼널 단계 바
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: y,
      w: w,
      h: stageH,
      fill: { color: color },
      shadow: makeShadow("soft"),
    });

    // 라벨 + 값
    const labelText = stage.value ? `${stage.label}  \u2014  ${stage.value}` : stage.label;
    slide.addText(labelText, {
      x: x,
      y: y,
      w: w,
      h: stageH,
      fontSize: SIZE.body,
      fontFace: FONT.header,
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
  });
}

module.exports = funnel;
