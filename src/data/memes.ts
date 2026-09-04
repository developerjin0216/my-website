// 밈·신조어 사전 — quiz 서브도메인 /meme 의 단일 데이터 소스.
// 허브·용어 상세 페이지·sitemap·RSS가 모두 이 파일을 읽습니다.
// 모든 설명은 직접 작성한 오리지널 텍스트입니다 (이미지·짤 무단 게재 금지 —
// 저작권 및 AdSense 복제 콘텐츠 정책 대응). 유래가 불확실한 항목은
// 단정하지 않고 "~로 알려져 있다"로 표기합니다.

export type MemeCategoryId =
  | "recent"
  | "abbr"
  | "reaction"
  | "yamin"
  | "broadcast"
  | "game"
  | "fandom";

export const memeCategories: Record<
  MemeCategoryId,
  { name: string; emoji: string; desc: string }
> = {
  recent: { name: "요즘 뜨는 말", emoji: "🔥", desc: "2024~2026 최신 유행어와 밈" },
  abbr: { name: "줄임말·신조어", emoji: "✂️", desc: "일상 대화와 SNS에서 쓰는 줄임말" },
  reaction: { name: "리액션·감탄사", emoji: "💬", desc: "채팅과 댓글에서 쓰는 반응 표현" },
  yamin: { name: "야민정음", emoji: "🔤", desc: "글자 모양이 비슷한 것끼리 바꿔 쓰는 표기 놀이" },
  broadcast: { name: "방송·인터넷 밈", emoji: "📺", desc: "예능·영화·인터넷 방송에서 태어난 밈" },
  game: { name: "게임에서 온 말", emoji: "🎮", desc: "게임 용어에서 일상어가 된 말" },
  fandom: { name: "덕질·연애 용어", emoji: "💘", desc: "팬 활동과 연애 관계에서 쓰는 말" },
};

export interface MemeEntry {
  id: string; // URL slug (ascii)
  term: string; // 표기
  category: MemeCategoryId;
  meaning: string; // 뜻 (2~3문장)
  origin: string; // 유래 (1~2문장, 불확실 시 hedge)
  examples: string[]; // 사용 예시 (대화체 1~2개)
  related: string[]; // 관련 항목 id
}

