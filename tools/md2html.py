#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
산출물을 HTML 로 만든다.

  python3 tools/md2html.py output/03-월간보고서.md
  python3 tools/md2html.py output/                 폴더 안 md 전부

같은 자리에 .html 이 생긴다. 브라우저에서 열리고, 인쇄하면 PDF 가 된다.
스타일은 WMBB 디자인 시스템을 따른다. 파일 하나에 다 들어 있어 어디로 보내도 안 깨진다.
"""
import sys, os, re, html

try:
    import markdown
except ImportError:
    print('markdown 이 없습니다 · pip3 install markdown'); sys.exit(1)

CSS = """
:root{
  --ink:#2A2A28; --ink-soft:#3C3633; --ink-muted:#444444; --ink-quiet:#4C4D59;
  --ink-faint:#848383; --ink-fade:#AFAFAC;
  --paper:#F3F3F2; --paper-warm:#EEEDEB; --card:#FFFFFF; --line:#EBEBEB;
  --sand:#E0CCBE; --hl:#EBFF2C;
  --font:'Pretendard','Apple SD Gothic Neo','Noto Sans KR',-apple-system,sans-serif;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--paper);color:var(--ink);
  font-family:var(--font);font-size:16px;line-height:1.7;
  -webkit-font-smoothing:antialiased;word-break:keep-all}
.wrap{max-width:920px;margin:0 auto;padding:72px 40px 120px}
.doc{background:var(--card);border:1px solid var(--line);border-radius:13px;
  padding:64px 68px;box-shadow:0 1px 2px rgba(0,0,0,.04)}

h1{font-size:42px;font-weight:700;line-height:1.2;letter-spacing:-0.02em;
  margin:0 0 8px;color:var(--ink)}
h2{font-size:28px;font-weight:600;line-height:1.3;letter-spacing:-0.01em;
  margin:56px 0 18px;padding-top:28px;border-top:1px solid var(--line);color:var(--ink)}
h2:first-of-type{border-top:0;padding-top:0}
h3{font-size:21px;font-weight:600;margin:36px 0 12px;color:var(--ink)}
h4{font-size:18px;font-weight:600;margin:26px 0 10px;color:var(--ink-soft)}
p{margin:0 0 14px;color:var(--ink-muted)}
strong{font-weight:700;color:var(--ink)}
ul,ol{margin:0 0 16px;padding-left:22px;color:var(--ink-muted)}
li{margin:4px 0}
a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}

blockquote{margin:20px 0;padding:16px 22px;background:var(--paper);
  border-left:3px solid var(--ink);border-radius:0 8px 8px 0}
blockquote p{margin:0;color:var(--ink-soft)}

table{width:100%;border-collapse:collapse;margin:20px 0;font-size:15px}
th{text-align:left;font-weight:600;color:var(--ink-quiet);
  padding:0 14px 12px 0;border-bottom:1px solid var(--line);white-space:nowrap}
td{text-align:left;padding:14px 14px 14px 0;border-bottom:1px solid var(--line);
  vertical-align:top;color:var(--ink-muted);line-height:1.55}
tr:last-child td{border-bottom:0}
td strong,th strong{color:var(--ink)}

pre{background:var(--ink);color:#EDEDEA;border-radius:10px;padding:22px 26px;
  overflow-x:auto;margin:20px 0;font-size:14px;line-height:1.75;
  font-family:ui-monospace,'SFMono-Regular',Menlo,monospace}
pre code{background:none;color:inherit;padding:0;font-size:inherit}
code{background:var(--paper-warm);color:var(--ink);border-radius:4px;
  padding:.1em .35em;font-size:.92em;
  font-family:ui-monospace,'SFMono-Regular',Menlo,monospace}

hr{border:0;border-top:1px solid var(--line);margin:40px 0}

/* ── 도식 ── */
.kpi{display:flex;flex-wrap:wrap;gap:14px;margin:24px 0}
.kpi .c{flex:1 1 150px;background:var(--paper);border:1px solid var(--line);
  border-radius:13px;padding:20px 22px}
.kpi .c .n{font-size:32px;font-weight:700;letter-spacing:-0.02em;line-height:1.1;
  color:var(--ink);font-variant-numeric:tabular-nums}
