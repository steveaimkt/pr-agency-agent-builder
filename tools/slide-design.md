# 장표를 만들 때 · 이 규격 그대로

> **문서는 `design.md`, 장표는 이 파일이다.**
> **구조는 여기 적힌 대로, 색과 글꼴은 `config.md` 의 디자인 컨셉대로.**
> 아래 조각은 복사해서 값만 바꾸면 된다.

---

## 판 크기와 여백

```
판       1280 × 720        고정
패딩     표지    72px
         본문    64px 72px
칸 사이   24px
```

⛔ **여백을 줄이지 않는다.** 내용이 넘치면 **장을 하나 더 만든다.**
꽉 찬 장표는 뒷자리에서 안 읽힌다.

---

## 글꼴

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family={컨셉의 글꼴}:wght@300;400;500;600;700&display=swap">
<style>
  body{ margin:0; background:#F3F3F2;
        font-family:"{컨셉의 글꼴}","Pretendard","Apple SD Gothic Neo",
                    "Malgun Gothic",sans-serif;
        word-break:keep-all }
</style>
```

⚠️ **사내망이 글꼴 서버를 막으면 뒤의 글꼴로 자동으로 넘어간다.** 깨지지 않는다.

```
표지 제목     56px  600   자간 -1.2px  줄간격 1.26
본문 제목     36px  600   자간 -0.8px  줄간격 1.30
큰 숫자       20px  400   (강조하는 줄만 600)
본문          15px  400
머리 표시     14px  500   자간 0.14em
바닥          13px  400
```

⛔ **13px 밑으로 내려가지 않는다.**

---

## 색 · **`config.md` 의 디자인 컨셉에서 가져온다**

⛔ **내가 고르지 않는다.** 팀마다 컨셉이 다르고, 컨셉이 정해지면 그 값만 쓴다.

```
바탕      컨셉의 바탕색        장표 배경
글자      컨셉의 글자색        제목 · 큰 숫자
강조      컨셉의 강조색        막대 · 머리 점.  하나뿐이다
확인 필요  컨셉의 확인필요색     배경으로. 한 장에 한 번
```

**컨셉이 정하지 않는 것 넷** · 이건 어느 컨셉에서도 같다

```
카드      #FFFFFF     내용을 담는 상자
테두리    바탕보다 조금 진하게    카드 선
얕은 선    바탕과 카드 사이       표 안쪽 줄 · 막대 뒷판
메타      글자색을 흐리게         바닥 줄 · 표 머리
```

**보기 · 차분한 뉴트럴로 정했을 때**

```
바탕 #F3F3F2 · 글자 #2A2A28 · 강조 #E0CCBE · 확인필요 #EBFF2C
카드 #FFFFFF · 테두리 #E6E2DC · 얕은 선 #F0EDE8 · 메타 #848383
진한 강조 #C9B0A0        제일 큰 값 하나에만
```

⛔ **강조색은 하나다.** 두 개를 쓰면 어디를 보라는 건지 사라진다.
⚠️ **아래 조각의 색은 이 보기 값이다.** 컨셉이 다르면 그 값으로 바꿔 넣는다.

---

## ① 머리 표시 · 모든 장 맨 위

```html
<div style="display:flex;align-items:center;gap:14px">
  <div style="width:10px;height:10px;border-radius:5px;background:#E0CCBE"></div>
  <div style="font-size:14px;font-weight:500;letter-spacing:0.14em;color:#848383">
    01 · 현황
  </div>
</div>
```

**번호는 장 순서다.** 순서가 뜻을 갖는 자리에만 쓴다.

---

## ② 바닥 두 줄 · 모든 장 맨 아래

```html
<div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:auto">
  <div style="font-size:13px;color:#848383">출처 · 어디서 온 숫자인지 적는다</div>
  <div style="font-size:13px;color:#848383">사람이 확인하기 전에는 발표용이 아닙니다.</div>
