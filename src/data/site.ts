/**
 * 사이트에 들어가는 글자·사진·영상 정보는 전부 이 파일 한 곳에서 고칩니다.
 * ⚠ 표시가 붙은 항목은 초안용 임시 내용이라 영준 님 확인 후 바꿔야 해요.
 */

const base = import.meta.env.BASE_URL;

export const site = {
  nickname: 'Noah',
  fullName: 'Noah Yoon',
  koreanName: '윤영준',
  roles: 'Filmmaker, Videographer & Editor',
  school: 'Sheridan College — Film & Television',
  tagline: 'Inspired by everything, confined by nothing.',
  basedIn: 'Toronto', // ⚠ 실제 활동 지역으로 확인
  timeZone: 'America/Toronto', // 오른쪽 위 시계가 이 지역 시간으로 표시됨
  email: 'noah@example.com', // ⚠ 실제 문의용 이메일로 교체
  instagram: {
    handle: '@noah', // ⚠ 실제 인스타그램 아이디로 교체
    url: 'https://www.instagram.com/',
  },
  services: ['Wedding Films', 'Travel Films', 'Documentary', 'Social Media Content', 'Photography', 'Editing'],
  year: 2026,
};

/** 영준 님 소개글 (본인이 쓴 영어 원문 그대로) */
export const statement = {
  paragraphs: [
    "I'm a filmmaker, videographer, and editor currently studying Film and Television at Sheridan College.",
    'Inspired by everything and confined by nothing, I create through instinct, intuition, and a desire to see the world differently.',
    'I believe in the power of human connection and storytelling. My goal is simple: to create images that make people feel something.',
  ],
  galaxy:
    'Like stars scattered across the universe, I hope each piece of my work will one day come together to form a galaxy of its own.',
  signoff: 'Always open to new stories, ideas, and collaborations.',
};

/* ───────────── 영상 ───────────── */

export type FilmKind = 'film' | 'social';

export type Film = {
  id: string;
  title: string;
  /** 제목 아래 작은 설명 */
  subtitle: string;
  category: string;
  kind: FilmKind;
  /** 화면 비율 (가로/세로) — 플레이어 틀 모양 */
  ratio: number;
  duration: string;
  src: string;
  poster: string;
  posterSm: string;
  preview: string;
  credit: string;
  /** 같은 시리즈끼리 묶음 (Part I · Part II) */
  series?: string;
  note?: string;
};

const film = (id: string) => ({
  src: `${base}films/${id}.mp4`,
  poster: `${base}films/${id}-poster.jpg`,
  posterSm: `${base}films/${id}-poster-sm.jpg`,
  preview: `${base}films/${id}-preview.mp4`,
});

export const films: Film[] = [
  {
    id: 'nagoya',
    title: 'Nagoya',
    subtitle: 'Travel Film',
    category: 'Travel',
    kind: 'film',
    ratio: 1920 / 820,
    duration: '1:51',
    credit: 'A film by Noah · Edited by Noah',
    ...film('nagoya'),
  },
  {
    id: 'wedding-part-1',
    title: 'Wedding Film',
    subtitle: 'Part I',
    category: 'Wedding',
    kind: 'film',
    ratio: 4 / 3,
    duration: '3:27',
    credit: 'Director of photography, editor & sound',
    series: 'wedding',
    ...film('wedding-part-1'),
  },
  {
    id: 'wedding-part-2',
    title: 'Wedding Film',
    subtitle: 'Part II',
    category: 'Wedding',
    kind: 'film',
    ratio: 4 / 3,
    duration: '2:33',
    credit: 'Director of photography, editor & sound',
    series: 'wedding',
    ...film('wedding-part-2'),
  },
  {
    id: 'discontinue',
    title: 'Discontinue',
    subtitle: 'A documentary focusing on photography',
    category: 'Documentary',
    kind: 'film',
    ratio: 16 / 9,
    duration: '3:19',
    credit: 'Documentary short',
    note: "After over 50 years of teaching photography, Sheridan College's Photography program is graduating its final class.",
    ...film('discontinue'),
  },
  {
    id: 'zara',
    title: 'ZARA',
    subtitle: 'Social Media Assignment',
    category: 'Social',
    kind: 'social',
    ratio: 9 / 16,
    duration: '2:00',
    credit: 'Class assignment — not an official ZARA campaign',
    ...film('zara'),
  },
  {
    id: 'busan-pork-cutlet',
    title: 'Busan Pork Cutlet',
    subtitle: 'Social Media Content',
    category: 'Social',
    kind: 'social',
    ratio: 9 / 16,
    duration: '1:59',
    credit: 'Short-form food content',
    ...film('busan-pork-cutlet'),
  },
];

