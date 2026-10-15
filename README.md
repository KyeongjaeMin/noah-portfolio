# N☆AH — Noah(윤영준) 포트폴리오

쉐리던 컬리지 Film & Television 전공 영준 님(Noah Yoon)의 포트폴리오 겸 작업 문의용 홈페이지 초안입니다.

## 디자인 콘셉트 — "작업 하나 = 별 하나, 사이트 = Noah의 은하"

영준 님 소개글 마지막 문장에서 출발했습니다.
> Like stars scattered across the universe, I hope each piece of my work will one day come together to form a galaxy of its own.

- 소개(About) 섹션의 **은하수 지도**: 영상 6편 + 사진 시리즈 3개가 각각 이름 붙은 별. 누르면 그 작업이 열림
- 작업이 늘면 `src/data/site.ts` 의 `galaxyStars` 에 한 줄 추가 → 별이 하나 늘어남 (은하가 자라는 구조)
- "Inspired by everything, confined by nothing" → 첫 화면 문구, "make people feel something" → 문의 섹션 제목

## 무엇으로 만들었나

| 항목 | 사용한 것 | 이유 |
|---|---|---|
| 화면 구성 | **React 18** | 부품(로고, 사진 부채, 섹션)을 나눠 관리 → 고치기 쉬움 |
| 언어 | **TypeScript** | 오타·실수를 미리 잡아줘서 튼튼함 |
| 빌드 도구 | **Vite** | 빠르고, 결과물이 '정적 파일'이라 어떤 호스팅에도 올라감 |
| 서버 | 필요 없음 | 관리할 서버가 없어 안정적이고 호스팅 비용 0원 가능 |

## 폴더 구조

```
src/
  data/site.ts        ← 글자·사진·영상·이메일·인스타 등 '내용'은 전부 여기서 수정
  components/
    Intro.tsx         ← 첫 방문 인트로 (별 → 줌인 → TV → 로고)
    HeroFan.tsx       ← 메인 회전 부채 (영상 썸네일 6 + 사진 14)
    Galaxy.tsx        ← 작업들로 이루어진 은하수 지도
    Player.tsx        ← 영상 크게 보기 (비율 자동, Wedding Part I/II 전환)
    PreviewVideo.tsx  ← 썸네일 위 6초 무음 미리보기
    GlowStar.tsx      ← 직접 그린 뽀샤시 별 (벡터라 확대해도 안 깨짐)
    Logo.tsx          ← N☆AH 로고
    StarField.tsx     ← 배경 밤하늘 + 가끔 별똥별
    CursorSparkle.tsx ← 마우스 따라 흩날리는 별가루
    Header / Lightbox / TvStatic
  sections/           ← Hero, Films, Social, What I Make, Photos, About, Contact, Footer
  styles.css          ← 색·글꼴·배치 (맨 위 :root 에 기준 색상 모음)
public/photos/        ← 사진 (wedding/taipei/tokyo — 큰 사진 + -sm 작은 사진)
public/films/         ← 영상(.mp4), 대표 장면(-poster.jpg), 6초 미리보기(-preview.mp4)
scripts/encode-videos.sh ← 원본 영상 → 웹용 고화질 MP4 변환
```

## 내 컴퓨터에서 열어보기

```bash
npm install
npm run dev        # 개발용 미리보기 (주소가 표시됨)
npm run build      # 배포용 결과물 → dist/ 폴더
```

## 사진 추가하기

1. `public/photos/` 에 `tokyo-07.jpg`(가로 1600px 정도), `tokyo-07-sm.jpg`(가로 720px 정도) 추가
2. `src/data/site.ts` 의 `photos` 목록에 `ph('tokyo', 7, '사진 설명')` 한 줄 추가
3. 새 시리즈(예: Seoul)는 `SeriesId`, `photoSeries` 에 이름 추가 → 필터 버튼이 자동으로 생김

## 영상 추가하기

