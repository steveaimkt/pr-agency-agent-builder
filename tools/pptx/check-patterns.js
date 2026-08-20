/*
 * 장표 패턴 10종 시험 인쇄
 *
 *   node tools/pptx/check-patterns.js [내보낼이름.pptx]
 *
 * ⚠️ 인자는 「검사할 파일」이 아니라 「새로 만들 파일 이름」이다.
 *    이미 있는 파일 이름을 주면 덮지 않고 멈춘다. 정말 덮으려면 --force 를 붙인다.
 *
 * 열 가지 패턴을 한 장씩 뽑아 준다. 색과 글꼴이 디자인 시스템 안인지 눈으로 본다.
 * 패턴이나 design-system.js 를 고친 뒤에는 이걸 한 번 돌린다.
 */
const path = require('path');
const TP = __dirname;
const PptxGenJS = require(path.join(TP, 'node_modules', 'pptxgenjs'));
const P = require(path.join(TP, 'lib', 'patterns'));
const { LAYOUT } = require(path.join(TP, 'lib', 'design-system'));

const pres = new PptxGenJS();
pres.defineLayout({ name: 'W', width: LAYOUT.slideW, height: LAYOUT.slideH });
pres.layout = 'W';

const D = {
  heroStat: { title: '한 해 성과', stats: [
    { value: '128', label: '보도 건수', unit: '건' },
    { value: '4.2', label: '광고환산', unit: '억원' },
    { value: '92', label: '긍정 비율', unit: '%' }] },
  cardGrid: { title: '제안 축 넷', cards: [
    { title: '메시지', desc: '한 문장으로 줄인다' }, { title: '채널', desc: '매체를 고른다' },
    { title: '일정', desc: '분기로 끊는다' }, { title: '측정', desc: '숫자로 본다' }] },
  comparison: { title: '지금과 바뀐 뒤', left: { title: '지금', items: ['손으로 옮긴다', '사람마다 다르다'] },
    right: { title: '바뀐 뒤', items: ['자동으로 모인다', '기준이 하나다'] } },
  processFlow: { title: '도는 순서', steps: [
    { title: '모으기', desc: '자료를 읽는다' }, { title: '만들기', desc: '초안을 쓴다' },
    { title: '검수', desc: '빠진 것을 잡는다' }] },
  timeline: { title: '분기 일정', events: [
    { date: '1분기', title: '준비' }, { date: '2분기', title: '실행' }, { date: '3분기', title: '확산' }] },
  funnel: { title: '단계별 전환', stages: [
    { label: '노출', value: '120만' }, { label: '도달', value: '38만' },
    { label: '관심', value: '9만' }, { label: '문의', value: '4천' }, { label: '계약', value: '210' }] },
  pyramid: { title: '메시지 계층', levels: [
    { title: '핵심 한 줄', desc: '무엇을 남길 것인가' },
    { title: '받침 셋', desc: '왜 믿을 만한가' }, { title: '근거', desc: '자료와 숫자' }] },
  orgChart: { title: '수행 조직', root: { title: '총괄 PM', name: 'A' },
    children: [{ title: '언론', name: 'B' }, { title: '디지털', name: 'C' }, { title: '제작', name: 'D' }] },
  tableInsight: { title: '매체별 성과', headers: ['매체', '건수', '논조'],
    rows: [['일간지', '42', '긍정'], ['전문지', '31', '중립'], ['온라인', '55', '긍정']],
    insight: '전문지 논조가 중립에 머문다. 다음 분기 보강 대상이다.' },
  quoteHighlight: { quote: '좋은 제안서는 빠진 것이 없는 제안서다.', author: '검수 담당', mood: 'dark' },
};

let ok = 0, fail = [];
for (const [name, fn] of Object.entries(P)) {
  try { fn(pres.addSlide(), pres, D[name] || {}); ok++; }
  catch (e) { fail.push(name + ' · ' + e.message); }
}
const outName = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'patterns-check.pptx';
if (require('fs').existsSync(outName) && !process.argv.includes('--force')) {
  console.error(`이미 있는 파일입니다: ${outName}`);
  console.error('  이 인자는 「검사할 파일」이 아니라 「새로 만들 파일 이름」입니다.');
  console.error('  다른 이름을 주시거나, 정말 덮으시려면 --force 를 붙이십시오.');
  process.exit(1);
}
pres.writeFile({ fileName: outName }).then(() => {
  console.log(`성공 ${ok}종 / 10종 · ${outName}`);
  if (fail.length) { console.log('실패:'); fail.forEach(f => console.log('  ' + f)); }
});