export const filmById = (id: string) => films.find((f) => f.id === id);

/* ───────────── 사진 ───────────── */

export type Photo = {
  id: string;
  series: SeriesId;
  src: string;
  thumb: string;
  alt: string;
  /** 사진 벽돌 배치에서만 쓰는 잘라내기 비율 (크게 보기에선 원본 그대로) */
  crop?: string;
  cropPosition?: string;
};

export type SeriesId = 'wedding' | 'taipei' | 'tokyo';

export const photoSeries: { id: SeriesId; title: string; detail: string }[] = [
  { id: 'wedding', title: 'Wedding', detail: 'Same day as the wedding films' },
  { id: 'taipei', title: 'Taipei', detail: 'Film photography' },
  { id: 'tokyo', title: 'Tokyo', detail: 'Film photography' },
];

const ph = (series: SeriesId, n: number, alt: string, crop?: string, cropPosition?: string): Photo => {
  const name = `${series}-${String(n).padStart(2, '0')}`;
  return {
    id: name,
    series,
    src: `${base}photos/${name}.jpg`,
    thumb: `${base}photos/${name}-sm.jpg`,
    alt,
    crop,
    cropPosition,
  };
};

export const photos: Photo[] = [
  ph('wedding', 1, 'The couple walks away down a garden aisle while guests applaud and blow bubbles', '3 / 4', '48% 50%'),
  ph('wedding', 2, 'A man in a suit rests his arm around a woman in a grey gown, seen from behind', '4 / 5', '52% 50%'),
  ph('wedding', 3, 'Three guests smile together in front of a hanok roof'),
  ph('wedding', 4, 'A guest photographs four people posing in front of a hanok'),
  ph('wedding', 5, 'Friends pose with the couple in the hanok courtyard'),
  ph('wedding', 6, 'The couple stands with their parents in hanbok beneath tiled eaves'),
  ph('wedding', 7, 'The couple poses with three elderly guests among white flowers', '1 / 1', '45% 50%'),
  ph('wedding', 8, 'A woman and an elderly man in a flat cap pose beside a wooden pillar'),
  ph('wedding', 9, 'Two women sit on either side of an elderly man under the hanok eaves'),
  ph('wedding', 10, 'A man, a woman holding a bouquet, and a woman waving in front of lattice doors'),
  ph('taipei', 1, 'Two people with a parasol walk down a leafy Taipei side street past a vintage shop', '4 / 5', '70% 50%'),
  ph('taipei', 2, 'A Taipei street corner with a tall vertical clinic sign under a blue sky'),
  ph('taipei', 3, 'Commuters walk above a Zhongxiao Fuxing metro platform with an iPhone billboard', '1 / 1', '50% 50%'),
  ph('taipei', 4, 'A city bus at dusk beneath glass towers and a pedestrian bridge'),
  ph('taipei', 5, 'A lantern-lit hillside temple at blue hour'),
  ph('taipei', 6, 'Parked scooters and traffic on a sunlit Taipei street with red signs'),
  ph('taipei', 7, 'Scooters ride down a wide avenue at sunset under large billboards', '4 / 5', '40% 50%'),
  ph('tokyo', 1, 'Passengers wait on a sunlit Keisei Line platform with white arched pillars'),
  ph('tokyo', 2, 'A green truck stops in the middle of a Tokyo business street'),
  ph('tokyo', 3, 'Pedestrians wait at a crossing in front of glass towers and an elevated highway'),
  ph('tokyo', 4, 'A red fire hydrant sign on a utility pole tangled with wires', '4 / 5', '58% 50%'),
  ph('tokyo', 5, 'A man in a white shirt crosses a Ginza street lined with luxury facades'),
  ph('tokyo', 6, 'Tokyo Tower glowing orange among the night skyline'),
];