.kpi .c .l{font-size:13px;color:var(--ink-quiet);margin-top:6px}
.kpi .c.bad .n{color:#A8452F}
.kpi .c.good .n{color:#3F7D54}

.bars{margin:20px 0}
.bars .r{display:flex;align-items:center;gap:14px;margin:9px 0}
.bars .r .k{width:150px;flex:none;font-size:14px;color:var(--ink);font-weight:600;
  text-align:right}
.bars .r .t{flex:1;height:22px;background:var(--line);border-radius:5px;overflow:hidden}
.bars .r .t i{display:block;height:100%;background:var(--ink);border-radius:5px}
.bars .r .t i.warn{background:#A8452F}
.bars .r .t i.ok{background:#3F7D54}
.bars .r .v{width:130px;flex:none;font-size:14px;font-weight:700;color:var(--ink);
  font-variant-numeric:tabular-nums}
.bars .cap{font-size:12px;color:var(--ink-faint);margin-top:10px;padding-left:164px}

.stack{display:flex;height:34px;border-radius:6px;overflow:hidden;
  border:1px solid var(--line);margin:20px 0 10px}
.stack i{display:flex;align-items:center;justify-content:center;color:#fff;
  font-size:13px;font-weight:700}
.legend{display:flex;flex-wrap:wrap;gap:18px;font-size:13px;color:var(--ink-quiet);
  margin-bottom:20px}
.legend span{display:flex;align-items:center;gap:7px}
.legend i{width:11px;height:11px;border-radius:3px;display:inline-block}

.figtitle{font-size:15px;font-weight:700;color:var(--ink);margin:26px 0 4px}

/* 표시 · 경고 · 금지 */
.tag-fc{background:var(--hl);color:var(--ink);font-weight:700;
  border-radius:4px;padding:.08em .4em}
.mark-warn{color:#8A6F2C}
.mark-stop{color:#A8452F;font-weight:700}
.mark-star{color:var(--ink)}

/* 머리 */
.meta{font-size:13px;color:var(--ink-faint);margin:0 0 40px;
  padding-bottom:20px;border-bottom:1px solid var(--line)}
.foot{margin-top:56px;padding-top:20px;border-top:1px solid var(--line);
  font-size:13px;color:var(--ink-fade);display:flex;justify-content:space-between}

@media print{
  html,body{background:#fff}
  .wrap{max-width:none;padding:0}
  .doc{border:0;border-radius:0;box-shadow:none;padding:0}
  h2{break-after:avoid} table,pre,blockquote{break-inside:avoid}
  .foot{display:none}
}
@media (max-width:720px){
  .wrap{padding:28px 16px 64px} .doc{padding:32px 22px}
  h1{font-size:30px} h2{font-size:23px} table{font-size:14px}
}
"""

MD_EXT = ['tables', 'fenced_code', 'sane_lists', 'nl2br', 'attr_list']

# ─────────────────────────── 도식 · 선언식 ───────────────────────────
# 표에서 자동으로 그리지 않는다. 매번 엉뚱한 열을 집는다.
# 담당자가 「이건 그릴 만하다」고 정한 것만 그린다.
#
#   ```막대 논조 분포
#   긍정 24
#   중립 13
#   부정 3
#   ```
#
#   ```달성 목표 대비
#   노출 133
#   메시지 50
#   ```                      % 로 읽고 100 넘으면 초록 · 90 미만 빨강
#
#   ```숫자 이번 달 한눈에
#   40건 총 노출
#   50% 메시지 반영률 · 나쁨
#   99건 분기 누적 · 좋음
#   ```

ROW_RE = re.compile(r'^(.+?)\s+([\d,]+(?:\.\d+)?)\s*([%건명원개점회편장]*)\s*$')
KPI_RE = re.compile(r'^([\d,]+(?:\.\d+)?[%가-힣]*)\s+(.+?)(?:\s*·\s*(좋음|나쁨))?\s*$')


def _bars(title: str, lines, rate: bool) -> str:
    rows = []
    for ln in lines:
        m = ROW_RE.match(ln.strip())
        if m:
            rows.append((m.group(1).strip(), float(m.group(2).replace(',', '')), m.group(3)))
    if len(rows) < 2:
        return ''
    mx = max(r[1] for r in rows) or 1
    o = [f'<div class="figtitle">{html.escape(title)}</div>' if title else '', '<div class="bars">']
    for label, v, unit in rows:
        u = unit or ('%' if rate else '')
        cls = ('ok' if v >= 100 else 'warn' if v < 90 else '') if rate else ''
        shown = f'{v:,.0f}{u}' if v == int(v) else f'{v:,.1f}{u}'
        o.append(f'<div class="r"><div class="k">{html.escape(label)[:24]}</div>'
                 f'<div class="t"><i class="{cls}" style="width:{max(2, round(v / mx * 100))}%"></i></div>'
                 f'<div class="v">{shown}</div></div>')
    if rate:
        o.append('<div class="cap">100% 넘으면 초록 · 90% 못 미치면 빨강</div>')
    o.append('</div>')
    return '\n'.join(x for x in o if x)


def _kpi(title: str, lines) -> str:
    cards = []
    for ln in lines:
        m = KPI_RE.match(ln.strip())
        if m:
            tone = {'좋음': ' good', '나쁨': ' bad'}.get(m.group(3) or '', '')
            cards.append(f'<div class="c{tone}"><div class="n">{html.escape(m.group(1))}</div>'
                         f'<div class="l">{html.escape(m.group(2))}</div></div>')
    if not cards:
        return ''
    head = f'<div class="figtitle">{html.escape(title)}</div>' if title else ''
    return head + '<div class="kpi">' + ''.join(cards) + '</div>'


SRC_FIG_RE = re.compile(r'^```(막대|달성|숫자)[ \t]*([^\n]*)\n(.*?)^```[ \t]*$',
                        re.S | re.M)


def extract_figs(src: str):
    """원본 마크다운에서 도식 블록을 뽑아 자리표시자로 바꾼다.

    파이썬 마크다운의 펜스 코드가 한글 제목을 못 읽어서,
    마크다운으로 넘기기 전에 여기서 먼저 꺼낸다.
    """
    figs = []

    def take(m):
        kind, title, raw = m.group(1), m.group(2).strip(), m.group(3)
        lines = [x for x in raw.split('\n') if x.strip()]
        out = _kpi(title, lines) if kind == '숫자' else _bars(title, lines, kind == '달성')
        if not out:
            return m.group(0)
        figs.append(out)
        return f'\n\nFIGPLACEHOLDER{len(figs) - 1}\n\n'

    return SRC_FIG_RE.sub(take, src), figs


def put_figs(html_text: str, figs) -> str:
    for i, fig in enumerate(figs):
        html_text = re.sub(rf'<p>\s*FIGPLACEHOLDER{i}\s*</p>', fig, html_text)
        html_text = html_text.replace(f'FIGPLACEHOLDER{i}', fig)
    return html_text


def render(md_path: str) -> str:
    src = open(md_path, encoding='utf-8').read()

    # 제목 뽑기 (첫 h1)
    m = re.search(r'^#\s+(.+)$', src, re.M)
    title = m.group(1).strip() if m else os.path.basename(md_path)
    title = re.sub(r'[*`]', '', title)

    src, figs = extract_figs(src)
    body = markdown.markdown(src, extensions=MD_EXT)
    body = put_figs(body, figs)

    # 확인이 필요한 표시를 눈에 띄게
    #   스킬 문서는 [FACT-CHECK], 콘텐츠 샘플 자료는 [확인 필요] 를 쓴다.
    #   둘 다 같은 뜻이라 둘 다 칠한다. 하나만 칠하면 노란 표시가 없는 문서가 생긴다.
    for _mark in ('[FACT-CHECK]', '[확인 필요]'):
        body = body.replace(_mark, '<span class="tag-fc">%s</span>' % _mark)
    # 기호에 색
    body = body.replace('⛔', '<span class="mark-stop">⛔</span>')
    body = body.replace('⚠️', '<span class="mark-warn">⚠️</span>')

    src_name = html.escape(os.path.basename(md_path))
    return f"""<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{html.escape(title)}</title>
<style>{CSS}</style>
</head>
<body>
<div class="wrap">
  <div class="doc">
{body}
    <div class="foot"><span>WMBB</span><span>{src_name}</span></div>
  </div>
</div>
</body>
</html>
"""


def one(p: str) -> str:
    out = os.path.splitext(p)[0] + '.html'
    open(out, 'w', encoding='utf-8').write(render(p))
    return out


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    target = sys.argv[1]
    made = []
    if os.path.isdir(target):
        for root, _, files in os.walk(target):
            for f in sorted(files):
                if f.endswith('.md') and not f.startswith('_'):
                    made.append(one(os.path.join(root, f)))
    elif target.endswith('.md'):
        made.append(one(target))
    else:
        print('md 파일이나 폴더를 주세요'); sys.exit(2)

    for m in made:
        print(f'  {os.path.basename(m)}')
    print(f'\n{len(made)}개 만들었습니다. 브라우저에서 열리고 인쇄하면 PDF 가 됩니다.')


if __name__ == '__main__':
    main()
