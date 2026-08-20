#!/usr/bin/env node
/*
 * 장표 HTML 을 파워포인트 파일로 바꾼다
 *
 *   node tools/pptx/html2pptx.js <장표.html> [내보낼이름.pptx]
 *
 * 예:
 *   node tools/pptx/html2pptx.js output/06-제안-PPT.html
 *
 * 무엇이 되나
 *   표는 파워포인트 표로, 막대는 파워포인트 차트로 들어간다.
 *   그림이 아니라서 고객사가 열어서 글자를 고칠 수 있다.
 *
 * 전제
 *   tools/slide-design.md 규격으로 만든 HTML 이어야 한다.
 *   그 규격의 이름표(head · h · card · r3 · r4 · foot)를 보고 읽는다.
 *
 * npm install 이 필요 없다. node_modules 를 동봉했다.
 */
const fs = require('fs');
const path = require('path');
const PptxGenJS = require(path.join(__dirname, 'node_modules', 'pptxgenjs'));

/* ── 색 · tools/slide-design.md 와 같은 값. # 를 붙이지 않는다 ── */
const INK = '2A2A28';
const PAPER = 'F3F3F2';
const CARD = 'FFFFFF';
const LINE = 'E6E2DC';
const SOFT = 'F0EDE8';
const BODY = '4C4D59';
const META = '848383';
const SAND = 'E0CCBE';
const SAND2 = 'C9B0A0';
const HL = 'EBFF2C';

const PX = 96; // 1280px = 13.333in
const inch = (px) => px / PX;

const [, , src, outArg] = process.argv;
if (!src) {
  console.error('쓰는 법: node tools/pptx/html2pptx.js <장표.html> [내보낼이름.pptx]');
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error(`파일을 못 찾았습니다: ${src}`);
  process.exit(1);
}

const html = fs.readFileSync(src, 'utf8');