export const memes: MemeEntry[] = [
  // ───────────────── 요즘 뜨는 말 (2024~2026) ─────────────────
  {
    id: "lucky-vicky",
    term: "럭키비키",
    category: "recent",
    meaning:
      "어떤 상황이든 운이 좋았다고 긍정적으로 해석할 때 쓰는 말입니다. '완전 럭키잖아'에 자신의 이름을 합쳐 만든 표현으로, 초긍정 마인드의 대명사가 됐습니다.",
    origin:
      "아이브 장원영이 빵이 눈앞에서 품절되자 '갓 나온 빵을 받게 됐으니 완전 럭키비키잖아'라고 말한 영상에서 시작된 것으로 알려져 있습니다 (비키는 본인의 영어 이름).",
    examples: ["버스 놓쳤는데 다음 버스가 바로 옴 — 완전 럭키비키잖아?"],
    related: ["wonyoung-thinking", "ohiryeo-joa"],
  },
  {
    id: "wonyoung-thinking",
    term: "원영적 사고",
    category: "recent",
    meaning:
      "나쁜 일도 결국 나에게 좋은 일이 되기 위한 과정이라고 해석하는 초긍정 사고방식입니다. 단순 긍정을 넘어 '오히려 더 잘됐다'로 결론짓는 것이 포인트입니다.",
    origin: "아이브 장원영의 긍정적인 말버릇에서 팬들이 정리한 개념으로, 럭키비키 밈과 함께 확산됐습니다.",
    examples: ["시험 망함 → 이번에 약점을 미리 발견했으니 완전 잘된 일이야. 이게 원영적 사고."],
    related: ["lucky-vicky", "ohiryeo-joa"],
  },
  {
    id: "chugumi",
    term: "추구미",
    category: "recent",
    meaning:
      "'추구하는 美(미)'의 줄임말로, 내가 지향하는 이미지나 스타일을 뜻합니다. 패션·인테리어·삶의 태도까지 폭넓게 쓰입니다.",
    origin: "인스타그램·트위터 등 SNS 패션 커뮤니티에서 확산된 것으로 알려져 있습니다.",
    examples: ["내 추구미는 꾸안꾸인데 현실은 그냥 안 꾸민 사람임"],
    related: ["kkuankku", "godsaeng"],
  },
  {
    id: "jungkkeokma",
    term: "중꺾마",
    category: "recent",
    meaning:
      "'중요한 건 꺾이지 않는 마음'의 줄임말입니다. 지고 있어도 포기하지 않는 태도를 응원할 때 쓰는, 스포츠와 수험가의 국민 응원 문구가 됐습니다.",
    origin:
      "2022년 리그 오브 레전드 월드 챔피언십에서 우승한 DRX 데프트 선수의 인터뷰 문구를 언론이 줄여 쓰며 유행했고, 같은 해 카타르 월드컵에서 대세가 됐습니다.",
    examples: ["3연패 중이지만 중꺾마. 오늘은 이긴다."],
    related: ["gabojago", "jonbeo"],
  },
  {
    id: "pom-michyeotda",
    term: "폼 미쳤다",
    category: "recent",
    meaning:
      "기량이나 상태(form)가 최고조라는 뜻의 감탄 표현입니다. 운동선수뿐 아니라 잘 나온 사진, 잘 만든 결과물 등 무엇이든 칭찬할 때 씁니다.",
    origin: "축구 등 스포츠에서 선수의 컨디션을 뜻하는 '폼'에 감탄사를 붙인 것으로, 스포츠 커뮤니티에서 일상으로 퍼졌습니다.",
    examples: ["오늘 발표 자료 뭐야? 폼 미쳤다"],
    related: ["jjijeotda", "legend"],
  },
  {
    id: "chill-guy",
    term: "칠가이 (Chill guy)",
    category: "recent",
    meaning:
      "웬만한 일에는 동요하지 않는 여유로운 사람을 뜻합니다. '난 그냥 칠가이라서'처럼 쿨하게 넘기는 태도를 표현할 때 씁니다.",
    origin:
      "2024년 해외에서 유행한, 옷을 입은 강아지가 여유롭게 서 있는 일러스트 캐릭터 밈에서 시작됐습니다. 국내에서는 '칠하다(여유롭다)'라는 표현과 함께 퍼졌습니다.",
    examples: ["일정 다 꼬였는데 어쩌겠어~ 나는 칠가이니까"],
    related: ["ohiryeo-joa", "healing"],
  },
  {
    id: "slickback",
    term: "슬릭백",
    category: "recent",
    meaning:
      "마치 공중에 떠서 미끄러지듯 걷는 스텝 챌린지를 말합니다. 짧은 영상 플랫폼에서 전 세계적으로 유행했습니다.",
    origin: "2023년 틱톡 등 숏폼 플랫폼에서 한 학생의 영상이 화제가 되며 세계적으로 퍼진 것으로 알려져 있습니다.",
    examples: ["복도에서 슬릭백 연습하다가 선생님이랑 눈 마주침"],
    related: ["challenge"],
  },
  {
    id: "malatanghulu",
    term: "마라탕후루",
    category: "recent",
    meaning:
      "마라탕을 먹고 후식으로 탕후루를 먹는 코스를 뜻하는 합성어로, 10대~20대 초반 세대의 입맛과 소비문화를 상징하는 말이 됐습니다.",
    origin: "실제 유행하던 먹거리 코스를 노래로 만든 숏폼 챌린지가 크게 퍼지며 세대 밈으로 굳어졌습니다.",
    examples: ["오늘 방과 후 코스는 당연히 마라탕후루지"],
    related: ["challenge", "jeomechu"],
  },
  {
    id: "seosongnoha",
    term: "저속노화",
    category: "recent",
    meaning:
      "천천히 늙자는 뜻으로, 혈당 스파이크를 줄이는 식단·수면·운동 등으로 노화 속도를 늦추는 건강 트렌드를 가리킵니다. 반대말처럼 '가속노화(라면·야식 등)'도 함께 쓰입니다.",
    origin: "노년내과 의사가 SNS에서 소개한 개념이 2030 세대에 크게 퍼지며 유행어가 된 것으로 알려져 있습니다.",
    examples: ["새벽 2시에 라면… 이건 가속노화지. 내일부터 저속노화 간다."],
    related: ["godsaeng", "owoonwan"],
  },
  {
    id: "dopamine-detox",
    term: "도파민 디톡스",
    category: "recent",
    meaning:
      "숏폼·SNS 같은 짧고 강한 자극을 끊고 뇌를 쉬게 하는 것을 말합니다. '도파민 중독'이라는 말과 짝으로 쓰이며, 디지털 절제 트렌드를 대표하는 용어입니다.",
    origin: "해외 자기계발 커뮤니티의 'dopamine fasting' 개념이 국내에 번역·확산된 것으로 알려져 있습니다.",
    examples: ["숏폼 3시간 보고 현타 와서 도파민 디톡스 선언함"],
    related: ["hyeonta", "seosongnoha"],
  },
  {
    id: "neo-t-ya",
    term: "너 T야?",
    category: "recent",
    meaning:
      "공감 대신 해결책이나 팩트부터 말하는 사람에게 던지는 밈입니다. MBTI의 사고형(T)에서 나온 말로, 서운함을 유쾌하게 표현하는 용도로 쓰입니다.",
    origin: "MBTI 유행과 함께 SNS 챌린지('공감 못 하는 T' 상황극)로 크게 퍼졌습니다.",
    examples: ["나: 나 넘어져서 무릎 까졌어 / 친구: 소독은 했어? / 나: …너 T야?"],
    related: ["mbti-boom", "paekpok"],
  },
  {
    id: "godsaeng",
    term: "갓생",
    category: "recent",
    meaning:
      "God(신)과 인생을 합친 말로, 부지런하고 계획적으로 알차게 사는 삶을 뜻합니다. 미라클 모닝, 운동, 공부 인증 문화와 함께 쓰입니다.",
    origin: "아이돌 팬덤에서 '갓(최고)'을 접두어로 쓰던 문화가 '갓생살기' 챌린지로 확장된 것으로 알려져 있습니다.",
    examples: ["오늘 6시 기상 + 운동 + 독서 완료. 갓생 2일차."],
    related: ["owoonwan", "seosongnoha", "chugumi"],
  },
  {
    id: "owoonwan",
    term: "오운완",
    category: "recent",
    meaning:
      "'오늘 운동 완료'의 줄임말로, 운동 인증 사진과 함께 해시태그로 쓰입니다. 갓생·바디프로필 유행과 함께 일상어가 됐습니다.",
    origin: "인스타그램 운동 인증 해시태그에서 시작된 것으로 알려져 있습니다.",
    examples: ["#오운완 오늘도 하체는 접수했다"],
    related: ["godsaeng", "seosongnoha"],
  },
  {
    id: "kkuankku",
    term: "꾸안꾸",
    category: "recent",
    meaning:
      "'꾸민 듯 안 꾸민 듯'의 줄임말로, 자연스러워 보이지만 사실은 신경 쓴 스타일을 뜻합니다. 패션·메이크업에서 최고의 칭찬으로 통합니다.",
    origin: "패션·뷰티 커뮤니티에서 확산된 줄임말입니다.",
    examples: ["소개팅 룩은 무조건 꾸안꾸가 정답임"],
    related: ["chugumi"],
  },
  {
    id: "jeomechu",
    term: "점메추 / 저메추",
    category: "recent",
    meaning:
      "'점심(저녁) 메뉴 추천'의 줄임말입니다. 단톡방과 커뮤니티에서 오늘 뭐 먹을지 정해달라는 뜻으로 씁니다.",
    origin: "직장인 커뮤니티와 단톡방 문화에서 자연스럽게 생긴 줄임말입니다.",
    examples: ["점메추 좀. 단, 국물 있어야 하고 만원 이하."],
    related: ["malatanghulu", "guknyul"],
  },

  // ───────────────── 줄임말·신조어 ─────────────────
  {
    id: "aljjalttak",
    term: "알잘딱깔센",
    category: "abbr",
    meaning:
      "'알아서 잘 딱 깔끔하고 센스 있게'의 줄임말입니다. 구구절절 설명하지 않아도 눈치껏 잘 처리해달라는 뜻으로 씁니다.",
    origin: "게임 방송 채팅에서 시작해 일상 줄임말로 정착한 것으로 알려져 있습니다.",
    examples: ["발표 자료는 네가 알잘딱깔센으로 부탁해"],
    related: ["guknyul", "jjamba"],
  },
  {
    id: "eokten",
    term: "억텐 / 찐텐",
    category: "abbr",
    meaning:
      "억텐은 '억지 텐션', 찐텐은 '진짜 텐션'의 줄임말입니다. 재미없는데 예의상 웃어주면 억텐, 진심으로 신나면 찐텐입니다.",
    origin: "방송·유튜브 리액션 문화에서 확산된 줄임말입니다.",
    examples: ["부장님 개그에 억텐으로 3년째 웃는 중 / 이 노래는 찐텐으로 좋아함"],
    related: ["gapbunssa", "kingbatne"],
  },
  {
    id: "gapbunssa",
    term: "갑분싸",
    category: "abbr",
    meaning:
      "'갑자기 분위기 싸해짐'의 줄임말입니다. 누군가의 말이나 행동으로 대화 분위기가 순식간에 얼어붙었을 때 씁니다.",
    origin: "2018년경 방송 자막을 통해 대중화된 것으로 알려져 있습니다.",
    examples: ["신나는 회식에서 상사가 실적 얘기 꺼냄 → 갑분싸"],
    related: ["eokten", "seonneomne"],
  },
  {
    id: "sbulje",
    term: "스불재",
    category: "abbr",
    meaning:
      "'스스로 불러온 재앙'의 줄임말입니다. 자기가 벌인 일 때문에 고생하게 됐을 때 자조적으로 씁니다.",
    origin: "온라인 커뮤니티에서 확산된 줄임말입니다.",
    examples: ["새벽 3시까지 넷플릭스 정주행 → 아침 지각. 완벽한 스불재."],
    related: ["hyeonta", "jeongjuhaeng"],
  },
  {
    id: "jamanchu",
    term: "자만추",
    category: "abbr",
    meaning:
      "'자연스러운 만남 추구'의 줄임말로, 소개팅·앱이 아닌 일상에서 자연스럽게 연인을 만나고 싶다는 뜻입니다. 반대로 인위적인 만남 추구는 '인만추'라고 합니다.",
    origin: "연애 예능과 커뮤니티에서 확산된 줄임말입니다.",
    examples: ["소개팅은 어색해서 싫어, 난 자만추파야"],
    related: ["some", "samguida"],
  },
  {
    id: "gunssak",
    term: "군싹",
    category: "abbr",
    meaning:
      "'군침이 싹 도네'의 줄임말입니다. 맛있어 보이는 것뿐 아니라 탐나는 것 전반에 장난스럽게 씁니다.",
    origin: "애니메이션 짱구는 못말려의 한 장면 대사가 밈이 되며 퍼진 것으로 알려져 있습니다.",
    examples: ["퇴근길에 치킨 냄새… 군싹"],
    related: ["jmt"],
  },
  {
    id: "eoljuka",
    term: "얼죽아",
    category: "abbr",
    meaning:
      "'얼어 죽어도 아이스아메리카노'의 줄임말입니다. 한겨울에도 아이스 음료만 마시는 사람을 가리킵니다. 반대는 '뜨죽뜨(뜨거워 죽어도 뜨거운 음료)'.",
    origin: "카페 문화가 일상화되며 SNS에서 확산된 줄임말입니다.",
    examples: ["영하 10도에도 아아 들고 출근 — 얼죽아는 계절을 타지 않는다"],
    related: ["guknyul"],
  },
  {
    id: "manbanjalbu",
    term: "만반잘부",
    category: "abbr",
    meaning:
      "'만나서 반가워, 잘 부탁해'의 줄임말입니다. 새 학기·새 모임·게임에서 처음 인사할 때 가볍게 씁니다.",
    origin: "10대 중심의 채팅 문화에서 퍼진 인사 줄임말입니다.",
    examples: ["오늘 들어온 신입입니다, 만반잘부!"],
    related: ["newbie"],
  },
  {
    id: "calbak",
    term: "캘박",
    category: "abbr",
    meaning:
      "'캘린더 박제'의 줄임말로, 약속 날짜를 캘린더에 확정 등록한다는 뜻입니다. '캘박 완료'라고 하면 그 약속은 취소 불가라는 뉘앙스입니다.",
    origin: "직장인들의 일정 문화에서 생긴 줄임말입니다.",
    examples: ["다음 달 15일 여행, 캘박 완료. 이제 못 무름."],
    related: ["guknyul"],
  },
  {
    id: "byeoldajul",
    term: "별다줄",
    category: "abbr",
    meaning:
      "'별걸 다 줄인다'의 줄임말입니다. 과도한 줄임말 유행 자체를 놀리는, 줄임말에 대한 줄임말입니다.",
    origin: "줄임말 유행에 대한 반응으로 자연 발생한 표현입니다.",
    examples: ["A: 오저치고? (오늘 저녁 치킨 고?) B: 와 진짜 별다줄이다"],
    related: ["aljjalttak"],
  },
  {
    id: "guknyul",
    term: "국룰",
    category: "abbr",
    meaning:
      "'국민 룰'의 줄임말로, 누구나 인정하는 보편적인 규칙이라는 뜻입니다. '비 오는 날엔 파전이 국룰'처럼 씁니다.",
    origin: "온라인 커뮤니티에서 '국민 정서상 당연한 규칙'이라는 의미로 확산됐습니다.",
    examples: ["시험 끝난 날은 놀아야지, 그게 국룰이야"],
    related: ["injeong", "calbak"],
  },
  {
    id: "sohwakhaeng",
    term: "소확행",
    category: "abbr",
    meaning:
      "'작지만 확실한 행복'의 줄임말입니다. 거창한 성공보다 일상의 확실한 즐거움(퇴근 후 맥주, 갓 구운 빵)을 소중히 여기는 라이프스타일을 뜻합니다.",
    origin: "무라카미 하루키의 수필에서 유래한 표현이 2018년경 국내 트렌드 키워드로 재조명된 것으로 알려져 있습니다.",
    examples: ["금요일 밤 이불 속 넷플릭스, 이게 나의 소확행"],
    related: ["gasimbi", "healing"],
  },
  {
    id: "gasimbi",
    term: "가심비",
    category: "abbr",
    meaning:
      "가격 대비 마음(心)의 만족을 뜻합니다. 가성비가 성능을 따진다면, 가심비는 조금 비싸도 내 기분이 좋아지는 소비를 말합니다.",
    origin: "가성비에서 파생된 신조어로, 소비 트렌드 서적을 통해 대중화된 것으로 알려져 있습니다.",
    examples: ["실용성은 없지만 볼 때마다 행복하니까 가심비 최고"],
    related: ["sohwakhaeng", "flex"],
  },
  {
    id: "tmi",
    term: "TMI",
    category: "abbr",
    meaning:
      "'Too Much Information'의 약자로, 굳이 알고 싶지 않은 과한 정보를 뜻합니다. 지금은 '소소한 근황'이라는 순한 의미로도 널리 씁니다.",
    origin: "영어권 인터넷 용어가 수입돼 국내에서는 팬덤의 '최애 TMI 공유' 문화로 의미가 확장됐습니다.",
    examples: ["오늘의 TMI: 아침에 양말을 짝짝이로 신고 나옴"],
    related: ["tmt", "paekpok"],
  },
  {
    id: "tmt",
    term: "TMT",
    category: "abbr",
    meaning:
      "'Too Much Talker'의 약자로, 말이 많은 사람을 뜻합니다. 애정을 담아 놀릴 때 주로 씁니다.",
    origin: "TMI에서 파생된 국내식 조어로, 야구 선수의 별명으로 널리 퍼진 것으로 알려져 있습니다.",
    examples: ["우리 팀 막내는 귀여운 TMT라 회식이 조용할 틈이 없다"],
    related: ["tmi"],
  },
  {
    id: "paekpok",
    term: "팩폭",
    category: "abbr",
    meaning:
      "'팩트 폭행'의 줄임말로, 반박할 수 없는 사실로 정곡을 찌르는 것을 뜻합니다. 맞는 말이라 더 아픈 게 특징입니다.",
    origin: "온라인 커뮤니티 토론 문화에서 생긴 표현입니다.",
    examples: ["\"살 빼야지\"라는 말보다 작년 사진 한 장이 더 팩폭이다"],
    related: ["neo-t-ya", "eokka"],
  },
  {
    id: "sonminsoo",
    term: "손민수",
    category: "abbr",
    meaning:
      "다른 사람의 스타일이나 물건을 그대로 따라 사는 것을 뜻합니다. '손민수하다'는 동사로 쓰며, 연예인 착용템을 따라 사는 문화와 함께 퍼졌습니다.",
    origin: "웹툰 '치즈인더트랩'에서 주인공을 따라 하던 등장인물 이름에서 유래했습니다.",
    examples: ["최애가 든 가방 결국 손민수함. 후회는 없다."],
    related: ["choeae", "flex"],
  },
  {
    id: "jjamba",
    term: "짬바",
    category: "abbr",
    meaning:
      "'짬에서 나오는 바이브'의 줄임말입니다. 오랜 경력에서만 나올 수 있는 여유와 노련함을 뜻합니다.",
    origin: "군대에서 경력·연차를 뜻하는 '짬'에 바이브(분위기)를 합친 표현으로, 예능 자막을 통해 퍼진 것으로 알려져 있습니다.",
    examples: ["신입 셋이 헤매던 일을 10분 만에 끝내는 부장님… 이게 짬바구나"],
    related: ["goinmul", "manleb"],
  },
  {
    id: "pingpeu",
    term: "핑프",
    category: "abbr",
    meaning:
      "'핑거 프린세스/프린스'의 줄임말로, 검색하면 바로 나오는 것을 스스로 찾지 않고 남에게 물어보는 사람을 뜻합니다. 부정적 뉘앙스가 강하니 사용에 주의가 필요합니다.",
    origin: "온라인 커뮤니티에서 질문 예절 논쟁과 함께 생긴 표현입니다.",
    examples: ["그건 검색창에 치면 0.1초 만에 나와… 핑프 탈출하자"],
    related: ["nunting"],
  },
  {
    id: "jonbeo",
    term: "존버",
    category: "abbr",
    meaning:
      "힘든 상황을 끝까지 버틴다는 뜻의 속어입니다. 주식·코인 투자에서 손실 구간을 버티는 것, 힘든 시기를 견디는 것 모두에 씁니다. 어원에 비속어가 포함되어 공식 자리에서는 피하는 게 좋습니다.",
    origin: "온라인 방송에서 쓰이던 표현이 2017년경 암호화폐 열풍과 함께 대중화된 것으로 알려져 있습니다.",
    examples: ["월급날까지 잔고 3천 원으로 존버 중"],
    related: ["tteoksang", "jungkkeokma"],
  },

  // ───────────────── 리액션·감탄사 ─────────────────
  {
    id: "kingbatne",
    term: "킹받네",
    category: "reaction",
    meaning:
      "'열받네'에 King을 붙여 강조한 표현으로, 얄밉지만 웃긴 상황에 씁니다. 진짜 분노보다는 '귀엽게 약오른다'는 뉘앙스입니다.",
    origin: "접두어처럼 King을 붙여 강조하는 커뮤니티 화법(킹정, 킹리적)에서 파생됐습니다.",
    examples: ["동생이 내 치킨 마지막 조각 먹고 웃는데 진짜 킹받네"],
    related: ["kingjeong", "eojjeoltibi"],
  },
  {
    id: "eojjeoltibi",
    term: "어쩔티비",
    category: "reaction",
    meaning:
      "'어쩌라고, 가서 티비나 봐'라는 뜻의 장난스러운 도발 표현입니다. 상대가 '저쩔티비'로 받아치며 말장난 배틀로 이어지는 것이 특징입니다.",
    origin: "초등학생들 사이의 말장난에서 시작해 전 세대 밈이 된 것으로 알려져 있습니다.",
    examples: ["A: 너 또 지각이야? B: 어쩔티비~ A: 저쩔냉장고"],
    related: ["kingbatne", "albbano"],
  },
  {
    id: "ohiryeo-joa",
    term: "오히려 좋아",
    category: "reaction",
    meaning:
      "예상 밖의 나쁜 상황을 긍정적으로 뒤집을 때 쓰는 표현입니다. 계획이 틀어져도 '더 재밌게 됐다'고 전환하는 낙관 밈입니다.",
    origin: "한 유튜브 방송에서 유행한 말버릇이 밈으로 굳어진 것으로 알려져 있습니다.",
    examples: ["소풍날 비 옴 → 실내 데이트 각. 오히려 좋아."],
    related: ["lucky-vicky", "wonyoung-thinking"],
  },
  {
    id: "iwaejin",
    term: "이왜진",
    category: "reaction",
    meaning:
      "'이게 왜 진짜?'의 줄임말입니다. 거짓말 같은 이야기가 사실로 밝혀졌을 때의 황당함을 표현합니다.",
    origin: "커뮤니티 제목형 화법('이게 왜 진짜냐')이 줄어든 표현입니다.",
    examples: ["장난으로 산 복권이 5등 당첨… 이왜진?"],
    related: ["silhwanya", "legend"],
  },
  {
    id: "geujapchae",
    term: "그 잡채",
    category: "reaction",
    meaning:
      "'그 자체'를 발음이 비슷한 음식 이름 '잡채'로 바꿔 쓰는 말장난입니다. '완벽 그 잡채'처럼 강조 표현으로 씁니다.",
    origin: "발음 유사성을 이용한 말장난으로 예능 자막을 통해 확산됐습니다.",
    examples: ["오늘 노을 실화? 낭만 그 잡채"],
    related: ["mat-jip"],
  },
  {
    id: "riolkk",
    term: "ㄹㅇㅋㅋ",
    category: "reaction",
    meaning:
      "'리얼(real) + ㅋㅋ'의 초성 표기로, '진짜 웃기다' 또는 '완전 공감'이라는 뜻입니다. 채팅에서 가장 많이 쓰이는 만능 리액션 중 하나입니다.",
    origin: "초성 채팅 문화에서 자연 발생했습니다.",
    examples: ["A: 월요일이 제일 긴 것 같아 B: ㄹㅇㅋㅋ"],
    related: ["injeong", "kingjeong"],
  },
  {
    id: "injeong",
    term: "ㅇㅈ (인정)",
    category: "reaction",
    meaning:
      "'인정'의 초성으로, 상대 말에 동의할 때 씁니다. '인정? 어 인정'처럼 묻고 답하는 형태로도 유행했습니다.",
    origin: "초성 채팅 문화에서 정착된 표현입니다.",
    examples: ["A: 여름엔 그래도 냉면이지 B: ㅇㅈ"],
    related: ["riolkk", "kingjeong"],
  },
  {
    id: "kingjeong",
    term: "킹정",
    category: "reaction",
    meaning:
      "King + 인정의 합성어로, '완전 인정'이라는 강조 표현입니다. 반박 불가한 사실에 씁니다.",
    origin: "킹받네와 같은 King 접두어 화법에서 파생됐습니다.",
    examples: ["퇴근 직전 울리는 메신저가 제일 무섭다는 말, 킹정"],
    related: ["injeong", "kingbatne"],
  },
  {
    id: "eokka",
    term: "억까",
    category: "reaction",
    meaning:
      "'억지로 까기'의 줄임말로, 근거 없이 트집 잡아 비난하는 것을 뜻합니다. 반대로 무조건 감싸는 것은 '억빠'라고 합니다.",
    origin: "스포츠·연예 팬덤 커뮤니티의 논쟁 문화에서 생긴 표현입니다.",
    examples: ["이건 잘못이 아니라 그냥 억까지. 팩트를 보자."],
    related: ["paekpok", "jeogyeok"],
  },
  {
    id: "seonneomne",
    term: "선 넘네",
    category: "reaction",
    meaning:
      "농담이나 장난이 허용 범위를 넘었을 때 쓰는 경고성 표현입니다. 예능에서는 '선을 넘나드는 아슬아슬한 재미'라는 긍정 표현으로도 씁니다.",
    origin: "예능 자막을 통해 '선(경계)' 개념이 유행어로 자리 잡은 것으로 알려져 있습니다.",
    examples: ["내 흑역사 얘기는 좀… 선 넘네?"],
    related: ["gapbunssa", "noejeol"],
  },
  {
    id: "noejeol",
    term: "뇌절",
    category: "reaction",
    meaning:
      "같은 말이나 개그를 과하게 반복해 지겹게 만드는 것을 뜻합니다. '1절만 해, 2절 3절 뇌절까지 하지 말고'에서 온 말입니다.",
    origin: "노래의 절(1절·2절) 개념을 확장한 커뮤니티 표현입니다.",
    examples: ["그 드립 세 번째야… 뇌절이야 이제"],
    related: ["seonneomne", "eokka"],
  },
  {
    id: "hyeonta",
    term: "현타",
    category: "reaction",
    meaning:
      "'현실 자각 타임'의 줄임말로, 들떠 있다가 문득 현실을 깨닫고 허무해지는 순간을 뜻합니다. 과소비 후, 밤샘 덕질 후에 자주 옵니다.",
    origin: "온라인 커뮤니티에서 확산된 줄임말입니다.",
    examples: ["새벽 4시까지 게임하고 첫차 소리 듣는 순간 현타 옴"],
    related: ["sbulje", "dopamine-detox"],
  },
  {
    id: "silhwanya",
    term: "실화냐",
    category: "reaction",
    meaning:
      "믿기 힘든 일이 실제로 벌어졌을 때 쓰는 감탄 표현입니다. '이거 실화냐?'로 놀라움을 강조합니다.",
    origin: "영화 홍보 문구와 커뮤니티 화법을 통해 대중화된 것으로 알려져 있습니다.",
    examples: ["금요일인데 야근 실화냐…"],
    related: ["iwaejin", "legend"],
  },
  {
    id: "jjijeotda",
    term: "찢었다",
    category: "reaction",
    meaning:
      "무대나 결과물이 압도적으로 훌륭했다는 뜻의 감탄 표현입니다. '무대를 찢었다'처럼 씁니다.",
    origin: "힙합·댄스 무대 리액션에서 대중화된 표현입니다.",
    examples: ["오늘 축제 무대 그 선배가 다 찢었다며?"],
    related: ["pom-michyeotda", "legend"],
  },
  {
    id: "legend",
    term: "레전드 / 역대급",
    category: "reaction",
    meaning:
      "역사에 남을 만큼 대단하다는 뜻의 강조 표현입니다. 좋은 쪽('레전드 경기')과 나쁜 쪽('레전드 지각 사유') 모두에 씁니다.",
    origin: "스포츠 중계 표현이 일상 감탄사로 확장됐습니다.",
    examples: ["어제 그 역전승은 진짜 레전드였다"],
    related: ["jjijeotda", "regeno"],
  },
  {
    id: "eorimdo-eopji",
    term: "어림도 없지",
    category: "reaction",
    meaning:
      "상대의 시도를 단호하게 차단할 때 쓰는 밈 표현입니다. 스스로의 다짐이 무너질 때 자조적으로도 씁니다.",
    origin: "격투기 해설 밈과 커뮤니티 화법을 통해 유행한 것으로 알려져 있습니다.",
    examples: ["다이어트 중 야식? 어림도 없지 (하지만 이미 배달앱을 켰다)"],
    related: ["albbano"],
  },
  {
    id: "albbano",
    term: "알빠노",
    category: "reaction",
    meaning:
      "'내가 알 바 아니다'를 장난스럽게 표현한 말입니다. 남 눈치 안 보는 마이웨이 태도를 나타내지만, 무례하게 들릴 수 있어 친한 사이에서만 쓰는 게 안전합니다.",
    origin: "축구 커뮤니티의 유행어에서 파생된 것으로 알려져 있습니다.",
    examples: ["남들이 뭐라 하든 알빠노, 내 취향은 내가 정함"],
    related: ["eojjeoltibi", "chill-guy"],
  },

  // ───────────────── 야민정음 ─────────────────
  {
    id: "daengdaengi",
    term: "댕댕이",
    category: "yamin",
    meaning:
      "'멍멍이'를 글자 모양이 비슷한 '댕댕이'로 바꿔 쓴 말로, 강아지를 귀엽게 부르는 표준 인터넷어가 됐습니다.",
    origin: "글자 모양이 비슷한 것끼리 바꿔 쓰는 '야민정음' 놀이에서 나왔습니다 (멍→댕).",
    examples: ["산책 나온 댕댕이 보고 기분 풀림"],
    related: ["ttingjak", "keoyeopda"],
  },
  {
    id: "ttingjak",
    term: "띵작",
    category: "yamin",
    meaning:
      "'명작'의 야민정음 표기입니다 (명→띵). 명곡은 '띵곡'이라고 씁니다.",
    origin: "야민정음 표기 놀이에서 정착된 대표 사례입니다.",
    examples: ["이 영화는 10년이 지나도 띵작이다"],
    related: ["daengdaengi", "keoyeopda"],
  },
  {
    id: "keoyeopda",
    term: "커엽다",
    category: "yamin",
    meaning:
      "'귀엽다'의 야민정음 표기입니다 (귀→커). 장난스럽고 능청스러운 귀여움 표현으로 씁니다.",
    origin: "야민정음 표기 놀이에서 나온 표현입니다.",
    examples: ["화내는 것도 커엽네…"],
    related: ["daengdaengi", "ttingjak"],
  },

  // ───────────────── 방송·인터넷 밈 ─────────────────
  {
    id: "muyaho",
    term: "무야호",
    category: "broadcast",
    meaning:
      "매우 신난다는 뜻의 감탄사 밈입니다. 기쁜 일이 있을 때 '무야호~'라고 외칩니다.",
    origin:
      "무한도전 알래스카 특집에서 한 교민 어르신이 '무한도전'을 외치려다 '무야호'라고 말한 장면이 10년 뒤 역주행하며 국민 밈이 됐습니다.",
    examples: ["내일 공휴일이라고? 무야호~"],
    related: ["sadollar", "mudo-quiz"],
  },
  {
    id: "sadollar",
    term: "사딸라",
    category: "broadcast",
    meaning:
      "무조건 자기 가격을 밀어붙이는 막무가내 협상을 뜻하는 밈입니다. 협상의 여지없이 '4달러'만 반복하는 상황에서 씁니다.",
    origin: "드라마 야인시대에서 김두한이 미군과 임금 협상하며 '4딸라'를 외친 장면이 광고로 재소환되며 밈이 됐습니다.",
    examples: ["중고 거래에서 얼마냐고 물었더니 무조건 사딸라래"],
    related: ["mutgo-double", "muyaho"],
  },
  {
    id: "mutgo-double",
    term: "묻고 더블로 가",
    category: "broadcast",
    meaning:
      "손해를 만회하려고 판돈을 두 배로 키운다는 뜻의 밈입니다. 위험을 감수하고 크게 지르는 상황에 씁니다.",
    origin: "영화 타짜의 곽철용 대사가 뒤늦게 밈으로 재조명되며 유행했습니다.",
    examples: ["떡볶이 시켰는데 배고파? 묻고 더블로 가 — 튀김 추가"],
    related: ["sadollar", "flex"],
  },
  {
    id: "godbanin",
    term: "갓반인",
    category: "broadcast",
    meaning:
      "God + 일반인의 합성어로, 연예인급 외모나 실력을 가진 일반인을 뜻합니다. SNS·오디션 프로그램에서 자주 씁니다.",
    origin: "갓(최고) 접두어 문화에서 파생된 표현입니다.",
    examples: ["길거리 공연 영상 봤어? 완전 갓반인이던데"],
    related: ["manjjinnam", "godsaeng"],
  },
  {
    id: "manjjinnam",
    term: "만찢남 / 만찢녀",
    category: "broadcast",
    meaning:
      "'만화를 찢고 나온 남자/여자'의 줄임말로, 만화 주인공처럼 비현실적인 외모를 칭찬하는 말입니다.",
    origin: "웹툰 원작 드라마 캐스팅 화제와 함께 대중화된 표현입니다.",
    examples: ["그 배우는 진짜 만찢남 그 잡채"],
    related: ["godbanin", "geujapchae"],
  },
  {
    id: "amumal",
    term: "아무말 대잔치",
    category: "broadcast",
    meaning:
      "논리나 맥락 없이 아무 말이나 쏟아내는 상황을 뜻합니다. 자책('오늘 발표는 아무말 대잔치였다')과 웃음 유발 모두에 씁니다.",
    origin: "방송 자막과 커뮤니티에서 확산된 표현입니다.",
    examples: ["새벽 감성으로 쓴 일기 다시 보니 아무말 대잔치네"],
    related: ["tmt", "noejeol"],
  },
  {
    id: "tteoksang",
    term: "떡상 / 떡락",
    category: "broadcast",
    meaning:
      "가격이나 인기가 급등하는 것을 떡상, 급락하는 것을 떡락이라고 합니다. 주식·코인에서 시작해 조회수·인기 전반에 씁니다.",
    origin: "주식·암호화폐 커뮤니티 은어가 일상어로 확장됐습니다.",
    examples: ["영상 하나가 알고리즘 타고 떡상해서 구독자 3배 됨"],
    related: ["jonbeo", "algorithm"],
  },
  {
    id: "jmt",
    term: "JMT / 존맛탱",
    category: "broadcast",
    meaning:
      "매우 맛있다는 뜻의 속어를 영문 이니셜로 표기한 것입니다. 어원에 비속어가 포함되어 격식 있는 자리에서는 '꿀맛' 정도로 순화하는 게 좋습니다.",
    origin: "SNS 맛집 후기 문화와 함께 대중화됐습니다.",
    examples: ["이 집 떡볶이 진짜 JMT라서 웨이팅 30분 각오해야 함"],
    related: ["gunssak", "mat-jip"],
  },
  {
    id: "mat-jip",
    term: "맛집",
    category: "broadcast",
    meaning:
      "원래 음식이 맛있는 가게를 뜻하지만, 지금은 '잘하는 곳' 전반으로 확장됐습니다. '농구 맛집', '리뷰 맛집'처럼 씁니다.",
    origin: "맛있는 집이라는 본뜻이 커뮤니티 화법에서 은유로 확장됐습니다.",
    examples: ["이 채널은 자막 맛집이라 안 웃을 수가 없음"],
    related: ["jmt", "geujapchae"],
  },
  {
    id: "flex",
    term: "플렉스 (FLEX)",
    category: "broadcast",
    meaning:
      "돈이나 귀중품을 과시하며 소비하는 것을 뜻합니다. '오늘 월급 받아서 플렉스 해버렸다'처럼 자랑 반, 자기만족 반으로 씁니다.",
    origin: "힙합 문화의 과시 표현이 국내 힙합 예능을 통해 대중화된 것으로 알려져 있습니다.",
    examples: ["보너스 기념으로 신발 플렉스 완료"],
    related: ["gasimbi", "mutgo-double"],
  },
  {
    id: "algorithm",
    term: "알고리즘이 나를 이끌었다",
    category: "broadcast",
    meaning:
      "유튜브 등 추천 알고리즘 때문에 의도치 않은 영상을 보게 됐다는 밈입니다. 새벽에 이상한 영상을 보고 있는 자신을 변명할 때 씁니다.",
    origin: "유튜브 추천 시스템이 일상화되며 생긴 표현입니다.",
    examples: ["분명 공부 영상 틀었는데 정신 차리니 새벽 3시에 상어 다큐… 알고리즘이 날 이끌었다"],
    related: ["tteoksang", "dopamine-detox"],
  },
  {
    id: "challenge",
    term: "챌린지",
    category: "broadcast",
    meaning:
      "노래·춤·행동을 따라 하고 짧은 영상으로 공유하는 유행 놀이를 뜻합니다. 신곡 홍보의 표준 문법이 됐습니다.",
    origin: "숏폼 플랫폼(틱톡·릴스·쇼츠)의 확산과 함께 정착했습니다.",
    examples: ["이 노래 챌린지 요즘 안 한 사람이 없던데?"],
    related: ["slickback", "malatanghulu"],
  },
  {
    id: "healing",
    term: "힐링",
    category: "broadcast",
    meaning:
      "지친 몸과 마음을 회복하는 활동 전반을 뜻합니다. 자연, 맛있는 음식, 반려동물 영상 등 '나를 달래주는 모든 것'에 붙입니다.",
    origin: "웰빙 트렌드 이후 방송·광고를 통해 일상어로 정착했습니다.",
    examples: ["주말엔 아무 계획 없이 카페에서 힐링할 거야"],
    related: ["sohwakhaeng", "chill-guy"],
  },
  {
    id: "insa-assa",
    term: "인싸 / 아싸",
    category: "broadcast",
    meaning:
      "인싸는 무리에 잘 어울리는 인사이더, 아싸는 무리 밖에서 혼자를 즐기는 아웃사이더를 뜻합니다. 지금은 우열이 아니라 성향 표현으로 씁니다.",
    origin: "대학가 은어가 방송을 통해 전국적으로 퍼진 것으로 알려져 있습니다.",
    examples: ["난 회식보다 집이 좋은 자발적 아싸야"],
    related: ["honkono", "mbti-boom"],
  },
  {
    id: "mbti-boom",
    term: "MBTI 과몰입",
    category: "broadcast",
    meaning:
      "모든 상황을 MBTI로 해석하려는 태도를 뜻합니다. '역시 파워 J네', '완전 INFP 감성' 같은 대화가 대표적입니다. 첫 만남 단골 질문이 혈액형에서 MBTI로 바뀌었습니다.",
    origin: "2020년 전후 무료 온라인 성격 테스트의 폭발적 유행과 함께 생긴 문화입니다.",
    examples: ["지각한 것도 P라서 그런 거야? 그건 그냥 늦잠이야…"],
    related: ["neo-t-ya", "insa-assa"],
  },
  {
    id: "mudo-quiz",
    term: "~하면 어떡하지?",
    category: "broadcast",
    meaning:
      "일어나지 않은 일을 미리 걱정하는 상황극 밈입니다. 쓸데없는 걱정을 유쾌하게 풍자할 때 씁니다.",
    origin: "예능 속 걱정 많은 캐릭터들의 상황극이 밈화된 것으로 알려져 있습니다.",
    examples: ["로또 1등 되면 회사 어떻게 그만두지? — 일단 사고 나서 걱정해"],
    related: ["muyaho", "amumal"],
  },

  // ───────────────── 게임에서 온 말 ─────────────────
  {
    id: "goinmul",
    term: "고인물",
    category: "game",
    meaning:
      "한 분야를 너무 오래 해서 실력이 비정상적으로 높은 사람을 뜻합니다. 물이 오래 고이면 썩는다는 비유지만, 실제로는 존경 반 경외 반의 표현입니다.",
    origin: "온라인 게임에서 오래된 유저를 가리키던 말이 모든 취미 영역으로 확장됐습니다.",
    examples: ["10년 차 고인물이 뉴비 가르쳐주는 게 제일 든든하지"],
    related: ["newbie", "manleb", "jjamba"],
  },
  {
    id: "newbie",
    term: "뉴비",
    category: "game",
    meaning:
      "newbie, 즉 신규 입문자를 뜻합니다. 반대말은 고인물·고수입니다. '뉴비 환영'은 커뮤니티의 개방성을 보여주는 문구입니다.",
    origin: "영어권 게임 용어가 그대로 정착했습니다.",
    examples: ["뉴비인데 뭐부터 하면 되나요? — 일단 튜토리얼부터!"],
    related: ["goinmul", "manbanjalbu"],
  },
  {
    id: "hyeonjil",
    term: "현질",
    category: "game",
    meaning:
      "게임 아이템을 현금으로 구매하는 것을 뜻합니다. '현질 유도가 심하다'처럼 과금 구조 비판에도 쓰입니다.",
    origin: "'현금'과 행위를 뜻하는 접미사 '-질'이 합쳐진 게임 은어입니다.",
    examples: ["무과금으로 버티다 결국 현질의 길로…"],
    related: ["flex", "goinmul"],
  },
  {
    id: "carry",
    term: "캐리",
    category: "game",
    meaning:
      "팀을 승리로 이끄는 것을 뜻합니다(carry). 게임 밖에서도 '조별과제를 캐리했다'처럼 팀을 하드캐리한 사람에게 씁니다.",
    origin: "AOS 장르 게임에서 팀 승리를 책임지는 역할 용어에서 왔습니다.",
    examples: ["오늘 발표는 막내가 하드캐리했다"],
    related: ["bus", "troll"],
  },
  {
    id: "bus",
    term: "버스 태우다",
    category: "game",
    meaning:
      "실력자가 못하는 사람을 데리고 다니며 혜택을 누리게 해주는 것을 뜻합니다. 얻어 가는 쪽은 '버스 탄다', 이끄는 쪽은 '버스 기사'입니다.",
    origin: "온라인 게임에서 고수가 초보의 성장을 도와주던 문화에서 나왔습니다.",
    examples: ["시험 족보 다 정리해주는 친구 덕에 이번 학기 버스 탔다"],
    related: ["carry", "goinmul"],
  },
  {
    id: "aggro",
    term: "어그로",
    category: "game",
    meaning:
      "일부러 자극적인 말과 행동으로 관심을 끄는 것을 뜻합니다. '어그로 끌지 마'는 관심을 노린 도발을 멈추라는 말입니다.",
    origin: "게임에서 몬스터의 공격 대상을 뜻하는 용어(aggro)가 '주의를 끈다'는 의미로 확장됐습니다.",
    examples: ["제목으로 어그로 끌었는데 내용은 알맹이가 없네"],
    related: ["troll", "jeogyeok"],
  },
  {
    id: "troll",
    term: "트롤",
    category: "game",
    meaning:
      "고의로 팀에 피해를 주거나 판을 망치는 행위, 또는 그런 사람을 뜻합니다. '트롤링하다'라는 동사로도 씁니다.",
    origin: "북유럽 괴물 트롤에서 온 영어권 인터넷 용어가 게임을 통해 정착했습니다.",
    examples: ["다 이긴 게임을 혼자 트롤해서 역전당함"],
    related: ["aggro", "carry"],
  },
  {
    id: "manleb",
    term: "만렙",
    category: "game",
    meaning:
      "게임의 최고 레벨(만 레벨)을 뜻하며, 어떤 분야의 경지에 오른 사람에게 씁니다. '눈치 만렙', '요리 만렙'처럼 씁니다.",
    origin: "온라인 게임의 레벨 시스템에서 나온 표현입니다.",
    examples: ["결혼 10년 차, 아내 눈빛만 봐도 아는 눈치 만렙이 됐다"],
    related: ["goinmul", "jjamba"],
  },
  {
    id: "jeogyeok",
    term: "저격",
    category: "game",
    meaning:
      "특정인을 겨냥해 공개적으로 비판하는 것을 뜻합니다. 이름을 말하지 않아도 누군지 알게 하는 '돌려 저격'도 있습니다. 갈등을 키우는 행동이라 신중해야 합니다.",
    origin: "게임에서 특정 상대를 노리는 행위가 SNS 발언 문화로 확장됐습니다.",
    examples: ["그 게시글, 누가 봐도 나 저격 아니야?"],
    related: ["aggro", "eokka"],
  },

  // ───────────────── 덕질·연애 용어 ─────────────────
  {
    id: "choeae",
    term: "최애 / 차애",
    category: "fandom",
    meaning:
      "최애는 가장 사랑하는 대상(멤버·캐릭터·음식), 차애는 그다음으로 좋아하는 대상을 뜻합니다. '최애의 최는 최고의 최'라는 말처럼 덕질의 중심 개념입니다.",
    origin: "일본 팬덤 용어 '오시(推し)'의 번역어로 국내 팬덤에 정착한 것으로 알려져 있습니다.",
    examples: ["최애가 웃으면 나도 웃는다. 그게 덕후의 삶."],
    related: ["ipdeok", "seongdeok", "sonminsoo"],
  },
  {
    id: "ipdeok",
    term: "입덕 / 탈덕",
    category: "fandom",
    meaning:
      "입덕은 팬이 되는 것(덕후 세계에 입장), 탈덕은 팬을 그만두는 것입니다. 입덕 계기가 된 영상은 '입덕 영상'이라고 합니다.",
    origin: "'덕후(오타쿠의 국내식 표현)'에 출입 개념을 붙인 조어입니다.",
    examples: ["우연히 본 무대 영상 하나로 입덕했다. 이제 콘서트 티켓팅 인생 시작."],
    related: ["choeae", "deokjil", "seongdeok"],
  },
  {
    id: "seongdeok",
    term: "성덕",
    category: "fandom",
    meaning:
      "'성공한 덕후'의 줄임말로, 좋아하던 대상을 실제로 만나거나 그 분야에서 직업적으로 성공한 팬을 뜻합니다.",
    origin: "팬덤 커뮤니티에서 만들어진 줄임말입니다.",
    examples: ["어릴 때 좋아하던 가수와 같은 무대에 서다니, 진정한 성덕이다"],
    related: ["ipdeok", "choeae"],
  },
  {
    id: "deokjil",
    term: "덕질",
    category: "fandom",
    meaning:
      "좋아하는 대상을 파고드는 팬 활동 전반을 뜻합니다. 굿즈 수집, 영상 반복 시청, 정보 정리까지 모두 덕질입니다.",
    origin: "덕후 + 행위 접미사 '-질'의 합성어입니다.",
    examples: ["월급의 절반은 덕질에 쓰지만 행복하니까 됐다"],
    related: ["ipdeok", "paenajeo", "n-cha"],
  },
  {
    id: "paenajeo",
    term: "팬아저",
    category: "fandom",
    meaning:
      "'팬은 아니지만 저장'의 줄임말입니다. 팬이 아닌데도 저장할 만큼 사진·영상이 훌륭하다는 칭찬입니다.",
    origin: "SNS 댓글 문화에서 생긴 줄임말입니다.",
    examples: ["팬아저… 이 직캠은 소장 가치가 있다"],
    related: ["godbanin", "deokjil"],
  },
  {
    id: "jeongjuhaeng",
    term: "정주행",
    category: "fandom",
    meaning:
      "드라마·웹툰 등을 1화부터 끝까지 몰아서 보는 것을 뜻합니다. 거꾸로 최신화부터 보는 것은 '역주행'인데, 역주행은 '차트 역주행(뒤늦은 인기)'이라는 뜻으로 더 자주 씁니다.",
    origin: "도로 주행 개념을 콘텐츠 감상에 비유한 표현입니다.",
    examples: ["주말 반납하고 시즌 3까지 정주행 완료"],
    related: ["n-cha", "spo", "sbulje"],
  },
  {
    id: "spo",
    term: "스포",
    category: "fandom",
    meaning:
      "스포일러(spoiler)의 줄임말로, 작품의 중요한 내용을 미리 알려버리는 것을 뜻합니다. '스포 주의'는 인터넷 관람 예절의 기본입니다.",
    origin: "영어 spoiler의 줄임말로 정착했습니다.",
    examples: ["결말 스포하면 절교야"],
    related: ["jeongjuhaeng", "n-cha"],
  },
  {
    id: "n-cha",
    term: "N차 관람",
    category: "fandom",
    meaning:
      "같은 영화·공연을 여러 번(N번) 관람하는 것을 뜻합니다. 회차를 거듭할수록 새로운 게 보인다는 '회전문 관객'과 함께 씁니다.",
    origin: "뮤지컬·영화 팬덤의 반복 관람 문화에서 나온 표현입니다.",
    examples: ["이 영화 벌써 4차 관람이야. 볼 때마다 새로운 게 보여."],
    related: ["jeongjuhaeng", "deokjil"],
  },
  {
    id: "some",
    term: "썸",
    category: "fandom",
    meaning:
      "사귀기 전, 서로 호감을 확인해가는 미묘한 관계를 뜻합니다. something에서 온 말로, '썸 타다'라고 씁니다.",
    origin: "영어 something이 줄어든 표현으로, 2014년 동명의 노래로 완전히 대중화됐습니다.",
    examples: ["매일 연락하는데 사귀자는 말은 없음 — 전형적인 썸이네"],
    related: ["samguida", "eojang"],
  },
  {
    id: "samguida",
    term: "삼귀다",
    category: "fandom",
    meaning:
      "'사귀다'의 전 단계라는 뜻의 말장난입니다. 사귀는 것(4)보다 하나 낮은 단계(3)로, 썸보다 진지하지만 아직 연인은 아닌 관계를 뜻합니다.",
    origin: "숫자 말장난(사→4, 삼→3)에서 나온 신조어입니다.",
    examples: ["우리 사귀는 건 아니고… 삼귀는 중이야"],
    related: ["some", "jamanchu"],
  },
  {
    id: "eojang",
    term: "어장관리",
    category: "fandom",
    meaning:
      "여러 사람에게 애매한 호감을 유지하며 관계를 저울질하는 것을 뜻합니다. 물고기(호감 가진 사람들)를 어장에 가둬두고 관리한다는 비유입니다.",
    origin: "연애 상담 커뮤니티에서 정착된 비유 표현입니다.",
    examples: ["새벽에만 연락 오는 거, 그거 어장관리야. 정신 차려."],
    related: ["some", "hwanseung"],
  },
  {
    id: "hwanseung",
    term: "환승이별",
    category: "fandom",
    meaning:
      "새로운 사람을 만들어놓고 기존 연인과 헤어지는 것을 뜻합니다. 버스 환승처럼 공백 없이 갈아탄다는 비유로, 연애 예능 제목으로도 쓰이며 대중화됐습니다.",
    origin: "교통 환승 개념을 연애에 비유한 표현입니다.",
    examples: ["헤어진 지 일주일 만에 새 연인? 환승이별 의심각"],
    related: ["eojang", "some"],
  },
  {
    id: "honkono",
    term: "혼코노",
    category: "fandom",
    meaning:
      "'혼자 코인 노래방'의 줄임말입니다. 혼밥·혼술처럼 혼자 즐기는 문화의 대표 사례로, 스트레스 해소법으로 인기입니다.",
    origin: "혼자 문화(혼밥·혼술) 확산과 코인 노래방 유행이 만나 생긴 줄임말입니다.",
    examples: ["시험 끝나고 혼코노 2시간 때리고 옴. 목은 나갔지만 스트레스 청산."],
    related: ["insa-assa", "healing"],
  },
  {
    id: "nunting",
    term: "눈팅",
    category: "fandom",
    meaning:
      "글이나 채팅을 쓰지 않고 눈으로 보기만 하는 것을 뜻합니다. '눈팅만 하다가 처음 글 씁니다'는 커뮤니티의 클래식 인사입니다.",
    origin: "눈 + 채팅의 합성어로 PC통신 시절부터 이어진 표현으로 알려져 있습니다.",
    examples: ["단톡방에서 3년째 눈팅 중. 답장은 마음속으로 했어."],
    related: ["pingpeu", "insa-assa"],
  },
  {
    id: "jotdaetgualarm",
    term: "좋댓구알",
    category: "fandom",
    meaning:
      "'좋아요·댓글·구독·알림설정'의 줄임말로, 유튜버들의 마무리 멘트 공식입니다.",
    origin: "유튜브 크리에이터 문화에서 정착된 줄임말입니다.",
    examples: ["영상이 도움됐다면 좋댓구알 부탁드려요!"],
    related: ["algorithm", "tteoksang"],
  },
];

export const memeMap: Record<string, MemeEntry> = Object.fromEntries(
  memes.map((m) => [m.id, m])
);

export function getMeme(id: string): MemeEntry | undefined {
  return memeMap[id];
}

export function memesByCategory(cat: MemeCategoryId): MemeEntry[] {
  return memes.filter((m) => m.category === cat);
}