export const photosOf = (series: SeriesId) => photos.filter((p) => p.series === series);

/* ───────────── 첫 화면 회전 부채에 들어갈 카드 (영상 썸네일 + 사진) ───────────── */

export type FanItem = { key: string; thumb: string; alt: string; open: Opener };
export type Opener = { type: 'film'; id: string } | { type: 'photo'; id: string; series: SeriesId };

const fanFilm = (id: string): FanItem => {
  const f = filmById(id)!;
  return { key: `f-${id}`, thumb: f.posterSm, alt: `${f.title} ${f.subtitle}`, open: { type: 'film', id } };
};
const fanPhoto = (id: string): FanItem => {
  const p = photos.find((x) => x.id === id)!;
  return { key: `p-${id}`, thumb: p.thumb, alt: p.alt, open: { type: 'photo', id, series: p.series } };
};

export const fanItems: FanItem[] = [
  fanFilm('nagoya'),
  fanPhoto('taipei-04'),
  fanPhoto('wedding-06'),
  fanFilm('zara'),
  fanPhoto('tokyo-06'),
  fanPhoto('wedding-01'),
  fanFilm('wedding-part-1'),
  fanPhoto('taipei-05'),
  fanPhoto('tokyo-01'),
  fanFilm('discontinue'),
  fanPhoto('wedding-10'),
  fanPhoto('taipei-07'),
  fanFilm('busan-pork-cutlet'),
  fanPhoto('tokyo-05'),
  fanPhoto('wedding-05'),
  fanFilm('wedding-part-2'),
  fanPhoto('taipei-03'),
  fanPhoto('tokyo-02'),
  fanPhoto('wedding-07'),
  fanPhoto('taipei-01'),
];

/* ───────────── 은하수: 작업 하나 = 별 하나 ─────────────
 * x, y 는 은하 지도 안 위치(0~100%). 작품이 늘면 여기에 한 줄 추가하면 별이 하나 늘어나요. */
export type GalaxyStar = { label: string; meta: string; x: number; y: number; size: number; open: Opener; side?: 'left' | 'right' };

export const galaxyStars: GalaxyStar[] = [
  { label: 'Wedding Film I', meta: 'Film · 3:27', x: 38, y: 30, size: 1.25, open: { type: 'film', id: 'wedding-part-1' }, side: 'left' },
  { label: 'Wedding Film II', meta: 'Film · 2:33', x: 64, y: 39, size: 1.1, open: { type: 'film', id: 'wedding-part-2' } },
  { label: 'Nagoya', meta: 'Travel film · 1:51', x: 22, y: 55, size: 1.05, open: { type: 'film', id: 'nagoya' }, side: 'left' },
  { label: 'Discontinue', meta: 'Documentary · 3:19', x: 70, y: 66, size: 1.2, open: { type: 'film', id: 'discontinue' } },
  { label: 'ZARA', meta: 'Social · 2:00', x: 47, y: 79, size: 0.9, open: { type: 'film', id: 'zara' } },
  { label: 'Busan Pork Cutlet', meta: 'Social · 1:59', x: 80, y: 18, size: 0.85, open: { type: 'film', id: 'busan-pork-cutlet' }, side: 'left' },
  { label: 'Wedding', meta: '10 photographs', x: 50, y: 52, size: 1, open: { type: 'photo', id: 'wedding-01', series: 'wedding' } },
  { label: 'Taipei', meta: '7 photographs', x: 14, y: 22, size: 0.85, open: { type: 'photo', id: 'taipei-01', series: 'taipei' }, side: 'right' },
  { label: 'Tokyo', meta: '6 photographs', x: 27, y: 84, size: 0.85, open: { type: 'photo', id: 'tokyo-01', series: 'tokyo' }, side: 'right' },
];