/* ── 태그를 걷어내고 글자만 남긴다 ── */
const text = (s) =>
  String(s || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

/* class 이름에 그 낱말이 통째로 들어 있나 */
const hasCls = (attr, name) =>
  new RegExp(`(^|[\\s"'])${name}([\\s"']|$)`).test(attr || '');

/* 여는 태그를 만나면 짝이 맞는 닫는 태그까지 통째로 잘라 낸다.
   장표 안에 div 가 여러 겹이라 정규식 하나로는 못 자른다. */
function blocks(scope, cls) {
  const out = [];
  const open = /<div\b([^>]*)>/gi;
  let m;
  while ((m = open.exec(scope))) {
    if (!hasCls(m[1], cls)) continue;
    let depth = 1;
    const start = m.index;
    const bodyFrom = open.lastIndex;
    const tag = /<(\/?)div\b[^>]*>/gi;
    tag.lastIndex = bodyFrom;
    let t;
    while (depth > 0 && (t = tag.exec(scope))) {
      depth += t[1] ? -1 : 1;
    }
    if (depth !== 0) continue;
    out.push({ inner: scope.slice(bodyFrom, tag.lastIndex - 6), end: tag.lastIndex });
    open.lastIndex = start + 1;
  }
  return out;
}

/* 칸(.c) 을 순서대로 뽑는다 */
const cells = (row) =>
  blocks(row, 'c').map((b) => text(b.inner));

/* 스타일 값 하나 꺼내기 */
function styleOf(chunk, prop) {
  const m = new RegExp(`${prop}\\s*:\\s*([^;"']+)`, 'i').exec(chunk || '');
  return m ? m[1].trim() : null;
}

/* ── 장표를 하나씩 읽는다 ── */
const slides = [];
const secRe = /<section\b([^>]*)>([\s\S]*?)<\/section>/gi;
let s;
while ((s = secRe.exec(html))) {
  const attr = s[1];
  const body = s[2];
  if (!hasCls(attr, 'slide')) continue;

  const slide = { cover: hasCls(attr, 'cover'), label: '', title: '', foot: [] };

  /* 머리 표시 */
  const lab = /<div[^>]*class="[^"]*\blab\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(body);
  slide.label = lab ? text(lab[1]) : '';

  /* 제목 · 표지는 56px 덩어리, 본문은 .h */
  const h = /<div[^>]*class="[^"]*\bh\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(body);
  if (h) slide.title = text(h[1]);
  else {
    const big = /<div[^>]*font-size:\s*56px[\s\S]*?>([\s\S]*?)<\/div>/i.exec(body);
    if (big) slide.title = text(big[1]);
  }
  if (slide.cover) {
    const sub = /<div[^>]*font-size:\s*20px[^>]*>([\s\S]*?)<\/div>/i.exec(body);
    if (sub) slide.sub = text(sub[1]);
  }

  /* 바닥 두 줄 */
  const ft = blocks(body, 'foot')[0];
  if (ft) slide.foot = blocks(ft.inner, '').length ? [] : [];
  const footRe = /<div[^>]*class="[^"]*\bfoot\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/section>/i;
  const fm = footRe.exec(body + '</section>');
  if (fm) {
    slide.foot = (fm[1].match(/<div[^>]*>([\s\S]*?)<\/div>/gi) || [])
      .map((d) => text(d))
      .filter(Boolean)
      .slice(0, 2);
  }

  /* 표 · .r3 / .r4 줄을 모은다 */
  const rows = [];
  const rowRe = /<div\b([^>]*\b(?:r3|r4)\b[^>]*)>/gi;
  let r;
  while ((r = rowRe.exec(body))) {
    const from = rowRe.lastIndex;
    let depth = 1;
    const tag = /<(\/?)div\b[^>]*>/gi;
    tag.lastIndex = from;
    let t;
    while (depth > 0 && (t = tag.exec(body))) depth += t[1] ? -1 : 1;
    const inner = body.slice(from, tag.lastIndex - 6);
    const cs = cells(inner);
    if (cs.length) {
      rows.push({
        head: hasCls(r[1], 'th'),
        bold: hasCls(r[1], 'on'),
        cells: cs,
      });
    }
    rowRe.lastIndex = r.index + 1;
  }
  if (rows.length) slide.table = rows;

  /* 막대 · 뒷판(height:268px) 안의 채움 높이로 값을 되짚는다 */
  const barTitle = /<div[^>]*font-size:\s*15px;\s*font-weight:\s*600[^>]*>([\s\S]*?)<\/div>/i.exec(body);
  const cols = [];
  const trackRe = /height:\s*268px[\s\S]{0,400}?height:\s*(\d+)px;\s*background:\s*#([0-9A-Fa-f]{6})/g;
  let tr;
  while ((tr = trackRe.exec(body))) {
    cols.push({ h: Number(tr[1]), color: tr[2].toUpperCase() });
  }
  if (cols.length >= 2) {
    /* 막대 위 숫자와 아래 이름표 */
    const caps = (body.match(/<div style="font-size:\s*20px[^"]*">([\s\S]*?)<\/div>/gi) || [])
      .map((d) => text(d));
    const foots = [];
    const fr = /flex-grow:\s*1;\s*flex-basis:\s*0;\s*text-align:\s*center[^>]*>([\s\S]*?)<\/div>/gi;
    let f;
    while ((f = fr.exec(body))) foots.push(text(f[1]));
    slide.bars = cols.map((c, i) => ({
      name: foots[i] || caps[i] || `${i + 1}`,
      shown: caps[i] || '',
      value: Number((caps[i] || '').replace(/[^\d.]/g, '')) || c.h,
      hot: c.color === SAND2,
    }));
    slide.barTitle = barTitle ? text(barTitle[1]) : '';
    /* 목표선 */
    const goal = /border-top:\s*1px dashed[\s\S]{0,300}?padding:\s*0 8px">([\s\S]*?)<\/div>/i.exec(body);
    if (goal) slide.goal = text(goal[1]);
  }

  /* 큰 문구 한 줄 (40px) 과 확인 필요 표시 */
  const big = /<div[^>]*font-size:\s*40px[^>]*>([\s\S]*?)<\/div>/i.exec(body);
  if (big) slide.big = text(big[1]);
  const flag = /<span[^>]*class="[^"]*\bflag\b[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(body);
  if (flag) slide.flag = text(flag[1]);
  const lead = /<div[^>]*font-size:\s*20px;\s*color:\s*#4C4D59;\s*line-height[^>]*>([\s\S]*?)<\/div>/i.exec(body);
  if (lead) slide.lead = text(lead[1]);

  slides.push(slide);
}

