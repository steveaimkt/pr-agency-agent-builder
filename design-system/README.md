# 디자인 시스템 · 색과 글꼴

> 장표와 문서의 색·글꼴은 여기서 온다. **새로 고르지 않는다.**

## 파일

```
colors_and_type.css     색 · 글꼴 · 크기 · 여백 · 모서리 · 그림자 토큰
fonts/                  (비어 있음) 오프라인으로 쓸 때만 TTF 를 넣는다
```

## 글꼴

**Pretendard** 하나로 한글과 영문을 다 쓴다.
`colors_and_type.css` 맨 위 `@import` 한 줄이 CDN 에서 받아 온다. 내려받을 것이 없다.

인터넷이 안 되는 자리에서 써야 하면 아래에서 받아 `fonts/` 에 넣는다.

```
https://github.com/orioncactus/pretendard        (SIL Open Font License 1.1)
```

## 색 · 외울 것 넷

```
잉크    #2A2A28    글자와 어두운 면
종이    #F3F3F2    바탕
흰 카드  #FFFFFF    카드와 표
형광    #EBFF2C    강조. 한 장에 한 번만
```

⛔ **형광을 두 번 쓰지 않는다.** 두 번 쓰면 둘 다 안 보인다.

## 어디에 쓰나

| 만드는 것 | 따를 규격 |
|---|---|
| 장표 (파워포인트·웹 화면) | `../tools/slide-design.md` |
| 문서 (워드) | `../tools/design.md` |
| 둘 다의 색·글꼴 | 이 폴더의 `colors_and_type.css` |

## 출처

WMBB Design System. 원본은 claude.ai/design 프로젝트에 있고, 여기 있는 것은 장표와 문서에 쓰는 부분만 뽑아 온 것이다.
