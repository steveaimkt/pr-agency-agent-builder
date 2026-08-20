#!/usr/bin/env node
/*
 * 제안 PPT 만들기
 *
 *   node tools/pptx/make-deck.js <목차파일> <챕터초안파일> [내보낼이름]
 *
 * 예:
 *   node tools/pptx/make-deck.js output/02-제안-목차.md output/03-챕터-초안.md
 *
 * 색과 글자는 tools/design.md 를 따른다. 새로 고르지 않는다.
 *
 * 규칙
 *   초안에 글이 있는 항목만 슬라이드로 만든다
 *   한 항목 = 슬라이드 두 장 (뒷장은 넘칠 때만)
 *   [FACT-CHECK] 와 [확인 필요] 는 노란 배경으로 크게
 *
 * npm install 이 필요 없다. node_modules 를 동봉했다.
 */
const fs = require('fs');
const path = require('path');
const PptxGenJS = require(path.join(__dirname, 'node_modules', 'pptxgenjs'));

const INK = '2A2A28';      // WMBB 잉크
const PAPER = 'F3F3F2';    // WMBB 종이
const YELLOW = 'EBFF2C';   // WMBB 형광
const GRAY = '848383';     // WMBB 메타
const CARD = 'FFFFFF';
const LINE = 'EBEBEB';
const BODY = '4C4D59';   // WMBB 본문
const FADE = 'AFAFAC';   // WMBB 흐린 글자
const FONT = 'Pretendard'; // 디자인 시스템 글꼴. 없으면 시스템 글꼴로 넘어간다

const [, , outlinePath, draftPath, outName] = process.argv;

if (!outlinePath) {
  console.error('쓰는 법: node tools/pptx/make-deck.js <목차파일> [챕터초안파일] [내보낼이름]');
  process.exit(1);
}

