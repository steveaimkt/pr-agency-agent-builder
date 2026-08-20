/**
 * tableInsight · 데이터 테이블 + 인사이트
 * data: { title, headers: [], rows: [[]], highlightRow?, insight? }
 */
const { C, FONT, SIZE, LAYOUT, makeShadow, addTitle } = require("../design-system");

function tableInsight(slide, pres, data) {
  slide.background = { fill: C.light };

  addTitle(slide, data.title);

  const headers = data.headers || [];
  const rows = data.rows || [];
  const colCount = headers.length;
  const hasInsight = !!data.insight;

  // 테이블 영역 계산
  const tableW = LAYOUT.cw;
  const colW = tableW / colCount;
  const rowH = 0.42;
  const headerH = 0.45;
  const tableX = LAYOUT.mx;
  const tableY = LAYOUT.contentY;
  const tableH = headerH + rowH * rows.length;

  // 테이블 외곽
  slide.addShape(pres.ShapeType.rect, {
    x: tableX,
    y: tableY,
    w: tableW,
    h: tableH,
    fill: { color: C.card },
    line: { color: C.border, width: 1 },
    rectRadius: 0,
    shadow: makeShadow("soft"),
  });

  // 헤더 배경
  slide.addShape(pres.ShapeType.rect, {
    x: tableX,
    y: tableY,
    w: tableW,
    h: headerH,
    fill: { color: C.primary },
  });

  // 헤더 텍스트
  headers.forEach((header, ci) => {
    slide.addText(header, {
      x: tableX + ci * colW,
      y: tableY,
      w: colW,
      h: headerH,
      fontSize: SIZE.small,
      fontFace: FONT.header,
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
  });

  // 데이터 행
  rows.forEach((row, ri) => {
    const rowY = tableY + headerH + ri * rowH;
    const isHighlight = data.highlightRow === ri;
    const isEven = ri % 2 === 0;

    // 행 배경 (줄무늬 + 하이라이트)
    if (isHighlight) {
      slide.addShape(pres.ShapeType.rect, {
        x: tableX,
        y: rowY,
        w: tableW,
        h: rowH,
        fill: { color: "EEEDEB" }, // 앰버 라이트
      });
    } else if (isEven) {
      slide.addShape(pres.ShapeType.rect, {
        x: tableX,
        y: rowY,
        w: tableW,
        h: rowH,
        fill: { color: C.light },
      });
    }

    // 셀 텍스트
    row.forEach((cell, ci) => {
      slide.addText(String(cell), {
        x: tableX + ci * colW,
        y: rowY,
        w: colW,
        h: rowH,
        fontSize: SIZE.small,
        fontFace: FONT.body,
        color: isHighlight ? C.primary : C.text,
        bold: isHighlight,
        align: "center",
        valign: "middle",
        margin: 0,
      });
    });

    // 행 구분선
    slide.addShape(pres.ShapeType.rect, {
      x: tableX,
      y: rowY + rowH - 0.01,
      w: tableW,
      h: 0.01,
      fill: { color: C.border },
    });
  });

  // 인사이트 박스
  if (hasInsight) {
    const insightY = tableY + tableH + 0.25;
    const insightH = 0.6;

    // 인사이트 배경
    slide.addShape(pres.ShapeType.rect, {
      x: tableX,
      y: insightY,
      w: tableW,
      h: insightH,
      fill: { color: "EEEDEB" }, // 블루 라이트
      line: { color: C.secondary, width: 1.5 },
      rectRadius: 0,
    });

    // 액센트 바
    slide.addShape(pres.ShapeType.rect, {
      x: tableX,
      y: insightY,
      w: 0.06,
      h: insightH,
      fill: { color: C.secondary },
    });

    // 인사이트 텍스트
    slide.addText([
      { text: "Insight  ", options: { bold: true, color: C.secondary, fontSize: SIZE.small, fontFace: FONT.header } },
      { text: data.insight, options: { color: C.text, fontSize: SIZE.small, fontFace: FONT.body } },
    ], {
      x: tableX + 0.25,
      y: insightY,
      w: tableW - 0.5,
      h: insightH,
      valign: "middle",
      margin: 0,
    });
  }
}

module.exports = tableInsight;
