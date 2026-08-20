/**
 * orgChart · 조직도 (1+N 구조)
 * data: { title, root: {label}, children: [{label, desc?}] }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function orgChart(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const children = data.children || [];
  const childCount = children.length;

  // 루트 노드
  const rootW = 3.0;
  const rootH = 0.7;
  const rootX = LAYOUT.mx + (LAYOUT.cw - rootW) / 2;
  const rootY = LAYOUT.contentY + 0.1;

  slide.addShape(pres.ShapeType.rect, {
    x: rootX,
    y: rootY,
    w: rootW,
    h: rootH,
    fill: { color: C.primary },
    shadow: makeShadow("medium"),
  });

  slide.addText(data.root.label, {
    x: rootX,
    y: rootY,
    w: rootW,
    h: rootH,
    fontSize: SIZE.h4,
    fontFace: FONT.header,
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
    margin: 0,
  });

  // 루트에서 아래로 수직선
  const rootBottomY = rootY + rootH;
  const connectorY = rootBottomY + 0.25;
  const centerX = LAYOUT.mx + LAYOUT.cw / 2;

  slide.addShape(pres.ShapeType.rect, {
    x: centerX - 0.015,
    y: rootBottomY,
    w: 0.03,
    h: 0.25,
    fill: { color: C.border },
  });

  // 자식 노드
  const childGap = 0.25;
  const totalChildW = LAYOUT.cw;
  const childW = (totalChildW - childGap * (childCount - 1)) / childCount;
  const childH = 1.8;
  const childY = connectorY + 0.3;

  // 수평 연결선
  if (childCount > 1) {
    const firstChildCenterX = LAYOUT.mx + childW / 2;
    const lastChildCenterX = LAYOUT.mx + (childCount - 1) * (childW + childGap) + childW / 2;
    slide.addShape(pres.ShapeType.rect, {
      x: firstChildCenterX,
      y: connectorY,
      w: lastChildCenterX - firstChildCenterX,
      h: 0.03,
      fill: { color: C.border },
    });
  }

  children.forEach((child, i) => {
    const cx = LAYOUT.mx + i * (childW + childGap);
    const childCenterX = cx + childW / 2;

    // 수직 연결선 (수평선 → 자식)
    slide.addShape(pres.ShapeType.rect, {
      x: childCenterX - 0.015,
      y: connectorY,
      w: 0.03,
      h: 0.3,
      fill: { color: C.border },
    });

    // 자식 카드
    slide.addShape(pres.ShapeType.rect, {
      x: cx,
      y: childY,
      w: childW,
      h: childH,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0,
      shadow: makeShadow("soft"),
    });

    // 상단 컬러바
    slide.addShape(pres.ShapeType.rect, {
      x: cx,
      y: childY,
      w: childW,
      h: 0.06,
      fill: { color: C.secondary },
    });

    // 자식 라벨
    slide.addText(child.label, {
      x: cx + 0.15,
      y: childY + 0.2,
      w: childW - 0.3,
      h: 0.45,
      fontSize: SIZE.h4,
      fontFace: FONT.header,
      color: C.text,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    // 자식 설명
    if (child.desc) {
      slide.addText(child.desc, {
        x: cx + 0.15,
        y: childY + 0.7,
        w: childW - 0.3,
        h: childH - 0.9,
        fontSize: SIZE.small,
        fontFace: FONT.body,
        color: C.muted,
        align: "center",
        valign: "top",
        margin: 0,
      });
    }
  });
}

module.exports = orgChart;