const read = (p) => (p && fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');

const outline = read(outlinePath);
const draft = read(draftPath);

if (!outline.trim()) {
  console.error(`목차 파일을 못 찾았습니다: ${outlinePath}`);
  process.exit(1);
}

/* 목차에서 항목을 뽑는다. 헤딩(##, ###) 또는 번호 목록 */
function parseOutline(md) {
  const items = [];
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    let m;
    if ((m = line.match(/^#{2,4}\s+(.+)$/))) items.push(m[1].trim());
    else if ((m = line.match(/^(?:\d+[.)]|[-*])\s+(.+)$/))) {
      const t = m[1].replace(/\*\*/g, '').trim();
      if (t.length >= 2 && t.length <= 60) items.push(t);
    }
  }
  return items.filter((v, i, a) => a.indexOf(v) === i);
}

/* 초안에서 그 항목에 해당하는 문단을 찾는다 */
function bodyFor(title, md) {
  if (!md) return [];
  const key = title.replace(/[^가-힣A-Za-z0-9]/g, '').slice(0, 8);
  const blocks = md.split(/\n(?=#{1,4}\s)/);
  const hit = blocks.find((b) => b.replace(/[^가-힣A-Za-z0-9]/g, '').includes(key));
  const src = hit || '';
  return src
    .split('\n')
    .map((s) => s.replace(/^[#>\-*\s]+/, '').trim())
    .filter((s) => s.length > 4)
    .slice(1, 7);
}

const items = parseOutline(outline);
if (!items.length) {
  console.error('목차에서 항목을 못 찾았습니다. 헤딩(##) 이나 번호 목록으로 적어 주세요.');
  process.exit(1);
}

/* 초안에 글이 있는 항목만 슬라이드로 만든다.
 *   초안 없는 항목까지 만들면 빈 장이 절반을 넘는다.
 *   실측 · 목차 57항목으로 돌렸더니 116장 중 51장이 「여기에 내용을 채웁니다」였다.
 *   집필 담당은 핵심 챕터만 쓴다. 목차 전체를 쓰지 않는다. 그게 정상이다.
 */
const parsed = items.map((title) => ({ title, lines: bodyFor(title, draft) }));
const written = parsed.filter((x) => x.lines.length);
const skipped = parsed.length - written.length;

if (!written.length) {
  console.error('초안에 글이 있는 목차 항목이 하나도 없습니다.');
  console.error('  집필 담당이 쓴 챕터가 있어야 PPT 가 나옵니다.');
  console.error(`  초안 파일을 확인해 주세요: ${draftPath || '(안 주셨습니다)'}`);
  process.exit(1);
}

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.author = '대행사';
pptx.title = '제안 골격';

let factChecks = 0;

/* 노란 표시가 들어간 줄을 따로 뽑는다 */
const markFact = (slide, lines, yStart) => {
  let y = yStart;
  for (const line of lines) {
    const isFact = /\[FACT-CHECK\]|\[확인 필요\]/i.test(line);
    if (isFact) factChecks += 1;
    slide.addText(line, {
      fontFace: FONT,
      x: 0.8,
      y,
      w: 11.7,
      h: 0.62,
      fontSize: isFact ? 20 : 18,
      bold: isFact,
      color: isFact ? INK : BODY,
      fill: isFact ? { color: YELLOW } : undefined,
      valign: 'middle',
      margin: isFact ? 6 : 0,
    });
    y += 0.72;
  }
};

/* 표지 */
const cover = pptx.addSlide();
cover.background = { color: INK };
cover.addText('제안 골격', {
      fontFace: FONT,
  x: 0.8, y: 2.5, w: 11.7, h: 1.4, fontSize: 54, bold: true, color: 'FFFFFF',
});
cover.addText(`목차 ${items.length}항목 중 초안이 있는 ${written.length}항목`, {
      fontFace: FONT,
  x: 0.8, y: 4.0, w: 11.7, h: 0.7, fontSize: 22, color: FADE,
});
cover.addText('검수를 통과한 목차로 만들었습니다', {
      fontFace: FONT,
  x: 0.8, y: 6.3, w: 11.7, h: 0.5, fontSize: 16, color: GRAY,
});

/* 한 항목 = 슬라이드 두 장. 뒷장은 넘칠 때만 만든다 */
let slideCount = 1;
written.forEach(({ title, lines }, i) => {
  const half = Math.ceil(lines.length / 2) || 1;

  const a = pptx.addSlide();
  slideCount += 1;
  a.background = { color: PAPER };
  a.addText(`${String(i + 1).padStart(2, '0')}`, {
      fontFace: FONT,
    x: 0.8, y: 0.5, w: 2, h: 0.5, fontSize: 16, color: GRAY, bold: true,
  });
  a.addText(title, {
      fontFace: FONT,
    x: 0.8, y: 1.1, w: 11.7, h: 1.1, fontSize: 36, bold: true, color: INK,
  });
  markFact(a, lines.slice(0, half), 2.6);

  const rest = lines.slice(half);
  if (!rest.length) return;

  const b = pptx.addSlide();
  slideCount += 1;
  b.background = { color: PAPER };
  b.addText(`${String(i + 1).padStart(2, '0')} 이어서`, {
      fontFace: FONT,
    x: 0.8, y: 0.5, w: 4, h: 0.5, fontSize: 16, color: GRAY, bold: true,
  });
  markFact(b, rest, 1.4);
});

/* 마지막 · 확인 필요 목록 */
const last = pptx.addSlide();
slideCount += 1;
last.background = { color: factChecks ? YELLOW : PAPER };
last.addText(factChecks ? '확인이 필요합니다' : '확인 필요 없음', {
      fontFace: FONT,
  x: 0.8, y: 2.6, w: 11.7, h: 1.1, fontSize: 44, bold: true, color: INK,
});
last.addText(
  factChecks
    ? `노란 표시가 ${factChecks}개 있습니다. 사람이 확인하기 전에는 발표용이 아닙니다.`
    : '노란 표시가 없습니다. 그래도 사람이 한 번 봅니다.',
  { x: 0.8, y: 4.0, w: 11.7, h: 0.8, fontSize: 20, color: INK }
);

const file = outName || 'output/06-제안-PPT.pptx';
fs.mkdirSync(path.dirname(file), { recursive: true });

pptx.writeFile({ fileName: file }).then((f) => {
  console.log(`제안 PPT 를 만들었습니다 · ${f}`);
  console.log(`  목차 ${items.length}항목 중 초안이 있는 ${written.length}항목 → 슬라이드 ${slideCount}장`);
  if (skipped) {
    console.log(`  초안이 없어 뺀 항목 ${skipped}개 · 집필 담당이 더 쓰면 그만큼 늘어납니다`);
  }
  console.log(`  노란 표시 ${factChecks}개`);
  if (factChecks) console.log('  ⚠️ 노란 게 남아 있으면 발표용이 아닙니다.');
});