</div>
```

⛔ **이 두 줄을 빼지 않는다.** 왼쪽이 없으면 숫자를 못 믿고,
오른쪽이 없으면 **검토 안 된 장표가 그대로 나간다.**

---

## ③ 표 · 카드 안에 · 가로선만

```html
<div style="background:#FFFFFF;border:1px solid #E6E2DC;border-radius:24px;
            padding:12px 36px 20px;margin-top:8px">

  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
              font-size:14px;font-weight:500;letter-spacing:0.06em;color:#848383;
              border-bottom:1px solid #E6E2DC">
    <div style="padding:20px 8px">구분</div>
    <div style="padding:20px 8px;text-align:right">문의 접수 (건)</div>
    <div style="padding:20px 8px;text-align:right">첫 응답 (분)</div>
    <div style="padding:20px 8px;text-align:right">재문의율 (%)</div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
              font-size:20px;color:#2A2A28;border-bottom:1px solid #F0EDE8">
    <div style="padding:20px 8px">1월</div>
    <div style="padding:20px 8px;text-align:right">1,240</div>
    <div style="padding:20px 8px;text-align:right">42</div>
    <div style="padding:20px 8px;text-align:right">18</div>
  </div>

  <!-- 마지막 줄 · 제일 최근이거나 제일 중요한 줄만 진하게 -->
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
              font-size:20px;font-weight:600;color:#2A2A28">
    <div style="padding:20px 8px">4월 (최근)</div>
    <div style="padding:20px 8px;text-align:right">1,710</div>
    <div style="padding:20px 8px;text-align:right">58</div>
    <div style="padding:20px 8px;text-align:right">24</div>
  </div>
</div>
```

```
세로줄을 긋지 않는다        가로선만
숫자는 오른쪽 정렬          자리가 맞아야 읽힌다
머리 행은 작고 흐리게        14px · #848383
데이터는 크게              20px
마지막 줄 하나만 굵게        전부 굵으면 강조가 아니다
표 안에 여덟 줄을 넘기지 않는다   넘으면 장을 나눈다
```

---

## ④ 막대 · 손으로 그린다

**차트 도구를 부르지 않는다.** 뒷판과 채움 두 겹이면 된다.

```html
<div style="background:#FFFFFF;border:1px solid #E6E2DC;border-radius:24px;
            padding:32px 40px 28px;display:flex;flex-direction:column;gap:20px">

  <div style="font-size:15px;font-weight:600;color:#2A2A28">첫 응답까지 평균 (분)</div>

  <div style="position:relative;display:flex;align-items:flex-end;gap:40px">

    <!-- 목표선 · 점선으로 얹고 라벨은 흰 배경으로 선을 끊는다 -->
    <div style="position:absolute;left:0;right:0;bottom:134px;
                border-top:1px dashed #C6BFB6"></div>
    <div style="position:absolute;right:0;bottom:142px;font-size:15px;color:#848383;
                background:#FFFFFF;padding:0 8px">목표 30분</div>

    <div style="flex-grow:1;flex-basis:0;display:flex;flex-direction:column;
                align-items:center;gap:10px">
      <div style="font-size:20px;color:#4C4D59">42</div>
      <div style="position:relative;width:100%;height:268px;
                  background:#F0EDE8;border-radius:14px">
        <div style="position:absolute;left:0;right:0;bottom:0;height:188px;
                    background:#E0CCBE;border-radius:14px"></div>
      </div>
    </div>

    <!-- 제일 큰 값 하나만 진한 강조 + 숫자를 굵게 -->
    <div style="flex-grow:1;flex-basis:0;display:flex;flex-direction:column;
                align-items:center;gap:10px">
      <div style="font-size:20px;font-weight:600;color:#2A2A28">58 (최고)</div>
      <div style="position:relative;width:100%;height:268px;
                  background:#F0EDE8;border-radius:14px">
        <div style="position:absolute;left:0;right:0;bottom:0;height:259px;
                    background:#C9B0A0;border-radius:14px"></div>
      </div>
    </div>
  </div>

  <div style="display:flex;gap:40px;font-size:15px;color:#4C4D59">
    <div style="flex-grow:1;flex-basis:0;text-align:center">1월</div>
    <div style="flex-grow:1;flex-basis:0;text-align:center">4월</div>
  </div>
</div>
```

**막대 높이 셈법**

```
뒷판 268px 를 제일 큰 값에 맞춘다
어떤 값의 높이 = 268 × (그 값 ÷ 제일 큰 값)