1. 원본을 H.264 MP4로 변환 (`scripts/encode-videos.sh` 참고) → `public/films/이름.mp4`
2. 대표 장면 `이름-poster.jpg`, `이름-poster-sm.jpg`, 6초 미리보기 `이름-preview.mp4` 준비
3. `src/data/site.ts` 의 `films` 목록에 한 덩어리 추가, `galaxyStars` 에 별 한 줄 추가

## 영상 화질에 대해 (중요)

- 지금 들어간 영상은 Claude 미리보기 링크의 **파일당 15MB 제한**에 맞춘 버전입니다 (720p 전후).
- 정적 호스팅에도 파일 하나당 제한이 있습니다 (Cloudflare Pages 25MiB, GitHub 웹 업로드 25MB).
  → `bash scripts/encode-videos.sh 원본폴더` 를 돌리면 **파일당 24MB 이하**로 화질을 올린 버전이 만들어집니다.
- 원본 화질 그대로 보여주려면 **Vimeo**나 YouTube에 올리고 사이트에서 연결하는 방식을 추천합니다.
- Busan Pork Cutlet은 받은 파일 자체가 저화질(406×720)이라, 원본을 받으면 교체하세요.

## 배포 (GitHub → Vercel)

1. **영상 확인**: `public/films/` 에 본편 6개(`nagoya.mp4`, `wedding-part-1.mp4`, `wedding-part-2.mp4`, `discontinue.mp4`, `zara.mp4`, `busan-pork-cutlet.mp4`)가 있어야 함
2. **GitHub에 올리기**: GitHub Desktop → File → Add local repository → 이 폴더 선택 → "create a repository" → Commit → Publish repository
   - 웹 브라우저 업로드는 한 번에 100개·파일당 25MB 제한이 있어 GitHub Desktop이 편함
3. **Vercel 연결**: vercel.com → Continue with GitHub → Add New → Project → 저장소 Import → (Vite 자동 인식) → Deploy
4. 1~2분 뒤 `https://프로젝트이름.vercel.app` 주소가 생김 → 이 주소를 카톡으로 공유
5. **카톡 미리보기 카드**: `index.html` 의 `og:image` 를 `https://프로젝트이름.vercel.app/og-image.jpg` 처럼 전체 주소로 바꾸고 `og:url` 줄 추가 → Commit → Push (자동 재배포)
   - 카톡에 예전 미리보기가 남아 있으면 카카오 개발자 사이트의 **공유 디버거**에서 캐시 초기화
6. **수정할 때마다**: 파일 수정 → GitHub Desktop에서 Commit → Push → Vercel이 알아서 다시 배포
7. **도메인**: 구매 후 Vercel 프로젝트 Settings → Domains 에 입력 → 안내되는 DNS 값을 구매처에 입력

### ⚠ Vercel 무료(Hobby) 요금제 주의
Vercel 공식 정책상 Hobby는 **비상업적 개인 용도 전용**이고, "상품이나 서비스 판매를 홍보하는 것"도 상업적 사용에 포함됩니다
([Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)).
초안 공유 단계는 괜찮지만, 이 사이트로 본격적으로 작업 의뢰를 받기 시작하면 **Vercel Pro(유료)** 로 올리거나
**Cloudflare Pages**(무료, 파일당 25MiB·최대 2만 개 파일) 같은 다른 호스팅을 검토하세요. 정책은 바뀔 수 있으니 그 시점에 다시 확인하세요.

## 초안이라 확인이 필요한 내용 (`src/data/site.ts` 에서 ⚠ 표시)

- 이메일, 인스타그램 아이디 (지금은 임시값)
- 활동 지역 표기 (지금은 Toronto)
- Discontinue의 부제 표기 ("A documentary focusing on photography")
- 받는 작업 종류 목록 (Wedding Films, Travel Films, Documentary, Social Media Content, Photography, Editing)
- 소개 글은 영준 님 영어 원문 그대로 사용 (`statement`)

## 인트로 시간 조절

`src/components/Intro.tsx` 위쪽 `TIMELINE` 숫자(밀리초)만 바꾸면 됩니다.
TV 지지직 길이 = `signal` 시작 − `tv` 시작 (현재 약 3.4초 + 신호 잡히는 0.6초).
