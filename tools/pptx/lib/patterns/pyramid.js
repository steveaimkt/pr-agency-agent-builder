/**
 * pyramid · 피라미드 계층 (상→하, 위가 좁고 아래가 넓음)
 * data: { title, layers: [{label, desc?}] }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function pyramid(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const layers = data.layers || [];
  const count = layers.length;
  const totalH = LAYOUT.bottomY - LAYOUT.contentY - 0.2;
  const layerGap = 0.05;
  const layerH = (totalH - layerGap * (count - 1)) / count;
  const maxW = LAYOUT.cw;
  const minW = maxW * 0.25;

  // 색상: 상단이 가장 진하고, 하단으로 갈수록 밝아짐
  const pyramidColors = [C.primary, "1A4F7A", C.secondary, "38B2CC", "7DD3E8"];

  layers.forEach((layer, i) => {
    // 상→하: 인덱스 0이 가장 좁음 (꼭대기)
    const ratio = count > 1 ? i / (count - 1) : 1;
    const w = minW + (maxW - minW) * ratio;
    const x = LAYOUT.mx + (maxW - w) / 2;
    const y = LAYOUT.contentY + i * (layerH + layerGap);
    const color = pyramidColors[i % pyramidColors.length];

    // 계층 블록
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: y,
      w: w,
      h: layerH,
      fill: { color: color },
      shadow: makeShadow("soft"),
    });

    // 라벨
    const labelText = layer.desc ? `${layer.label}  |  ${layer.desc}` : layer.label;
    slide.addText(labelText, {
      x: x,
      y: y,
      w: w,
      h: layerH,
      fontSize: w < 3 ? SIZE.caption : SIZE.body,
      fontFace: FONT.header,
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
  });
}

module.exports = pyramid;
