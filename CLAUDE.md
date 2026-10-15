# CLAUDE.md — N☆AH 포트폴리오 (Claude Code가 자동으로 읽는 프로젝트 안내)

## 나(요청자)에 대해
- 민경재(Jae). 서진하이테크(주)에서 마케팅·블로그·사업개발을 맡고 있고, 해외 CS 학부 진학을 준비 중.
- 코딩은 초보. **설명은 초보 눈높이로, 관련 CS 개념(예: 빌드, 정적 사이트, Git 커밋, DNS)을 짚어서** 공부가 되게 해줘.
- 중요한 결과는 직접 교차검증함. 확실하지 않은 정보는 확실하지 않다고 말해줘. 추측을 사실처럼 말하지 말 것.
- 한 번에 크게 바꾸기보다, 계획을 먼저 보여주고 단계별로 진행 → 확인 → 수정하는 방식을 선호.
- 답변은 한국어, 표와 짧은 단락으로 보기 좋게.

## 프로젝트 개요
- 친구 **윤영준(Noah Yoon)** 의 포트폴리오 겸 작업 의뢰용 웹사이트. 쉐리던 컬리지 Film & Television 재학, 비디오그래퍼·에디터.
- 목적: 작업물을 예쁘게 보여주고, 나중엔 이걸 보고 작업 의뢰가 들어오게(영업) 하는 것.
- 로고: **N☆AH** (O 자리에 별). 영준은 별을 정말 좋아함(애플 기기에 별 이모지 각인).
- 디자인 콘셉트: **작업 하나 = 별 하나, 사이트 = Noah의 은하** (소개글 마지막 문장에서 출발).
- 참고 사이트: Colin Chow 포트폴리오(회전하는 3D 사진 부채, Featured work 그리드, Photos 벽돌 배치, About 콜라주 구성).

## 기술 스택
- React 18 + TypeScript + Vite. 서버 없는 **정적 사이트** → `npm run build` 결과물 `dist/` 를 호스팅에 올림.
- 외부 라이브러리 최소화(React 외 없음). 글꼴은 Google Fonts(Bodoni Moda, Geist, Geist Mono, Noto Sans KR).

## 폴더 구조
- `src/data/site.ts` — 글자·사진·영상·이메일 등 **내용은 전부 여기**. ⚠ 표시 = 임시값
- `src/components/` — Intro(인트로), HeroFan(회전 부채), Galaxy(은하수 지도), Player(영상), Lightbox(사진), PreviewVideo, GlowStar(직접 그린 별), Logo, StarField, CursorSparkle, Header, TvStatic
- `src/sections/` — Hero, Films, Social, Services(What I Make), Photos, About, Contact, Footer
- `src/styles.css` — 맨 위 `:root` 에 색·글꼴 기준값. 다크 단일 테마(의도적)
- `public/photos/` — wedding/taipei/tokyo 사진 (큰 사진 + `-sm`)
- `public/films/` — 본편 `.mp4` 6개, `-poster.jpg`, `-poster-sm.jpg`, 6초 `-preview.mp4`
- `scripts/encode-videos.sh` — 원본 → 웹용 MP4 변환 / `scripts/build-preview.mjs` — Claude 미리보기 링크용 묶음

## 작업물 (v0.2)
| 구분 | 제목 | 메모 |
|---|---|---|
| 영상 | Nagoya — Travel Film | 1:51, 시네마스코프(위아래 검은 띠 잘라냄) |
| 영상 | Wedding Film Part I / Part II | 3:27 / 2:33, 4:3. 로마 숫자 표기 유지 |
| 영상 | Discontinue — A documentary focusing on photography | 3:19, 쉐리던 사진학과 50년 만의 마지막 졸업 |
| 세로 | ZARA — Social Media Assignment | 학교 과제. "not an official ZARA campaign" 표기 **유지** |
| 세로 | Busan Pork Cutlet — Social Media Content | ⚠ 받은 파일이 저화질(406×720), 원본 받으면 교체 |
| 사진 | Wedding 10 / Taipei 7 / Tokyo 6 | 웨딩 사진 = 웨딩 필름과 같은 날 |

## 꼭 지킬 것
- 인트로 순서 유지: 검은 화면 뽀샤시 별 → 줌인 → 아날로그 TV 지지직(약 3~5초) → N☆AH 페이드인 → 로고가 중앙 상단(헤더)으로 이동하며 홈 공개. SKIP 버튼·ESC 유지.
- 소개글은 영준이 쓴 **영어 원문 그대로** (`statement`). 임의로 고쳐 쓰지 말 것.
- 신랑·신부 등 영상 속 개인 이름은 사이트 글자로 넣지 않기(사생활).
- 확인 안 된 크레딧/역할을 지어내지 않기.
- `prefers-reduced-motion`(동작 줄이기) 지원, 모바일 390px 폭에서 가로 스크롤 없게.
- 파일 크기: 정적 호스팅 제약 때문에 **영상 파일 하나당 25MB 이하** 유지 (Cloudflare Pages 25MiB, GitHub 웹 업로드 25MB). 더 높은 화질은 Vimeo/YouTube 연결로.

## 배포 계획
- GitHub 저장소 → Vercel(또는 Cloudflare Pages) 연결 → 자동 배포 → 나중에 도메인 연결.
- ⚠ Vercel Hobby(무료)는 공식 정책상 **비상업용 전용**이고, "서비스 판매 홍보"도 상업용으로 봄. 본격 영업용으로 쓰면 Vercel Pro 또는 다른 호스팅 검토 필요 → 최신 정책을 확인해서 알려줄 것.
- 배포 후 `index.html` 의 `og:image`, `og:url` 을 **전체 주소(https://...)** 로 바꿔야 카카오톡 미리보기 카드가 뜸.

## 반영 대기 — 영준 프로필 정보 (2026-10-15 받음, 다음 작업 때 한 번에 반영)
`src/data/site.ts` 의 ⚠ 임시값을 아래로 교체하고, What I Make 띠·문의 문구도 맞춰 수정할 것.
| 항목 | 값 |
|---|---|
| 이메일 | dudwns2125@gmail.com |
| 인스타그램 | @noahyoun → https://www.instagram.com/noahyoun/ |
| 활동 지역 | Based in Oakville (시계 시간대는 America/Toronto 그대로 — 같은 온타리오 주) |

받는 작업 종류 (영준이 정한 분류 — 두 묶음 구조 그대로 살릴 것)
- **01. WORKS**: Films · Commercials · Fashion Films · Music Videos · Documentaries · Visual Projects
- **02. EXPERTISE**: Directing · Cinematography · Editing · Color Grading · Creative Direction

반영 아이디어: 지금의 'What I Make' 흐르는 띠를 WORKS / EXPERTISE 두 줄로 나누거나, 문의(Contact) 섹션 위에 두 칸 목록으로 배치.

## 남은 확인 사항
- Discontinue 부제 표기 확인
- Busan Pork Cutlet 원본 영상
- 인스타 아이디 철자(noahyoun)가 크레딧 표기(Noah Yoon)와 다른데 의도된 것인지