42 → 268 × 42/60 = 188
58 → 268 × 58/60 = 259
```

⛔ **단위가 다른 값을 한 그림에 섞지 않는다.** 건과 분과 %는 따로 그린다.
⛔ **합계 막대를 넣지 않는다.** 다른 막대가 다 눌린다.
⚠️ **목표가 있으면 점선으로 얹는다.** 그래야 잘한 건지 못한 건지가 보인다.

---

## ⑤ 확인 필요 표시

```html
<span style="background:#EBFF2C;color:#2A2A28;font-weight:700;
             padding:6px 12px;border-radius:6px">확인 필요 · 자료 없음</span>
```

⛔ **한 장에 한 번.** 그리고 **노란 게 남은 덱은 발표용이 아니다.**
⚠️ **색만으로 구분하지 않는다.** 「확인 필요」 라는 글자를 반드시 같이 쓴다.

---

## 장표 한 장 통째로 · 이걸 복사해서 시작한다

```html
<div style="width:1280px;height:720px;box-sizing:border-box;background:#F3F3F2;
            padding:64px 72px;display:flex;flex-direction:column;gap:24px">

  <div style="display:flex;align-items:center;gap:14px">
    <div style="width:10px;height:10px;border-radius:5px;background:#E0CCBE"></div>
    <div style="font-size:14px;font-weight:500;letter-spacing:0.14em;color:#848383">
      01 · 현황</div>
  </div>

  <div style="font-size:36px;font-weight:600;color:#2A2A28;line-height:1.3;
              letter-spacing:-0.8px">여기에 한 줄로 결론을 씁니다</div>

  <!-- 여기에 표나 막대 카드 하나 -->

  <div style="display:flex;align-items:flex-end;justify-content:space-between;
              margin-top:auto">
    <div style="font-size:13px;color:#848383">출처 · </div>
    <div style="font-size:13px;color:#848383">사람이 확인하기 전에는 발표용이 아닙니다.</div>
  </div>
</div>
```

---

## 제목을 쓰는 법

⛔ **「현황」 「문제점」 「개선 방안」 을 제목으로 쓰지 않는다.** 그건 이름표지 말이 아니다.
**결론을 한 줄로 쓴다.** 그 줄만 읽어도 무슨 장인지 알아야 한다.

```
안 쓴다                    쓴다
현황                       문의는 4개월 새 38% 늘었습니다
문제점                     첫 응답이 목표의 두 배까지 늘었습니다
누락 검증 결과              목차에 안 담긴 것이 30건입니다
```

**이름표는 머리 표시에 넣는다.** `01 · 현황`. 그 자리가 이름표 자리다.

---

## 한 장에 하나만

```
한 장 = 결론 한 줄 + 근거 하나
```

표와 막대를 한 장에 같이 넣지 않는다. **장을 나눈다.**
장수가 늘어도 괜찮다. **한 장에 두 개를 넣으면 둘 다 안 읽힌다.**

---

## 파워포인트 파일로 바꾸기

**고객사가 열어서 고쳐야 하면** 여기까지 간다.

```
node tools/pptx/html2pptx.js output/08-발표용-PPT.html
```

**표는 파워포인트 표로, 막대는 파워포인트 차트로 들어간다.**
그림이 아니라서 **열어서 글자를 고칠 수 있다.**

```
읽는 것    이 규격의 이름표 (head · h · card · r3 · r4 · foot)
그래서     규격을 안 지키면 못 읽는다. 위 조각을 그대로 쓴다
```

⚠️ **`node` 가 없으면** 브라우저에서 인쇄해 PDF 로 낸다. **발표는 그걸로도 된다.**
⚠️ **`/design` 캔버스는 pptx 로 바로 안 간다.** 캔버스는 PNG·PDF 로 내보낸다.

---

## 다 만든 뒤 확인 여섯

```
[ ] 모든 장에 머리 표시와 바닥 두 줄이 있다
[ ] 제목이 이름표가 아니라 결론 한 줄이다
[ ] 표에 세로줄이 없고 숫자가 오른쪽으로 붙었다
[ ] 강조색이 한 종류다
[ ] 13px 밑으로 내려간 글자가 없다
[ ] 노란 표시가 남아 있는지 세어 봤다
```