if (!slides.length) {
  console.error('장표를 못 찾았습니다. <section class="slide"> 로 되어 있는지 보세요.');
  console.error('tools/slide-design.md 규격으로 만든 HTML 이어야 합니다.');
  process.exit(1);
}

/* ── 파워포인트로 옮긴다 ── */
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.333 × 7.5in · 슬라이드를 넣기 전에 잡는다
pptx.title = path.basename(src, '.html');

let flags = 0;
let charts = 0;
let tables = 0;

for (const sl of slides) {
  const s2 = pptx.addSlide();
  s2.background = { color: sl.cover ? INK : PAPER };
  const ink = sl.cover ? 'FFFFFF' : INK;
  const meta = sl.cover ? 'AFAFAC' : META;

  /* 머리 표시 · 점 하나와 이름표 */
  if (sl.label) {
    s2.addShape(pptx.ShapeType.ellipse, {
      x: inch(72), y: inch(64) + 0.03, w: 0.1, h: 0.1, fill: { color: SAND },
    });
    s2.addText(sl.label, {
      x: inch(72) + 0.2, y: inch(64) - 0.05, w: 8, h: 0.28,
      fontSize: 11, color: meta, bold: false, charSpacing: 2, margin: 0,
      fontFace: 'IBM Plex Sans KR',
    });
  }

  /* 제목 */
  if (sl.title) {
    s2.addText(sl.title, {
      x: inch(72), y: sl.cover ? 2.5 : inch(64) + 0.42,
      w: 11.6, h: sl.cover ? 1.6 : 0.85,
      fontSize: sl.cover ? 34 : 24, bold: true, color: ink,
      lineSpacingMultiple: 1.25, margin: 0, valign: 'top',
      fontFace: 'IBM Plex Sans KR',
    });
  }
  if (sl.cover && sl.sub) {
    s2.addText(sl.sub, {
      x: inch(72), y: 4.3, w: 11.6, h: 0.4,
      fontSize: 14, color: 'AFAFAC', margin: 0, fontFace: 'IBM Plex Sans KR',
    });
  }

  const TOP = 1.55;
  const H = 4.3;

  /* 표 · 파워포인트 표로 */
  if (sl.table) {
    tables += 1;
    const head = sl.table.find((r) => r.head);
    const body = sl.table.filter((r) => !r.head);
    const nCol = (head || body[0]).cells.length;
    const rows = [];
    if (head) {
      rows.push(
        head.cells.map((c, i) => ({
          text: c,
          options: {
            bold: false, color: META, fontSize: 10, align: i === 0 ? 'left' : 'right',
            fill: { color: CARD }, border: [
              { type: 'none' }, { type: 'none' },
              { pt: 1, color: LINE }, { type: 'none' },
            ],
          },
        }))
      );
    }
    body.forEach((r, ri) => {
      rows.push(
        r.cells.map((c, i) => ({
          text: c,
          options: {
            bold: r.bold, color: INK, fontSize: 13,
            align: i === 0 ? 'left' : 'right',
            fill: { color: CARD },
            border: [
              { type: 'none' }, { type: 'none' },
              { pt: 1, color: ri === body.length - 1 ? CARD : SOFT },
              { type: 'none' },
            ],
          },
        }))
      );
    });
    const w = 11.6;
    const first = nCol === 3 ? w * 0.42 : w * 0.34;
    const rest = (w - first) / (nCol - 1);
    s2.addTable(rows, {
      x: inch(72), y: TOP, w,
      colW: [first, ...Array(nCol - 1).fill(rest)],
      rowH: 0.42, valign: 'middle', margin: [6, 10, 6, 10],
      fontFace: 'IBM Plex Sans KR',
    });
  }

  /* 막대 · 파워포인트 차트로. 그림이 아니다 */
  if (sl.bars) {
    charts += 1;
    s2.addShape(pptx.ShapeType.roundRect, {
      x: inch(72), y: TOP, w: 11.6, h: H,
      fill: { color: CARD }, line: { color: LINE, width: 1 }, rectRadius: 0.2,
    });
    if (sl.barTitle) {
      s2.addText(sl.barTitle, {
        x: inch(72) + 0.4, y: TOP + 0.22, w: 10.8, h: 0.3,
        fontSize: 11, bold: true, color: INK, margin: 0, fontFace: 'IBM Plex Sans KR',
      });
    }
    s2.addChart(
      pptx.ChartType.bar,
      [{
        name: sl.barTitle || '값',
        labels: sl.bars.map((b) => b.name),
        values: sl.bars.map((b) => b.value),
      }],
      {
        x: inch(72) + 0.35, y: TOP + 0.6, w: 10.9, h: H - 0.95,
        barDir: 'col', barGapWidthPct: 60,
        chartColors: sl.bars.map((b) => (b.hot ? SAND2 : SAND)),
        showLegend: false, showTitle: false,
        showValue: true, dataLabelPosition: 'outEnd',
        dataLabelColor: INK, dataLabelFontSize: 12, dataLabelFontFace: 'IBM Plex Sans KR',
        catAxisLabelColor: BODY, catAxisLabelFontSize: 11,
        catAxisLabelFontFace: 'IBM Plex Sans KR',
        catGridLine: { style: 'none' },
        valAxisHidden: true,
        valGridLine: { color: SOFT, size: 1 },
      }
    );
    if (sl.goal) {
      s2.addText(sl.goal, {
        x: inch(72) + 0.4, y: TOP + H - 0.34, w: 10.8, h: 0.26,
        fontSize: 10, color: META, margin: 0, fontFace: 'IBM Plex Sans KR',
      });
    }
  }

  /* 결정적인 한 건 · 카드 하나 */
  if (sl.big) {
    s2.addShape(pptx.ShapeType.roundRect, {
      x: inch(72), y: TOP, w: 11.6, h: 3.1,
      fill: { color: CARD }, line: { color: LINE, width: 1 }, rectRadius: 0.2,
    });
    let y = TOP + 0.42;
    if (sl.flag) {
      flags += 1;
      s2.addText(sl.flag, {
        x: inch(72) + 0.5, y, w: 4.6, h: 0.36,
        fontSize: 12, bold: true, color: INK, fill: { color: HL },
        align: 'center', valign: 'middle', margin: 4, fontFace: 'IBM Plex Sans KR',
      });
      y += 0.6;
    }
    s2.addText(sl.big, {
      x: inch(72) + 0.5, y, w: 10.6, h: 0.7,
      fontSize: 26, bold: true, color: INK, margin: 0, fontFace: 'IBM Plex Sans KR',
    });
    y += 0.85;
    if (sl.lead) {
      s2.addText(sl.lead, {
        x: inch(72) + 0.5, y, w: 10.6, h: 1.1,
        fontSize: 13, color: BODY, lineSpacingMultiple: 1.5, margin: 0,
        fontFace: 'IBM Plex Sans KR',
      });
    }
  }

  /* 바닥 두 줄 */
  if (sl.foot.length) {
    s2.addText(sl.foot[0] || '', {
      x: inch(72), y: 6.85, w: 7.4, h: 0.28,
      fontSize: 9, color: meta, margin: 0, fontFace: 'IBM Plex Sans KR',
    });
    if (sl.foot[1]) {
      s2.addText(sl.foot[1], {
        x: inch(72) + 7.5, y: 6.85, w: 4.1, h: 0.28,
        fontSize: 9, color: meta, align: 'right', margin: 0,
        fontFace: 'IBM Plex Sans KR',
      });
    }
  }
}

const out = outArg || src.replace(/\.html?$/i, '.pptx');
fs.mkdirSync(path.dirname(out), { recursive: true });

pptx.writeFile({ fileName: out }).then((f) => {
  console.log(`파워포인트 파일을 만들었습니다 · ${f}`);
  console.log(`  장표 ${slides.length}장 · 표 ${tables}개 · 막대 ${charts}개`);
  console.log(`  표와 막대가 그림이 아니라 진짜 표와 차트로 들어갔습니다. 열어서 고칠 수 있습니다.`);
  if (flags) console.log(`  ⚠️ 확인 필요 표시가 ${flags}개 있습니다. 발표용이 아닙니다.`);
  console.log(`  ⚠️ 글꼴은 IBM Plex Sans KR 입니다. 없는 컴퓨터에서는 기본 글꼴로 열립니다.`);
});
